from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for
import os
import json
import time
import threading
from flask_cors import CORS
import requests
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

local_models_folder = "local_models"
global_models_folder = "global_models"
client_files = {}
num_clients = 0

# Ensure the folders exist
os.makedirs(local_models_folder, exist_ok=True)
os.makedirs(global_models_folder, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/logo.png')
def logo():
    return send_from_directory('static', 'logo.png')

@app.route('/start_aggregation', methods=['POST'])
def start_aggregation():
    global num_clients
    num_clients = int(request.form['num_clients'])
    threading.Thread(target=wait_for_clients).start()
    return render_template('waiting.html', num_clients=num_clients)

def wait_for_clients():
    global num_clients
    received_files = 0
    while received_files < num_clients:
        files = os.listdir(local_models_folder)
        received_files = len(files)
        update_clients_status(received_files)
        time.sleep(1)
    aggregate_models()

def update_clients_status(received_files):
    with app.app_context():
        socketio.emit('update_status', {'received': received_files, 'total': num_clients})

def aggregate_models():
    files = os.listdir(local_models_folder)
    state_dicts = [load_state_dict_from_json(os.path.join(local_models_folder, file)) for file in files]
    average_model = average_state_dicts(state_dicts)
    averaged_model_name = os.path.join(global_models_folder, "averaged_model.json")
    with open(averaged_model_name, "w") as f:
        json.dump(average_model, f)
    send_global_model_to_clients()
    reset_local_models_folder()
    with app.app_context():
        socketio.emit('aggregation_complete')
    return

def load_state_dict_from_json(json_file_path):
    with open(json_file_path, "r") as f:
        state_dict_serializable = json.load(f)
    return state_dict_serializable

def average_state_dicts(state_dicts):
    avg_state_dict = {}
    for k, v in state_dicts[0].items():
        if isinstance(v, list):
            if isinstance(v[0], list):
                avg_state_dict[k] = [[0.0] * len(v[0]) for _ in v]
            else:
                avg_state_dict[k] = [0.0] * len(v)
        else:
            avg_state_dict[k] = 0.0
    for state_dict in state_dicts:
        for k, v in state_dict.items():
            if isinstance(v, list):
                if isinstance(v[0], list):
                    for i in range(len(v)):
                        for j in range(len(v[i])):
                            avg_state_dict[k][i][j] += v[i][j]
                else:
                    for i in range(len(v)):
                        avg_state_dict[k][i] += v[i]
            else:
                avg_state_dict[k] += v
    for k, v in avg_state_dict.items():
        if isinstance(v, list):
            if isinstance(v[0], list):
                for i in range(len(v)):
                    for j in range(len(v[i])):
                        avg_state_dict[k][i][j] /= len(state_dicts)
            else:
                avg_state_dict[k] = [x / len(state_dicts) for x in v]
        else:
            avg_state_dict[k] /= len(state_dicts)
    return avg_state_dict

def send_global_model_to_clients():
    global client_files
    averaged_model_path = os.path.join(global_models_folder, "averaged_model.json")
    with open(averaged_model_path, "r") as f:
        averaged_model = json.load(f)
    for client_id, client_address in client_files.items():
        response = requests.post(f"{client_address}/receive_model", json=averaged_model)
        if response.status_code != 200:
            print(f"Failed to send model to client {client_id}: {response.text}")

@app.route('/upload', methods=['POST'])
def upload():
    global client_files
    client_id = request.args.get('client_id')
    client_address = request.args.get('client_address')
    filename = f"{client_id}_model.json"
    client_files[client_id] = client_address
    data = request.json
    save_processed_data(data, filename)
    return jsonify({"message": "Data uploaded successfully."}), 200

def save_processed_data(data, filename):
    full_path = os.path.join(local_models_folder, filename)
    with open(full_path, "w") as f:
        json.dump(data, f)
    print(f"Data saved successfully to {full_path}")

@app.route('/reset', methods=['POST'])
def reset():
    reset_local_models_folder()
    with app.app_context():
        socketio.emit('server_reset')
    return jsonify({"message": "Local models folder reset successfully."}), 200

def reset_local_models_folder():
    for filename in os.listdir(local_models_folder):
        file_path = os.path.join(local_models_folder, filename)
        if os.path.isfile(file_path):
            os.unlink(file_path)

@app.route('/contents/<folder>', methods=['GET'])
def contents(folder):
    try:
        folder_path = f"{folder}_models"
        files = os.listdir(folder_path)
        return jsonify({'files': files}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)

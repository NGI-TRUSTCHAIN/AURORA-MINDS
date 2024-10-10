# AURORA-MINDS (Web App)

## Project Setup

1.Create a new empty project with your favorite IDE (e.g., PyCharm)

2.Add the folders/files from the repo to the new project

**A. Backend Project Folder Setup**

1.In the root directory of the new project, create a local `venv` folder (see how [here](https://stackoverflow.com/a/59895890))

2.Move the `requirements.txt` file from the `backend` folder to the `root directory` of the new project

3.Then, run the command `pip install -r requirements.txt` to install the necessary packages/dependencies

4.An `.env` file has to be placed inside the `backend` folder, that file will be given by the project's supervisor

5.In the `backend` folder directory, run the migration commands

* `python manage.py makemigrations`
* `python manage.py migrate`

6.Similarly, run the command `python manage.py runserver` to start the backend server

7.Before making any commit, ensure all the unit tests pass by running `python manage.py test`


**B. Frontend Project Folder Setup**

1.In the `frontend` folder directory, run the command `npm install`

2.An `.env` file has to be placed inside the `frontend` folder, that file will be given by the project's supervisor

3.Then, run the command `npm run dev` to start the frontend app


**Note: The ** *** 'Aurora-Minds FastAPI server' *** ** should also be running in the background so that all the functionalities of this web app to run properly.**

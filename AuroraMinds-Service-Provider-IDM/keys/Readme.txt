To quickly generate a certificate for SSL that contains the IP/DNS name needed for deployment you can use the command:
openssl req -nodes -new -x509 -keyout server.key -out server.cert -addext "subjectAltName = DNS:name,IP:X.X.X.X"

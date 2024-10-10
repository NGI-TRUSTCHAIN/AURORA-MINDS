# Aurora Minds
This project contains a service provider for the Aurora Minds project.
The use case is a parent visiting a clinic where children can participate in an ADHD game-test, which, when finished, shows results about the possability of children having ADHD. To do so, one needs to authenticate using the Aurora Minds Front and vIDP using credential.
This project contains the website of the clinic. Furthermore, it contains a verifier, in which one can verify a pABC token.
## Build
To build the project run 
    > npm run build

## Run
To run the project run
    > npm start

This will start the website on localhost:3000, running a supporting pABC verifier on localhost:3030 (can be accessed through the webserver endpoints on localhost:3000 or https://localhost:3001).

## Configuration
Note that the supporting pABC verifier connects to the deployed IdPs through https. Thus, you need to copy the file *olympus-identity/oidc-demo-idp/src/test/resources/volatile/truststore.jks* to the *olympus-service-provider/server/ol-lib* directory (replacing the *truststore.jks* file in that location if there was any). 

If the pABC verifier is correctly launched and setup, the message 'Verifier setup at port 3030' will appear (will take 5~7 seconds).

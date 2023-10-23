# Welcome to Togar.js

## Local Environment Setup
This is a step-by-step guide on how to setup a local enviroment for Togar.js. Let get started:
### Installing Node.js
1. Download Node by visiting:  **https://nodejs.org/en**
### Run Setup CMDs
```shell
git clone https://github.com/olivermclane/Togar.js
cd Togar.js
```
```shell
npm install
```
### Database Setup

The next step will be to set up the database for storing image information and storing user data. This will be a important step in running the application so do not skip this step.
1. Install Docker on your computer if you haven't already.

   **Docker for Windows:** https://docs.docker.com/docker-for-windows/install/
      
   **Docker for Mac:** https://docs.docker.com/docker-for-mac/install/
      
   **Docker for Ubuntu:** https://docs.docker.com/engine/install/ubuntu/
      
   **Docker for Debian:** https://docs.docker.com/engine/install/debian/
      
   **Docker for CentOS:** https://docs.docker.com/engine/install/centos/

2. Lets take at look at our dockerfile which is located in our config folder. We must put in the values for each of the following: **POSTGRES_PASSWORD,POSTGRES_DB,and POSTGRES_USER** 
    ```shell
    FROM postgres:latest
    
    # Set the superuser password for PostgreSQL
    ENV POSTGRES_PASSWORD =  # Chosen Password
    
    # Create a new database
    ENV POSTGRES_DB = # Chosen Database Name
    
    # Creating PG user
    ENV POSTGRES_USER = # Chosen PG user
    ```
2. Build the Docker image by running the following command: 
```dockerfile
docker build -t togarjsdatabase -f config/dockerfile.yaml .
```
3. Start a Docker container from the image with the following command:
``` dockerfile
docker run --name anynameofchoice -p 5432:5432 -d togarjsdatabase
```
4. Verify that the container is running by running the following command:
``` dockerfile
docker ps 
```
5. You've created the database and can move on to the .env template changes.

### Creating Local .env File
The following command will take the .env.template and convert it to our .env file:
```shell
cp .env.template .env
```
The .env.template is a template for all the environment variables used in the project, once you've created your database you can begin to fill these values in. Here is the file structure with the notes for each value:
```python
  SESSION_SECRET = "" # This can be any value you wish
  DB_HOST = "" # dockerfile.yaml value: POSTGRES_DB
  DB_USER = "" # dockerfile.yaml value: POSTGRES_USER
  DB_PASSWORD = "" # dockerfile.yaml value: POSTGRES_PASSWORD
  DB_NAME = "togarjsdatabase" 
```
### Running the application
We have now reached the position of starting the application, verify you database instance is running and start the application using:
``` shell
node app.js
```
Now visit **http://localhost:3000**.
## Contributing
## Troubleshooting
## Documentation
### PlantUML

## Notes



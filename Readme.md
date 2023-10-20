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

The next step will be to set up the database for storing image information and storing user data. This will be a important step in running the application so do not skip this step
1. Install Docker on your computer if you haven't already.

   **Docker for Windows:** https://docs.docker.com/docker-for-windows/install/
      
   **Docker for Mac:** https://docs.docker.com/docker-for-mac/install/
      
   **Docker for Ubuntu:** https://docs.docker.com/engine/install/ubuntu/
      
   **Docker for Debian:** https://docs.docker.com/engine/install/debian/
      
   **Docker for CentOS:** https://docs.docker.com/engine/install/centos/

2. Build the Docker image by running the following command: **docker build -t "nameofdb" -f docker/dockerfile.yaml .**
3. Start a Docker container from the image with the following command: **docker run --name "{nameofcontainer}" -p 5432:5432 -d "{nameofdb}"**
4. Verify that the container is running by running the following command: **docker ps**
5. You've created the database and can move on to running the application.

### Creating Local .env File
The following command will create the
```shell
cp .env.template .env
```
The .env.template is a template for all of the enviroment variables used in the project, once you've created your database you can begin to fill these values in. Here is the file structure with the noted values:
```python
  SESSION_SECRET = "" # This can be any value you wish
  DB_HOST = "" # This is the name of DB from above
  DB_USER = "" # This will be the value from the dockerfile for the user
  DB_PASSWORD = "" # This will be the value of the dockerfile
  DB_NAME = "" # This will be the name of the DB you've chosen in the dockerfile
```

## Contributing
## Troubleshooting
## Documentation
## Notes



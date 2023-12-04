# Welcome to Togar.js
The Node.js application, incorporating Passport, Multer, Jest for testing, Pino, and Express.js, empowers users to upload images and access their image gallery. When initiating an image upload, users select the image file. If the file fails validation, the method redirects the user to the image gallery view with an associated error message. Conversely, upon successful validation, the method saves the image to the server file system and redirects the user to the image gallery view. The user's image gallery is populated by retrieving a list of image streams for the specified user through the Image service. Each image is then converted into a base64-encoded string and added to a list of image pairs that includes the image source and content type. This list is subsequently assigned to the model attribute "images" and displayed in the view. In summary, the application is a fundamental image uploading and viewing web app designed for handling multipart files within a Node.js setup, with stored images on the server file system and display capabilities on the front-end.

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

  IMAGE_DIRECTORY = "" # Location where images are saved from application

```
### Running the application
We have now reached the position of starting the application, verify you database instance is running and start the application using:
``` shell
node app.js
```
Now visit **http://localhost:3000**.


### Database Operations
1. Open a terminal prompt.
2. Type **docker ps** and grab the container_id.
3. Type **docker exec -it {container_id} bash**
4. Type **psql -U postgres -d TogarData -h localhost**
5. Dig around the database:

       a. Type \dt to view avaliable tables.
       
       b. Select * from user_image; to view images saved by all users.
   
       c. Select * from logindata; to view user instances
   
## Contributing
## Troubleshooting
## Documentation
- [HTML Documentation](https://olivermclane.github.io/Togar.js/)

### PlantUML

## Notes



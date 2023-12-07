const request = require('supertest');
const fs = require('fs');
const app = require('../app');
const database = require('../models');
const User = database.users;

async function findUserByUsername(username) {
    try {
        // Query the database to find users matching the provided username
        const users = await User.findAll({ where: {username: username} });
        // Return the first user found
        return (users instanceof Array) ? users[0] : null;
    } catch (ex) {
        // Handle exceptions if the database query fails
        throw ex;
    }
}

// HELPERS
// Clears database entries used after each test.
const clearDatabase = async () => {
    await database.users.destroy({ where: {}});

};


// Reads the files in so we can compare the images after the tests to make sure they are equal.
function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Unit tests for image upload functionality
describe('Image Upload Tests', () => {
    let agent;  // Declare the agent variable outside the test function

    beforeEach(async () => {
        await clearDatabase();
        agent = request.agent(app);  // Create a new agent before each test
    });

    test('ValidFile_.jpg_Success', async () => {

        // Execute register using the POST request
        const registrationResponse = await agent
            .post('/register')
            .send({
                username: 'testUser'
            });

        // Expect successful registration
        expect(registrationResponse.status).toBe(302);
        expect(registrationResponse.header.location).toBe('login');

        // Execute login using the POST request
        const loginResponse = await agent
            .post('/login')
            .send({ username: 'testUser' });

        // Expect successful login
        expect(loginResponse.status).toBe(302);
        expect(loginResponse.header.location).toBe('togar');

        // Execute actual image upload using the POST request
        const uploadResponse = await agent
            .post('/togar/upload')
            .attach('imageFile', '/testingImages/mockedFile.jpg');

        // Expecting a redirect to /togar
        expect(uploadResponse.status).toBe(302);
        expect(uploadResponse.header.location).toBe('/togar');
        const user = await findUserByUsername('testUser');
        // Retrieve the rendered view after the image upload
        const viewResponse = await agent.get('/togar');
        expect(readFile('/testingImages/mockedFile.jpg') === readFile(process.env.IMAGE_DIRECTORY + user.id+ "/mockedFile.jpg"));

        // Extract the base64-encoded images from the rendered view
        expect(viewResponse.text.includes('data:image')).toBeTruthy();

        // Clean up by logging out the user
        await agent.get('/logout');
    });
    test('ValidFile_.jpeg_Success', async () => {

        // Execute register using the POST request
        const registrationResponse = await agent
            .post('/register')
            .send({
                username: 'testUser'
            });

        // Expect successful registration
        expect(registrationResponse.status).toBe(302);

        // Execute login using the POST request
        const loginResponse = await agent
            .post('/login')
            .send({ username: 'testUser' });

        // Expect successful login
        expect(loginResponse.status).toBe(302);
        expect(loginResponse.header.location).toBe('togar');

        // Execute actual image upload using the POST request
        const uploadResponse = await agent
            .post('/togar/upload')
            .attach('imageFile', '/testingImages/mockedFile.jpeg');

        // Expecting a redirect to /togar
        expect(uploadResponse.status).toBe(302);
        expect(uploadResponse.header.location).toBe('/togar');

        // Check if the file exists in the specified directory
        const user = await findUserByUsername('testUser');

        // Ensure that the user is found and has an 'id' property
        expect(user).toBeTruthy();
        expect(user.id).toBeDefined();

        // Check if the file exists in the specified directory
        expect(readFile('/testingImages/mockedFile.jpeg') === readFile(process.env.IMAGE_DIRECTORY + user.id + "/mockedFile.jpeg"));
        const viewResponse = await agent.get('/togar');

        expect(viewResponse.text.includes('data:image')).toBeTruthy();

        // Clean up by logging out the user
        await agent.get('/logout');
    });
    test('ValidFile_.png_Success', async () => {
        // Execute register using the POST request
        const registrationResponse = await agent
            .post('/register')
            .send({
                username: 'testUser'
            });

        // Expect successful registration
        expect(registrationResponse.status).toBe(302);

        // Execute login using the POST request
        const loginResponse = await agent
            .post('/login')
            .send({ username: 'testUser' });

        // Expect successful login
        expect(loginResponse.status).toBe(302);
        expect(loginResponse.header.location).toBe('togar');

        // Execute actual image upload using the POST request
        const uploadResponse = await agent
            .post('/togar/upload')
            .attach('imageFile', '/testingImages/mockedFile.png');

        // Expecting a redirect to /togar
        expect(uploadResponse.status).toBe(302);
        expect(uploadResponse.header.location).toBe('/togar');

        // Check if the file exists in the specified directory
        const user = await findUserByUsername('testUser');

        // Ensure that the user is found and has an 'id' property
        expect(user).toBeTruthy();
        expect(user.id).toBeDefined();

        // Check if the file exists in the specified directory
        expect(readFile('/testingImages/mockedFile.png') === readFile(process.env.IMAGE_DIRECTORY + user.id + "/mockedFile.png"));
        const viewResponse = await agent.get('/togar');

        expect(viewResponse.text.includes('data:image')).toBeTruthy();

        // Clean up by logging out the user
        await agent.get('/logout');
    });

    test('TwoValidFile_.jpg_.png_Success', async () => {
        // Execute register using the POST request
        const registrationResponse = await agent
            .post('/register')
            .send({
                username: 'testUser',
            });

        // Expect successful registration
        expect(registrationResponse.status).toBe(302);

        // Execute login using the POST request
        const loginResponse = await agent
            .post('/login')
            .send({ username: 'testUser' });

        // Expect successful login
        expect(loginResponse.status).toBe(302);
        expect(loginResponse.header.location).toBe('togar');

        // Execute actual image upload using the POST request for mockedFile.png
        const uploadResponsePNG = await agent
            .post('/togar/upload')
            .attach('imageFile', '/testingImages/mockedFile.png');

        // Expecting a redirect to /togar
        expect(uploadResponsePNG.status).toBe(302);
        expect(uploadResponsePNG.header.location).toBe('/togar');

        // Retrieve the rendered view after the image upload
        const viewResponsePNG = await agent.get('/togar');

        // Extract the base64-encoded images from the rendered view
        expect(viewResponsePNG.text.includes('data:image')).toBeTruthy();

        // Execute actual image upload using the POST request for mockedFile.jpeg
        const uploadResponseJPEG = await agent
            .post('/togar/upload')
            .attach('imageFile', '/testingImages/mockedFile.jpeg');

        // Expecting a redirect to /togar
        expect(uploadResponseJPEG.status).toBe(302);
        expect(uploadResponseJPEG.header.location).toBe('/togar');

        // Retrieve the rendered view after the image upload
        const viewResponseJPEG = await agent.get('/togar');

        // Extract the base64-encoded images from the rendered view
        expect(viewResponseJPEG.text.includes('data:image')).toBeTruthy();

        // Clean up by logging out the user
        await agent.get('/logout');
    });
    test('InvalidFile_.txt_Fail', async () => {

        // Execute register using the POST request
        const registrationResponse = await agent
            .post('/register')
            .send({
                username: 'testUser'
            });

        // Expect successful registration
        expect(registrationResponse.status).toBe(302);

        // Execute login using the POST request
        const loginResponse = await agent
            .post('/login')
            .send({ username: 'testUser' });

        // Expect successful login
        expect(loginResponse.status).toBe(302);
        expect(loginResponse.header.location).toBe('togar');

        // Execute actual image upload using the POST request
        const uploadResponse = await agent
            .post('/togar/upload')
            .attach('imageFile', '/testingImages/mockedFile.txt');

        // Expecting a redirect to /togar
        expect(uploadResponse.status).toBe(302);
        expect(uploadResponse.header.location).toBe('/togar');
        const viewResponse = await agent.get('/togar');

        expect(viewResponse.text.includes('data:image')).toBeFalsy();

        // Clean up by logging out the user
        await agent.get('/logout');
    });
    test('InvalidFile_.pages_Fail', async () => {

        // Execute register using the POST request
        const registrationResponse = await agent
            .post('/register')
            .send({
                username: 'testUser'
            });

        // Expect successful registration
        expect(registrationResponse.status).toBe(302);

        // Execute login using the POST request
        const loginResponse = await agent
            .post('/login')
            .send({ username: 'testUser' });

        // Expect successful login
        expect(loginResponse.status).toBe(302);
        expect(loginResponse.header.location).toBe('togar');

        // Execute actual image upload using the POST request
        const uploadResponse = await agent
            .post('/togar/upload')
            .attach('imageFile', '/testingImages/mockedFile.pages');

        // Expecting a redirect to /togar
        expect(uploadResponse.status).toBe(302);
        expect(uploadResponse.header.location).toBe('/togar');
        const viewResponse = await agent.get('/togar');

        expect(viewResponse.text.includes('data:image')).toBeFalsy();

        // Clean up by logging out the user
        await agent.get('/logout');
    });
    test('InvalidFile_.exe_Fail', async () => {

        // Execute register using the POST request
        const registrationResponse = await agent
            .post('/register')
            .send({
                username: 'testUser'
            });

        // Expect successful registration
        expect(registrationResponse.status).toBe(302);

        // Execute login using the POST request
        const loginResponse = await agent
            .post('/login')
            .send({ username: 'testUser' });

        // Expect successful login
        expect(loginResponse.status).toBe(302);
        expect(loginResponse.header.location).toBe('togar');

        // Execute actual image upload using the POST request
        const uploadResponse = await agent
            .post('/togar/upload')
            .attach('imageFile', '/testingImages/mockedFile.exe');

        // Expecting a redirect to /togar
        expect(uploadResponse.status).toBe(302);
        expect(uploadResponse.header.location).toBe('/togar');
        const viewResponse = await agent.get('/togar');

        expect(viewResponse.text.includes('data:image')).toBeFalsy();

        await agent.get('/logout');
    });
});


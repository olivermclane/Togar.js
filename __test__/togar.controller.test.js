const request = require('supertest');
const fs = require('fs');
const app = require('../app');  // Adjust the path based on your application structure
const database = require('../models');
function findUserByUsername = require("../controllers/login.controller.js");

// HELPERS
// Clears database entries used after each test.
const clearDatabase = async () => {
    await database.users.destroy({ where: {} });
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

    test('Should ', async () => {
        // Mock the registration endpoint to create a user
        const registrationResponse = await agent
            .post('/register')
            .send({
                username: 'testUser'
            });

        // Assuming successful registration
        expect(registrationResponse.status).toBe(302);

        // Perform the actual login using the POST request
        const loginResponse = await agent
            .post('/login')
            .send({ username: 'testUser' });

        // Assuming successful login
        expect(loginResponse.status).toBe(302);
        expect(loginResponse.header.location).toBe('togar');

        // Perform the actual image upload using the POST request
        const uploadResponse = await agent
            .post('/togar/upload')
            .attach('imageFile', '/Users/olivermclane/Desktop/mockedFile.jpg');

        // Expecting a redirect to /togar
        expect(uploadResponse.status).toBe(302);
        expect(uploadResponse.header.location).toBe('/togar');  // Check if the path is correct

        // Check if the file exists in the specified directory
        expect(readFile('/Users/olivermclane/Desktop/mockedFile.jpg') === readFile(process.env.IMAGE_DIRECTORY  + findUserByUsername('testUser')+"/mockedFile.jpg"));


        // Clean up by logging out the user
        await agent.get('/logout');
    });
});


const express = require('express');
const supertest = require('supertest');
const app = require('../app'); // Replace with the path to your app file
const { protectRoute, allowRoute } = require('../auth/protectRoutes');
const {
    loginUserView,
    loginUser,
    registerUserView,
    registerUser,
} = require('../controllers/login.controller');

jest.mock('../auth/protectRoutes', () => ({
    protectRoute: jest.fn(),
    allowRoute: jest.fn(),
}));
jest.mock('../controllers/login.controller');

describe('Router Tests', () => {
    test('GET / should call protectRoute and allowRoute middleware', async () => {
        protectRoute.mockImplementation((req, res, next) => {
            req.user = { username: 'testuser' }; // Mock user for testing protectRoute
            next();
        });
        allowRoute.mockImplementation((req, res, next) => next());

        const response = await supertest(app).get('/');

        expect(response.status).toBe(200); // Adjust this based on your application logic
        expect(protectRoute).toHaveBeenCalled();
        expect(allowRoute).toHaveBeenCalled();
    });

    //LOGIN ROUTING
    test('GET /login should call allowRoute and loginUserView', async () => {
        allowRoute.mockImplementation((req, res, next) => next());
        loginUserView.mockImplementation((req, res) => res.send('Login View'));

        const response = await supertest(app).get('/login');

        expect(response.status).toBe(200); // Adjust this based on your application logic
        expect(allowRoute).toHaveBeenCalled();
        expect(loginUserView).toHaveBeenCalled();
    });

    test('POST /login should call loginUser', async () => {
        const mockUser = { username: 'testuser' };

        const response = await supertest(app).post('/login').send(mockUser);

        expect(response.status).toBe(302); // Assuming successful login redirects to /togar
        expect(response.header.location).toBe('/togar');
        // Verify that loginUser function is called with the correct arguments
        expect(loginUser).toHaveBeenCalledWith(
            expect.objectContaining({
                body: expect.objectContaining(mockUser), // assuming your user is in req.body
            })
        );
    });


    // REGISTER ROUTING
    test('GET /register should call registerUserView', async () => {
        registerUserView.mockImplementation((req, res) => res.send('Register View'));

        const response = await supertest(app).get('/register');

        expect(response.status).toBe(200); // Adjust this based on your application logic
        expect(registerUserView).toHaveBeenCalled();
    });

    test('POST /register should call registerUser', async () => {
        const mockUser = { username: 'testuser' };

        const response = await supertest(app).post('/register').send(mockUser);

        expect(response.status).toBe(201); // Assuming successful registration redirects to /login
        expect(response.header.location).toBe('/login');
        // Verify that registerUser function is called with the correct arguments
        expect(registerUser).toHaveBeenCalledWith(
            expect.objectContaining({
                body: expect.objectContaining(mockUser), // assuming your user is in req.body
            })
        );
    });
});

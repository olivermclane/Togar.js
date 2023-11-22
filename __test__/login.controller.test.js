const app = require('../app');
const request = require("supertest");
const {response} = require("express");
const User  = require('../models/user.model');
const database = require('../models/');
const {findUserByUsername}  = require('../controllers/login.controller')
const logger = require("../config/logger");

// REGISTER USER TESTS
describe("RegisterUser_ValidUsername_Success", () => {
    test("Testing Register: Username = testuser", async () => {
        // Clear the User table before the test
        const user = "testuser1"
        const response = await request(app)
            .post("/register")
            .send({
                username: user
            });

        // Assert the HTTP response status
        expect(response.status).toBe(500);
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was created
        logger.info("The found user" + foundUser);
        expect(foundUser).toBeDefined();
    });
});

describe("RegisterUser_UsernameLengthOver16_Fail", () => {
    test("Testing Register: Username = testingsixteenchar",  async () => {
        const user = "testingsixteenchar";
        const nullUser = {};
        const response = await request(app)
            .post("/register")
            .send({
                username: user
            });

        expect(response.status).toBe(400);

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        expect(foundUser).toBeNull();
    })
});


describe("RegisterUser_UsernameLength3_Fail", () => {
    test("Testing Register: Username = te", async () => {
        const user = "te";
        const response = await request(app)
            .post("/register")
            .send({
                username: user
            });

        // Assert the HTTP response status
        expect(response.status).toBe(400);

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was not created
        expect(foundUser).toBeNull();
    });
});

describe("RegisterUser_UsernameInvalidCharacters_Fail", () => {
    test("Testing Register: Username = test.", async () => {
        const user = "test.";
        const response = await request(app)
            .post("/register")
            .send({
                username: user
            });

        // Assert the HTTP response status
        expect(response.status).toBe(400);

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was not created
        expect(foundUser).toBeNull();
    });

    test("Testing Register: Username = test(", async () => {
        const user = "test(";
        const response = await request(app)
            .post("/register")
            .send({
                username: user
            });

        // Assert the HTTP response status
        expect(response.status).toBe(400);

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was not created
        expect(foundUser).toBeNull();
    });

    test("Testing Register: Username = test~", async () => {
        const user = "test~";
        const response = await request(app)
            .post("/register")
            .send({
                username: user
            });

        // Assert the HTTP response status
        expect(response.status).toBe(400);

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was not created
        expect(foundUser).toBeNull();
    });

    test("Testing Register: Username = test>", async () => {
        const user = "test>";
        const response = await request(app)
            .post("/register")
            .send({
                username: user
            });

        // Assert the HTTP response status
        expect(response.status).toBe(400);

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was not created
        expect(foundUser).toBeNull();
    });

    test("Testing Register: Username = test|", async () => {
        const user = "test|";
        const response = await request(app)
            .post("/register")
            .send({
                username: user
            });

        // Assert the HTTP response status
        expect(response.status).toBe(400);

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was not created
        expect(foundUser).toBeNull();
    });
});

describe("RegisterUser_AlreadyExist_Fail", () => {
    test("Testing Register: Username = testuser, again", async () => {
        const user = "testuser";

        // Use async/await with supertest
        const response = await request(app)
            .post("/register")
            .send({
                username: user
            })

        // Assert the HTTP response status
        expect(response.status).toBe(302);

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was not created
        expect(foundUser).toBeNull();
    });
});


// LOGIN USER TESTS
describe("LoginUser_ValidUsername_Success", () => {
    test("Login User: validUsername", async () => {
        const user = "validUsername";
        request(app)
            .post("/register")
            .send({
                username: 'validUsername'
            });


        const response = await request(app)
            .post("/login")
            .send({
                username: user
            });

        // Assert the HTTP response status
        expect(response.status).toBe(302);
        expect(response.header['location']).toBe('togar');

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was authenticated
        expect(foundUser).toBeDefined();
    });
});

describe("LoginUser_InvalidUsernameFormat_Fail", () => {
    test("Login User: Username = invalid!username ", async () => {
        const user = "invalid!username";

        const response = await request(app)
            .post("/login")
            .send({
                username: user
            });

        // Assert the HTTP response status
        expect(response.status).toBe(400);
        expect(response.text).toContain('Please provide a valid username.');

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was not authenticated
        expect(foundUser).toBeNull();
    });
});

describe("LoginUser_NonExistingUser_Fail", () => {
    test("Login User: Username = nonExistingUser", async () => {
        const user = "nonExistingUser";

        const response = await request(app)
            .post("/login")
            .send({
                username: user
            });

        // Assert the HTTP response status
        expect(response.status).toBe(400);
        expect(response.text).toContain('User not found.');

        // Use await to get the resolved value of findUserByUsername
        const foundUser = await findUserByUsername(user);

        // Check the database to see if the user was not authenticated
        expect(foundUser).toBeNull();
    });
});


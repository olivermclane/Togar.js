const request = require('supertest');
const app = require('../app');

describe('Rate Limiting Tests', () => {
    test('WithinRateLimit_Returns200', async () => {
        // Simulate making requests within the rate limit
        const numRequests = 50;
        const promises = Array.from({ length: numRequests }, () =>
            request(app).get('/login')
            );

        // Wait for all requests to complete
        const responses = await Promise.all(promises);

        // Expect the last response to be a 200 status indicating success
        const lastResponse = responses[responses.length - 1];
        expect(lastResponse.status).toBe(200);

    });
    test('WithinRateLimit_Returns200', async () => {
        // Simulate making requests within the rate limit
        const numRequests = 50;
        const promises = Array.from({ length: numRequests }, () =>
            request(app).get('/register')
            );

        // Wait for all requests to complete
        const responses = await Promise.all(promises);

        // Expect the last response to be a 200 status indicating success
        const lastResponse = responses[responses.length - 1];
        expect(lastResponse.status).toBe(200);

    });


    test('ExceedingRateLimit_Returns429', async () => {
        // Simulate making more requests than the allowed limit within a short time frame
        const numRequests = 101;
        const promises = Array.from({ length: numRequests }, () =>
            request(app).get('/login')
            );

        // Wait for all requests to complete
        const responses = await Promise.all(promises);

        // Expect the last response to be a 429 status indicating rate limiting
        const lastResponse = responses[responses.length - 1];
        expect(lastResponse.status).toBe(429);


    });
    test('ExceedingRateLimit_Returns429', async () => {
        // Simulate making more requests than the allowed limit within a short time frame
        const numRequests = 110;
        const promises = Array.from({ length: numRequests }, () =>
            request(app).get('/register')
            );

        // Wait for all requests to complete
        const responses = await Promise.all(promises);

        // Expect the last response to be a 429 status indicating rate limiting
        const lastResponse = responses[responses.length - 1];
        expect(lastResponse.status).toBe(429);


    });
    test('ExceedingRateLimit_Returns429', async () => {
        // Simulate making more requests than the allowed limit within a short time frame
        const numRequests = 110;
        const promises = Array.from({ length: numRequests }, () =>
            request(app).get('/togar')
            );

        // Wait for all requests to complete
        const responses = await Promise.all(promises);

        // Expect the last response to be a 429 status indicating rate limiting
        const lastResponse = responses[responses.length - 1];
        expect(lastResponse.status).toBe(429);

    });
});


const { protectRoute, allowRoute } = require('../auth/protectRoutes');

describe('Middleware Tests', () => {
    describe('protectRoute', () => {
        test('Authenticated users to /togar', async () => {
            const req = { isAuthenticated: () => true };
            const res = {};
            const next = jest.fn();

            protectRoute(req, res, next);

            // Assert that the next middleware or route handler was called
            expect(next).toHaveBeenCalled();
        });

        test('Redirect unauthenticated users to /login', async () => {
            const req = { isAuthenticated: () => false };
            const res = { redirect: jest.fn() };
            const next = jest.fn();

            protectRoute(req, res, next);

            // Assert that res.redirect was called with the correct argument
            expect(res.redirect).toHaveBeenCalledWith('/login');
            // Assert that next was not called
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('allowRoute', () => {
        test('Allow access for unauthenticated users to /login', async () => {
            const req = { isAuthenticated: () => false };
            const res = { redirect: jest.fn() };
            const next = jest.fn();

            allowRoute(req, res, next);

            // Assert that the next middleware or route handler was called
            expect(next).toHaveBeenCalled();
            // Assert that res.redirect was not called
            expect(res.redirect).not.toHaveBeenCalled();
        });

        test('Redirect Authenticated users to /togar', async () => {
            const req = { isAuthenticated: () => true };
            const res = { redirect: jest.fn() };
            const next = jest.fn();

            allowRoute(req, res, next);

            // Assert that res.redirect was called with the correct argument
            expect(res.redirect).toHaveBeenCalledWith('/togar');
            // Assert that next was not called
            expect(next).not.toHaveBeenCalled();
        });
    });
});
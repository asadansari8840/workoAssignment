import {Request, Response, NextFunction} from 'express';
import {UserController} from '../../src/controller/user-controller';
import {UserDAOMock} from '../__mock__/user.dao.mock'; // Import the mocked UserDAO
import ErrorHandler from '../../src/utils/error-handler';

describe('UserController', () => {
    let userController: UserController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        const userDao: any = new UserDAOMock(); // Instantiate UserDAOMock directly
        userController = new UserController(userDao);

        req = {
            params: {},
            query: {},
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        next = jest.fn(); // Use jest.fn() to mock next function
    });

    describe('getAllUsers', () => {
        it('should get all users', async () => {
            const mockUsers = [
                {
                    _id: '666950735891af0cbb45c8a4',
                    email: 'test@test.com',
                    password: '$2b$10$2FJPdE8zmyJG0ibR8JSvse9uafeAh3D5zHyXSvvjK3qpa6udkDPI6',
                    phone: '8840861716',
                    provider: 'local',
                    isVerified: false,
                    passwordResetToken: null,
                    passwordResetTokenExpire: null,
                    createdAt: '2024-06-12T07:38:28.042Z',
                    updatedAt: '2024-06-12T07:38:28.042Z',
                    __v: 0,
                },
            ] as any;

            // Mock the DAO method
            jest.spyOn(userController['userDao'], 'getAllUsers').mockResolvedValueOnce({
                users: mockUsers,
                totalUsers: mockUsers.length,
                currentPage: 1,
            });

            // Call the controller method
            userController.getAllUsers(req as Request, res as Response, next);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    users: expect.any(Array),
                    totalUsers: mockUsers.length,
                    currentPage: 1,
                },
                message: 'Users',
                notify: true,
            });
        });
    });

    describe('getUserByUserId', () => {
        it('should get user by userId', async () => {
            const userId = '123'; // Set a mock userId for testing

            // Mock the DAO method
            jest.spyOn(userController['userDao'], 'getUserByUserId').mockResolvedValueOnce({
                user: {
                    id: userId,
                    name: 'Test User',
                } as any,
            });

            // Set the userId in request params
            if (req.params) {
                req.params.userId = userId;
            }

            // Call the controller method
            userController.getUserByUserId(req as Request, res as Response, next);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    user: {
                        id: userId,
                        name: 'Test User',
                    },
                },
                message: 'User details fetched successfully',
            });

            // Check that next function was not called
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle missing userId', async () => {
            // Call the controller method without userId in request params
            userController.getUserByUserId(req as Request, res as Response, next);

            // Assertions
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            const errorHandler = next.mock.calls[0][0] as ErrorHandler;
            expect(errorHandler.statusCode).toBe(404);
            expect(errorHandler.message).toBe('User id missing');
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123',
                age: 21,
                phone: '8840861716',
                city: 'Test City',
                zipCode: 220112,
            };

            // Mock validateUser function
            jest.spyOn(userController['userDao'], 'createUser').mockResolvedValueOnce({
                user: {
                    id: '123',
                    email: userData.email,
                    age: userData.age,
                    phone: userData.phone,
                    city: userData.city,
                    zipCode: userData.zipCode,
                } as any,
            });

            // Mock request body
            req.body.userData = userData;

            // Call the controller method
            userController.createUser(req as Request, res as Response, next);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User created successfully',
                data: {
                    user: {
                        id: '123',
                        email: userData.email,
                        // Assert other fields as needed
                    },
                },
                notify: true,
            });
        });
    });
    describe('updateUser', () => {
        it('should update user details', async () => {
            const userId = '123';
            const updateData = {
                // Update data fields as needed
            };

            // Mock validateUpdateUserData function
            jest.spyOn(userController['userDao'], 'updateUser').mockResolvedValueOnce({
                isUpdated: true,
            });

            // Mock request parameters and body
            if (req.params) {
                req.params.userId = userId;
            }
            req.body.updateData = updateData;

            // Call the controller method
            userController.updateUser(req as Request, res as Response, next);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User updated successfully',
                data: {
                    isUpdated: true,
                },
                notify: true,
            });
        });

        it('should handle missing userId during update', async () => {
            // Call the controller method without userId in request params
            userController.updateUser(req as Request, res as Response, next);

            // Assertions
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            const errorHandler = next.mock.calls[0][0] as ErrorHandler;
            expect(errorHandler.statusCode).toBe(404);
            expect(errorHandler.message).toBe('User id is missing');
        });
    });

    describe('loginUser', () => {
        it('should login a user with valid credentials', async () => {
            const email = 'test@test.com';
            const password = 'password123';

            // Mock loginUser function
            jest.spyOn(userController['userDao'], 'loginUser').mockResolvedValueOnce({
                user: {
                    id: '123',
                    email: 'test@test.com',
                    // Add other fields returned by loginUser
                } as any,
            });

            // Mock request body
            req.body.email = email;
            req.body.password = password;

            // Call the controller method
            userController.loginUser(req as Request, res as Response, next);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Logged in successfully.',
                data: {
                    user: {
                        id: '123',
                        email: 'test@test.com',
                    },
                },
                notify: true,
            });
        });

        it('should handle missing email or password during login', async () => {
            // Call the controller method without email or password in request body
            userController.loginUser(req as Request, res as Response, next);

            // Assertions
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            const errorHandler = next.mock.calls[0][0] as ErrorHandler;
            expect(errorHandler.statusCode).toBe(401);
            expect(errorHandler.message).toBe('Please enter a valid email and password');
        });
    });

    describe('logOutUser', () => {
        it('should logout a user with valid refresh token', async () => {
            const refresh_token = 'valid_refresh_token';

            // Mock request cookies
            if (req.cookies) {
                req.cookies.refresh_token = refresh_token;
            }

            // Call the controller method
            userController.logOutUser(req as Request, res as Response, next);

            // Assertions
            expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Logged out successfully.',
            });
        });

        it('should handle missing refresh token during logout', async () => {
            // Call the controller method without refresh token in request cookies
            userController.logOutUser(req as Request, res as Response, next);

            // Assertions
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            const errorHandler = next.mock.calls[0][0] as ErrorHandler;
            expect(errorHandler.statusCode).toBe(400);
            expect(errorHandler.message).toBe('Something went wrong while logging out');
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by userId', async () => {
            const userId = '123';

            // Mock deleteUser function
            jest.spyOn(userController['userDao'], 'deleteUser').mockResolvedValueOnce({
                isDeleted: true,
            });

            // Set userId in request params
            if (req.params) {
                req.params.userId = userId;
            }

            // Call the controller method
            userController.deleteUser(req as Request, res as Response, next);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User deleted successfully',
                data: {
                    isDeleted: true,
                },
                notify: true,
            });
        });

        it('should handle missing userId during delete', async () => {
            // Call the controller method without userId in request params
            userController.deleteUser(req as Request, res as Response, next);

            // Assertions
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            const errorHandler = next.mock.calls[0][0] as ErrorHandler;
            expect(errorHandler.statusCode).toBe(404);
            expect(errorHandler.message).toBe('User id is missing');
        });
    });
});

import ErrorHandler from '@utils/error-handler';
import Joi from 'joi';

/**
 * Schema for validation of user on signup
 */
const userSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
    }),
    age: Joi.number().integer().required().messages({
        'number.base': 'Age must be a number',
        'number.integer': 'Age must be an integer',
        'any.required': 'Age is required',
    }),
    city: Joi.string().required().messages({
        'any.required': 'City is required',
    }),
    zipCode: Joi.number().integer().required().messages({
        'number.base': 'Zip/Postal code must be a number',
        'number.integer': 'Zip/Postal code must be an integer',
        'any.required': 'Zip/Postal code is required',
    }),
    phone: Joi.string().min(10).max(12).allow(null).messages({
        'string.min': 'Phone number must be at least 10 characters long',
        'string.max': 'Phone number cannot be more than 12 characters long',
    }),
    googleId: Joi.string().allow(null),
    isVerified: Joi.boolean().default(false),
    isActive: Joi.boolean().default(false),
});

/**
 * This is the utility function for validating the user fields on signup
 * @param userData
 * @returns `data` It returns the validated user data
 */
export async function validateUser(userData: any) {
    if (!userData || typeof userData !== 'object') {
        throw new ErrorHandler('Please enter valid user details', 404, true);
    }
    try {
        const data = await userSchema.validateAsync(userData, {abortEarly: false});
        return data;
    } catch (error: any) {
        throw new ErrorHandler(error.message ?? 'Invalid user data format', 400, true);
    }
}

const userUpdateSchema = Joi.object({
    name: Joi.string().trim(),
    age: Joi.number().integer().min(0).max(150), // Adjust the min and max age as per your application's requirements
    city: Joi.string().trim(),
    zipCode: Joi.number().integer().positive(),
    phone: Joi.string()
        .trim()
        .regex(/^\d{10,12}$/)
        .allow(null)
        .optional(), // Regex for 10-12 digits, allow null, and make it optional
}).min(1); // Require at least one field to be provided

/**
 * Utility function for validating user update data.
 * @param userData The data to validate.
 * @returns The validated user update data.
 * @throws `ErrorHandler` if validation fails.
 */
export async function validateUpdateUserData(userData: any) {
    if (!userData || typeof userData !== 'object') {
        throw new ErrorHandler('Please provide valid user update details', 404, true);
    }

    try {
        const data = await userUpdateSchema.validateAsync(userData, {abortEarly: false});
        return data;
    } catch (error: any) {
        throw new ErrorHandler(error?.message ?? 'Invalid user update data format', 400, true);
    }
}

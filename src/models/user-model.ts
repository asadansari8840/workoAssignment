import {Schema, model, Document} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    age: number;
    city: string;
    zipCode: number;
    phone?: string;
    googleId?: string;
    provider: 'google_sso' | 'local';
    role: 'admin' | 'user';
    isVerified: boolean; //for verified email accounts
    isActive: boolean; //soft deletion user
    passwordResetToken: string | null;
    passwordResetTokenExpire: Date | null;
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
    comparePasswordHash: (user_entered_password: string, hashed_password: string) => Promise<boolean>;
    generateResetPasswordToken: () => string;
}

const userSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            validate: [validator.isEmail, 'Invalid email'],
        },
        password: {
            type: String,
            minlength: [6, 'Password must be at least 6 characters long.'],
            select: false,
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        zipCode: {
            type: Number,
            required: [true, 'Zip/Postal code is required'],
        },
        phone: {
            type: String,
            maxlength: [12, 'Please enter a valid mobile no.'],
            minlength: [10, 'Please enter a valid mobile no.'],
            default: null,
        },
        googleId: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            default: 'user',
            enum: ['admin', 'user'],
        },
        provider: {
            type: String,
            enum: ['local', 'google_sso'],
            required: [true, 'Provider is required'],
            default: 'local',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        passwordResetToken: {
            type: String,
            default: null,
        },
        passwordResetTokenExpire: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

// Pre-save hook to hash password if user signs up locally
userSchema.pre<UserDocument>('save', async function (next) {
    if (this.provider === 'local' && this.isModified('password')) {
        try {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        } catch (error: any) {
            next(error);
        }
    } else if (this.provider == 'google_sso') {
        //for sso login verification will be true by default
        this.isVerified = true;
        next();
    }
});

// Method to generate access token
userSchema.methods.generateAccessToken = function (): string {
    const user = this as UserDocument;

    let jwtPayload: {userId: any; email: string; role?: string} = {
        userId: user._id,
        email: user.email,
    };

    if (user.role === 'admin') {
        jwtPayload['role'] = user.role;
    }
    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE!,
    });

    return accessToken;
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function (): string {
    const user = this;

    const jwtPayload = {
        userId: user._id,
        email: user.email,
    };

    const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE!,
    });

    return refreshToken;
};

// Method to compare entered password with hashed password
userSchema.methods.comparePasswordHash = async function (user_entered_password: string, hashed_password: string): Promise<boolean> {
    const isValid = await bcrypt.compare(user_entered_password, hashed_password);
    return isValid;
};

// Method to generate reset password token and hash it
userSchema.methods.generateResetPasswordToken = function (): string {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpire = new Date(Date.now() + 15 * 60 * 1000); // Token expires in 15 minutes
    return resetToken;
};

const UserModel = model<UserDocument>('User', userSchema);

export default UserModel;

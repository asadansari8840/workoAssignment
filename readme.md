# Worko.ai Backend Internship Assignment

## Getting Started

1. **Node.js Project Setup**

    - Clone the repository: `git clone https://github.com/asadansari8840/workoAssignment.git` or download and extract the zip file from url : `https://drive.google.com/file/d/1y9iTgDwcglb_s9O8rE3mldNlNIkWyZ-n/view?usp=drivesdk`
    - Install dependencies: `npm install` Ensure you are in workoAssignment folder if not open cmd  type `cd /workoAssignment`.

2. **Database Configuration**

    - MongoDB setup:
        - Install MongoDB locally or use a cloud service
        - Set MongoDB URI in `.env.` file: `MONGO_URI=<your-mongodb-uri>` . Take reference from `.env.example` file.

3. **Environment Variables**

    - Configure `.env` file with necessary variables:
        ```
        PORT=4000
        MONGO_URI=<your-mongodb-uri>
        COOKIE_EXPIRE=<cookie-expriration-time>
        ACCESS_TOKEN_SECRET=<your-access-token-secret>
        REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
        JWT_REFRESH_TOKEN_EXPIRE=<refresh-token-expire-time>
        JWT_ACCESS_TOKEN_EXPIR<access-token-expire-time>
        CORS_ORIGINS=<cors-origins-array-optional>
        ```

4. **Run Project**
    - Development mode: `npm run dev`
    - Build for production: `npm run build`
    - Start production server: `npm start`

## Specifications

-   **Node.js**: Backend API development
-   **Architecture**: MVC (Model-View-Controller) with DAO ( Data Access Object) code pattern with dependency injection.
-   **Modules**: Express, Joi, dotenv
-   **Database**: MongoDB (NoSQL)
-   **Authentication**: Basic Authentication for APIs

## Milestones

### API Endpoints

-   **GET /worko/user/list**: List all users _(Requires Authentication and Admin privileges)_
-   **GET /worko/user/:userId**: Get user details by userId _(Requires Authentication)_
-   **POST /worko/user/create**: Create a new user
-   **PUT /worko/user/update/:userId**: Update user details _(Requires Authentication)_
-   **DELETE /worko/user/delete/:userId**: Soft delete user _(Requires Authentication)_
-   **POST /worko/user/login**: Login user
-   **GET /worko/user/logout**: Logout user

### Authentication

-   Basic Authentication for all APIs
-   Secure endpoints with JWT tokens
-   Handle authentication errors with appropriate status codes

### Unit Testing

-   Use Jest for unit testing
-   Run tests: `npm test`

### Project Structure

-   /workoaiassignment
-   ├── /src
-   │ ├── /app // Application entry point
-   │ ├── /config // Configuration files (e.g., database, environment)
-   │ ├── /controllers // Controller layer (handles HTTP requests)
-   │ ├── /dao // Data Access Object layer (interacts with database)
-   │ ├── /middlewares // Middleware functions (e.g., authentication,errorhandling)
-   │ ├── /models // Data models (e.g., Mongoose schemas)
-   │ ├── /router // Express routers
-   │ ├── /schemas // Joi validation schemas
-   │ ├── /services // Business logic layer (service classes)
-   │ └── /utils // Utility functions
-   ├── .env // Environment variables
-   ├── .gitignore
-   ├── package.json
-   ├── README.md // Project documentation
-   └── tsconfig.json

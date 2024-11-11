# Wholesale Platform

This is a full-stack application for a wholesale platform that connects suppliers and buyers. It includes both a backend API built with Node.js and Express, and a frontend application built with React.

## Table of Contents.

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [API Endpoints](#api-endpoints)
6. [Frontend Pages](#frontend-pages)
7. [Testing](#testing)
8. [Deployment](#deployment)

## Prerequisites..

- Node.js (v14 or later)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/wholesale-platform.git
   cd wholesale-platform
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd wholesale-frontend
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/wholesale_platform
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```
   Replace `your_jwt_secret_key` and `your_stripe_secret_key` with actual secure keys.

2. Update the `API_URL` in `wholesale-frontend/src/api/index.js` if your backend is not running on `http://localhost:3000`.

## Running the Application

1. Start the backend server:
   ```
   npm run dev
   ```
   This will start the server using nodemon, which will automatically restart when changes are detected.

2. In a new terminal, start the frontend development server:
   ```
   cd wholesale-frontend
   npm start
   ```
   This will start the React development server, typically on `http://localhost:3001`.

3. Open your browser and navigate to `http://localhost:3001` to view the application.

## API Endpoints

- POST `/auth/register`: Register a new user
- POST `/auth/login`: Login a user
- GET `/inventory/products`: Get all products
- POST `/inventory/update`: Update product inventory
- GET `/suppliers`: Get all suppliers
- GET `/profile`: Get user profile
- PUT `/profile`: Update user profile
- POST `/profile/kyc`: Submit KYC information

For detailed API documentation, refer to the API.md file.

## Frontend Pages

- Home: Displays featured products and suppliers
- Products: Lists all products with search and filter functionality
- Suppliers: Lists all suppliers with search functionality
- Login: User login page
- Register: New user registration page
- Profile: User profile management page

## Testing

To run the test suite:

1. Backend tests:
   ```
   npm test
   ```

2. Frontend tests:
   ```
   cd wholesale-frontend
   npm test
   ```

## Deployment

1. Build the frontend:
   ```
   cd wholesale-frontend
   npm run build
   ```

2. Set up your production environment variables.

3. Deploy the backend to your chosen hosting platform (e.g., Heroku, DigitalOcean).

4. Deploy the frontend build to a static hosting service (e.g., Netlify, Vercel).

For detailed deployment instructions, refer to the DEPLOYMENT.md file.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

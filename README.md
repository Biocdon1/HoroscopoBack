# Zodiac Backend

This project is a backend application built with Node.js and Express that provides an API for managing zodiac signs. It includes basic authentication and route protection.

## Features

- Authentication with basic credentials
- Protected routes for accessing zodiac sign data
- CRUD operations for zodiac signs

## Project Structure

```
zodiac-backend
├── src
│   ├── app.js                # Entry point of the application
│   ├── controllers           # Contains controllers for handling requests
│   │   └── zodiacController.js
│   ├── middleware            # Middleware for authentication and route protection
│   │   ├── auth.js
│   │   └── protectRoute.js
│   ├── routes                # API routes
│   │   ├── authRoutes.js
│   │   └── zodiacRoutes.js
│   └── utils                 # Utility functions and in-memory data
│       └── zodiacUtils.js
├── package.json              # NPM configuration file
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd zodiac-backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```
2. The API will be available at `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST /login**
  - Request body: `{ "username": "admin", "password": "password" }`
  - Response: `{ "token": "your-auth-token" }`

### Zodiac Signs

- **GET /api/signos**
  - Response: List of all zodiac signs.

- **GET /api/signos/:signo**
  - Response: Details of the specified zodiac sign.

- **POST /api/signos/:signo**
  - Request body: `{ "text": "Your zodiac text here" }`
  - Response: Confirmation of the update.

## Middleware

- **auth.js**: Validates user credentials and issues a token.
- **protectRoute.js**: Protects routes by checking for a valid token in the Authorization header.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.
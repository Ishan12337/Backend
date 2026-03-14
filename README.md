# Backend Authentication API

A secure backend authentication system built with **Node.js, Express, MongoDB, and JWT**.
This project implements user registration, login, and protected routes using JSON Web Tokens.

---

## Features

- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Authentication
- Protected Routes
- Get Logged-in User Profile
- Email Notification Service
- Transaction Success Email
- Transaction Failed Email

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (jsonwebtoken)
* bcrypt
* dotenv

---

## Project Structure

backend-project/
│
├── controllers
│   └── auth.controller.js
│
├── models
│   └── user.model.js
│
├── routes
│   └── auth.routes.js
│
├── middleware
│   └── auth.middleware.js
│
├── config
│   └── db.js
│
├── app.js
├── server.js
├── package.json
└── README.md

---

## Installation

Clone the repository

git clone https://github.com/yourusername/backend-auth-project.git

Move into the folder

cd backend-auth-project

Install dependencies

npm install

---

## Environment Variables

Create a .env file in the root directory

PORT=3000
MONGO_URI=mongodb_connection_string
JWT_SECRET=secret_key

---

## Run the Project

Start the server

npm start

Server will run on:

http://localhost:3000

---

## API Endpoints

Register User

POST /api/auth/register

Login User

POST /api/auth/login

Get Logged In User

GET /api/auth/me

---

## Example API Request

Register User

POST /api/auth/register

{
"name":"Ishan",
"email":"[ishan123@gmail.com]",
"password":"12345678"
}

---

## Future Improvements

* Refresh Tokens
* Email Verification
* Password Reset
* Role Based Authentication
* Add frontend

---

## Author

Ishan Tiwari

Final Year B.Tech Student
Technocrats Institute of Technology, Bhopal

Interested in Full Stack Development (MERN Stack)

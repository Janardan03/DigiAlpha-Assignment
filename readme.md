# Project README

## Environment Setup

1. Create a .env file in the root directory
2. Use the provided .env.example file as a reference for required environment variables

## Default Admin Account

An admin user with full access privileges is created by default:

Email: admin@example.com
Password: admin123

Use these credentials to access the admin and manage users and access all apis.

## API Documentation

#### 1. Registration & Authentication

- POST /auth/register: Register a new user (First Name, Last Name, Email, Phone)  
- POST /auth/login: Authenticate user and receive JWT token  

#### 2. User CRUD Operations (can only be access by the user having admin access)

- GET /users/: List all users with filters, Supported filters: firstName, lastName, email, phone, role  
- GET /users/:id: Get user by ID  
- PUT /users/:id: Update user (First Name, Last Name, Email, Phone)  
- DELETE /users/:id: Delete/Disable user  
- PUT /users/:id/roles: Assign roles to the user  

#### 3. Roles & Permissions

- POST /roles/createRole: Creates a new role  
- GET /roles/getRoles: Get all roles  

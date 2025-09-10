# Laravel User Management CRUD

This is a simple User Management system built using **Laravel** for the backend API and a basic frontend interface generated with the help of **AI (Claude)**. This project is part of my Laravel learning journey and was suggested by my mentor as a practical exercise to understand the fundamentals of Laravel, RESTful APIs, and full-stack application development.

## 🚀 Features

- Create new users
- View all users
- Update user details
- Delete users
- Simple and clean UI for managing users

## 🛠️ Tech Stack

- **Backend:** Laravel (REST API)
- **Frontend:** HTML, CSS, JavaScript (AI-generated)
- **Database:** SQLite (or your preferred database)
- **API Format:** JSON

## 📚 Learning Goals

- Understand Laravel routing, controllers, models, and migrations
- Practice building RESTful APIs
- Learn basic frontend-backend integration
- Gain experience with CRUD operations in a real project

## 📦 Installation

### Prerequisites

- PHP >= 8.1
- Composer
- SQLite or another supported database

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Iliya-Gholami/laravel-user-crud.git
   cd laravel-user-crud
   ```

2. Install dependencies:

   ```bash
   composer install
   ```

3. Copy the `.env` file and set your database credentials:

   ```bash
   cp .env.example .env
   ```

4. Generate the application key:

   ```bash
   php artisan key:generate
   ```

5. Run the database migrations:

   ```bash
   php artisan migrate
   ```

6. Serve the application:

   ```bash
   php artisan serve
   ```

7. Open your browser and navigate to:

   ```
   http://localhost:8000
   ```

## 🧪 API Endpoints

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| GET    | /api/users      | Get all users     |
| GET    | /api/users/{id} | Get a single user |
| POST   | /api/users      | Create new user   |
| PUT    | /api/users/{id} | Update user       |
| DELETE | /api/users/{id} | Delete user       |

All responses are in JSON format.

## 🤝 Acknowledgements

* **My mentor, AmirHossein** for suggesting this project and guiding me through Laravel
* **Claude AI** for assisting with the frontend
* **Laravel Documentation** for being awesome

## 📬 Contact

If you have any suggestions or questions, feel free to open an issue or contact me.

---

**Thank you for checking out my project!**
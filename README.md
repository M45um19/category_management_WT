# Category Management API

A **hierarchical category management API** built with **Node.js, Express, TypeScript, MongoDB, Redis, and Zod**.
Supports **unlimited nested categories**, recursive updates, and optimized reads using caching.

---

## Features

* Unlimited **parent → child categories**
* Get category with **full parent hierarchy**
* **Recursive activate/deactivate** categories
* **Recursive delete** of category tree
* **Redis caching** for faster reads
* **Zod validation**
* Clean moduler pattern => **Controller → Service → Repository** architecture

---

## Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB (Mongoose)
* Redis
* Zod

---

## Category Example

```
Electronics
 └── Phones
      └── Android
           └── Samsung
```

---

## API Endpoints

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| POST   | `/api/categories`              | Create category                 |
| GET    | `/api/categories`              | Get all categories              |
| GET    | `/api/categories/:id`          | Get category by ID              |
| GET    | `/api/categories/search?name=` | Search category by name         |
| PATCH  | `/api/categories/:id/status`   | Update category status          |
| DELETE | `/api/categories/:id`          | Delete category and descendants |

---

## Run Project

- Clone the project
- Install Docker to your machine
- Go to the project folder and run

```bash
docker compose up --build
```

---


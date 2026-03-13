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

Base URL: `http://localhost:5000/api/v1/`

| Method | Endpoint | Description | Sample Request | Sample Response |
|--------|---------|------------|----------------|----------------|
| POST   | `/api/v1/categories` | Create category | `{ "name": "Electronics", "parentId": null }` | `{ "success": true, "message": "Category created successfully", "data": { "_id": "65f1...", "name": "Electronics", "parentId": null, "level": 1 } }` |
| GET    | `/api/v1/categories` | Get all categories | No request body | `{ "success": true, "message": "All category fetch seccessfully", "data": [ { "_id": "65f1...", "name": "Electronics", "level": 1 }, { "_id": "65f2...", "name": "Phones", "parentId": "65f1...", "level": 2 } ] }` |
| GET    | `/api/v1/categories/search?name=` | Search category by name | No request body | `{ "success": true, "message": "Category fetch sucessfully", "data": { "_id": "65f2...", "name": "Phones", "level": 2 } }` |
| GET    | `/api/v1/categories/:id` | Get category with parent chain | No request body | `{ "success": true, "message": "Category fetch sucessfully", "data": { "_id": "65f2...", "name": "Phones", "level": 2, "parent": { "_id": "65f1...", "name": "Electronics", "level": 1 } } }` |
| GET    | `/api/v1/categories/:id/childrens` | Get direct children of a category | No request body | `{ "success": true, "message": "All children fetch successfully", "data": [ { "_id": "65f2...", "name": "Phones", "parentId": "65f1...", "level": 2 } ] }` |
| PATCH  | `/api/v1/categories/:id/status` | Update category status and cascade to descendants | `{ "isActive": false }` | `{ "success": true, "message": "Category and all the descendants status updated" }` |
| PUT    | `/api/v1/categories/:id` | Update category name or parent | `{ "name": "Smartphones", "parentId": "65f1..." }` | `{ "success": true, "message": "Category updated successfully", "data": { "_id": "65f2...", "name": "Smartphones", "parentId": "65f1...", "level": 2 } }` |
| DELETE | `/api/v1/categories/:id` | Delete category and all descendants | No request body | `{ "success": true, "message": "Category and all the descendants deleted" }` |
---

## GraphQL API

Base URL: `http://localhost:5000/graphql`

| Operation | Description | Query | Variables | Sample Response |
|-----------|------------|-------|-----------|----------------|
| Query | Get all categories with parent and children | query GetAllCategories { categories { _id name level isActive parent { _id name } children { _id name } } } | None | { "data": { "categories": [ { "_id": "65f1...", "name": "Electronics", "level": 1, "isActive": true, "parent": null, "children": [ { "_id": "65f2...", "name": "Phones" } ] } ] } } |
| Query | Get category by ID or name, including parent and children | query GetCategory($id: ID, $name: String) { category(id: $id, name: $name) { _id name level isActive parent { _id name } children { _id name } } } | { "id": "65f2..." } or { "name": "Phones" } | { "data": { "category": { "_id": "65f2...", "name": "Phones", "level": 2, "isActive": true, "parent": { "_id": "65f1...", "name": "Electronics" }, "children": [] } } } |
| Query | Get direct children of a category by parentId | query GetChildren($parentId: ID!) { children(parentId: $parentId) { _id name level isActive parent { _id name } } } | { "parentId": "65f1..." } | { "data": { "children": [ { "_id": "65f2...", "name": "Phones", "level": 2, "isActive": true, "parent": { "_id": "65f1...", "name": "Electronics" } } ] } } |

``` 
## Run Project

- Clone the project

- Make a `.env` file and put

```env
PORT=5000 (or any free port of your pc)
MONGO_URI=mongodb://mongo:27017/categorydb
REDIS_HOST=redis
REDIS_PORT=6379
```

- Install Docker to your machine

- Go to the project folder and run

```bash
docker compose up --build
```
# Organic Food Service (OFS) - Full Stack Web Application

## 📜 Project Overview

The mission is to develop a full-stack web platform for **OFS**, a local organic food retailer.  
The application supports three user roles:

- **Customers**: Browse, select, and purchase organic food items online.
- **Employees**: Manage and update the inventory.
- **Managers**: Oversee inventory and operational dashboards.

All inventory, customer, and transaction data is stored in a **MySQL** relational database.

Additionally, after purchase, orders are delivered using a **self-driving delivery vehicle**:

- **Free delivery** for orders under **20 lbs**.
- **$10 charge** for orders **20 lbs and above**.
- Delivery vehicle capacity: **10 orders** or **200 lbs maximum**.
- The system automatically **optimizes delivery scheduling** based on the order queue.

---

## ⚙️ Tech Stack

**Frontend**:

- React
- React Router DOM
- Axios

**Backend**:

- Express.js
- MySQL2
- CORS
- Dotenv
- Nodemon (for development)

**Database**:

- MySQL 8.x (inside Docker container)

**Infrastructure**:

- Docker & Docker Compose
- Stripe for secure payments

---

## 📦 Required Installations

Before running locally, ensure you have:

- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Node.js (v18+)](https://nodejs.org/en/download/) and npm
- [Stripe CLI](https://docs.stripe.com/stripe-cli) (for webhook testing)

---

## 🚀 Getting Started

### 1. Clone the Repository

Navigate to the root folder containing the **Frontend**, **Backend**, **App-mapping**, and **SQL** directories.

```bash
git clone https://github.com/bmonty98/CS-160-Final-Project.git
cd CS-160-Final-Project
```

---

### 2. Install Docker and Docker Compose

Install Docker and Docker Compose:  
👉 [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

---

### 3. Install and Set Up Stripe CLI

- Install Stripe CLI: [Stripe CLI Installation Guide](https://docs.stripe.com/stripe-cli)

- Login to Stripe CLI in the command prompt:

```bash
stripe login
```

- Start listening for Stripe webhook events and forward them to your backend:

```bash
stripe listen --forward-to localhost:3301/api/stripe/webhook
```

- Open the `.env` file inside the `backend` folder and replace `STRIPE_WEBHOOK_SECRET` with the secret provided by Stripe CLI.

---

### 4. Build and Start the Docker Containers

Run either of the following commands:

```bash
docker-compose up -build
```

or

```bash
docker compose up --build
```

_(Prefer `docker compose` without the dash, as `docker-compose` is being deprecated.)_

---

### 5. Application Access

Once the containers are running, access the services at:

- **Frontend (React app)**: [http://localhost:3300](http://localhost:3300)
- **Backend (API server)**: [http://localhost:3301](http://localhost:3301)
- **MySQL Database**: Accessible via `localhost:3307` using MySQL clients (e.g., MySQL Workbench).

---

## 📑 Table of Contents

- [📜 Project Overview](#-project-overview)
- [⚙️ Tech Stack](#️-tech-stack)
- [📦 Required Installations](#-required-installations)
- [🚀 Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Stripe CLI Setup](#3-stripe-cli-setup)
  - [4. Build and Run Docker Containers](#4-build-and-run-docker-containers)
  - [5. Access the Application](#5-access-the-application)
- [👥 Team Members](#-team-members)
- [📝 Notes](#-notes)

---

## 👥 Team Members

- **Austin Nguyen**
- **Aaron Wang**
- **Blake Montgomery**
- **Matthew Delurio**
- **Tiffany Huynh**
- **Tyler Biesemeyer**

---

## 📝 Notes

- All required Node dependencies are automatically installed inside Docker containers.
- Local development requires manual `npm install` inside frontend and backend folders.
- Make sure Docker Desktop is running before using `docker compose`.
- Stripe CLI must be running during checkout sessions for successful webhook handling.

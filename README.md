## Project Requirements
The mission is to develop a full stack website for “OFS”, a local retail chain. The website should have three separate users: customer, employee, and manager. The website should allow the customer users to select and purchase organic food online (this includes fruits, vegetables, and other organic products). The items that are selected are placed in a virtual shopping cart while they await purchase. Furthermore, the store employee and manager users need a dashboard page to update or query the inventory database.  The database will use a relational database management system (RDBMS), which is where the data related to inventory, customer information, and transactions is stored.

 Additionally, the application requires a delivery service mechanism. After the customer user pays for the virtual shopping cart, the purchased products are delivered to their home. The conditions of delivery state that if the total weight of a customer's order is less than 20 pounds, then the delivery is free. Otherwise, there is a $10 dollar charge on the order. In order to calculate order weight, each organic food item in the database should have an associated weight, which is totaled at the time of purchase. The delivery mechanism is a self-driving vehicle that has a capacity of 10 orders with a maximum weight of 200 lbs on a given trip. If there are multiple orders in the queue, the delivery service must be optimized. 

## Required Dependencies
All required dependencies are automatically installed when building the docker containers. <br />
For local development you'll need: <br />

**Docker** and **Docker Compose** (for running containers)

**Node.js v18+** and **npm** (for frontend and backend code)

**MySQL 8.x** (database inside container)

**Backend Dependencies**: <br /><br />
express

cors

mysql2

dotenv

nodemon (for dev)

**Frontend Depedencies**: <br /><br />
react

react-dom

axios

react-router-dom

Run **npm i** when inside the frontend and backend directories in order to install all required dependencies needed to run the application
## Instructions To Run The Project
**1. Clone the repository and navigate to the root folder containing the Frontend, Backend, App-mapping, and SQL directories**
```
git clone https://github.com/bmonty98/CS-160-Final-Project.git

cd CS-160-Final-Project
```
**2. Install Docker and Dockercompose through** https://docs.docker.com/get-docker/

**3. Build and start the containers**
```
docker-compose up -build
```
**4. Application access** <br />
```
Frontend (React app): http://localhost:3300

Backend (API server): http://localhost:3301

MySQL database: accessible via localhost:3307 (MySQL clients)
```
**5. Install and setup Stripe CLI**

- Install Stripe CLI: https://docs.stripe.com/stripe-cli
  
- Run: stripe listen --forward-to localhost:3301/api/stripe/webhook

## Authors
**Austin Nguyen** <br />
**Aaron Wang** <br />
**Blake Montgomery** <br />
**Matthew Delurio** <br />
**Tiffany Huynh** <br />
**Tyler Biesemeyer** <br />

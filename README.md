# Airport Travel Advisor #

## Table of Contents ##

- [Overview](#overview)
- [Setup](#setup)
- [Summary](#summary-of-the-relationship-between-objects)
- [Authentication](./documentation/AUTH-README.md#authentication)
    - [Register](./documentation/AUTH-README.md#register)
    - [Login](./documentation/AUTH-README.md#login)
- [Endpoints API Documentation](./documentation/ENDPOINTS-README.md#endpoints-api-documentation)
  - [Airports Overview (api/airports)](./documentation/ENDPOINTS-README.md#airports-overview-apiairports)
    - [GET api/airports](./documentation/ENDPOINTS-README.md#get-apiairports)
    - [POST api/airports](./documentation/ENDPOINTS-README.md#post-apiairports)
  - [Routes Overview (api/routes)](./documentation/ENDPOINTS-README.md#routes-overview-apiroutes)
    - [GET api/routes](./documentation/ENDPOINTS-README.md#put-apiroutes)
    - [POST api/routes](./documentation/ENDPOINTS-README.md#delete-apiroutes)

## Overview

The Airport Travel Advisor is a smart travel planning system designed to help users find the most efficient flight routes between any two airports. Whether direct flights are available or not, the system evaluates multiple flight options, including layovers, estimated travel times, and total costs, to present the most convenient and cost-effective journey.

The core objective is to simulate a real-world flight booking assistant that can:
- Identify all possible routes between two airports
- Account for flight schedules, durations, and transfers
- Calculate and compare travel costs
- Recommend alternative routes when direct flights are unavailable

This project can be especially useful for applications like virtual travel agents or booking systems.

## Setup

1. Clone this repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root with the following keys:

   ```env
   PORT=3000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=supersecret
   JWT_SECRET=myjwtsecret
   JWT_EXPIRES_IN=3600
   ```

4. Run the server:

   ```bash
   npm start
   ```

5. Access the API at:

   ```
   http://localhost:PORT
   ```

## Authentication

The application uses a JWT mechanism implemented from scratch. Only authorized **admins** can add or modify resources (airports, routes).

### How it works:

1. Obtain a token via:

   ```
   POST /api/auth/token
   ```

   with body:

   ```json
   { "username": "admin", "password": "supersecret" }
   ```

2. Use the returned JWT in the `Authorization` header:

   ```
   Authorization: Bearer <token>
   ```

3. Without a valid token, POST requests will be denied.

## Endpoints API Documentation

### Airports Overview (api/airports)

#### GET api/airports
List airports.

#### POST api/airports
Add new airport (admin only).

### Routes Overview (api/routes)

#### GET api/routes?source=X&dest=Y
List possible routes from airport X to airport Y, or all routes if no parameters are provided.

#### POST api/routes
Add new route (admin only).

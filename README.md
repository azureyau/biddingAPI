# Bridge Bidding API Server

This API server provides functionalities to manage and interact with bridge bidding data. It supports creating, updating, retrieving, and authenticating bridge bidding responses and players.

---

## Installation

1. Clone the repository.
2. Install the dependencies:
   ```bash
   npm install

3. Set up environment variables
4. Run the server:
     ```bash
   npm start

## Endpoints

### 1. GET `/api/listings/:playerName`
Retrieves bidding data for a specific player.

- **Query Parameters:**
  - `objID` (optional): ID of the bidding response to retrieve.

- **Responses:**
  1. server states
  - `200 OK`: Returns bidding data.
  - `404 Not Found`: No data found.
  - `500 Internal Server Error`: Server error.
  2. without objID:
    JSON of a list of bidding of "start bid"
  3. with objID:
    JSON of a list of bidding of "response bid" for the objectID

---

### 2. POST `/api/listings/:playerName`
Adds a new bidding response for a specific player.

- **Authentication Required:** JWT.

- **Request Body:** JSON object containing bidding response details.

- **Responses:**
  - `201 Created`: New response added successfully.
  - `500 Internal Server Error`: Server error.

---

### 3. PUT `/api/listings/:playerName`
Updates a specific bidding response for a player.

- **Authentication Required:** JWT.

- **Query Parameters:**
  - `objID` (required): ID of the bidding response to update.

- **Request Body:** JSON object containing updated data.

- **Responses:**
  - `200 OK`: Response updated successfully.
  - `400 Bad Request`: Missing `objID`.
  - `404 Not Found`: Player or response not found.
  - `500 Internal Server Error`: Server error.

---

### 4. POST `/api/login`
Authenticates a user and generates a JWT token.

- **Request Body:** JSON object containing user credentials.

- **Responses:**
  - `200 OK`: Login successful; returns token.
  - `422 Unprocessable Entity`: Authentication failed.

---

### 5. GET `/`
Serves the `test.json` file.

- **Responses:**
  - Returns the contents of `test.json`.

---

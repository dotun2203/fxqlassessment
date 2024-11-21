# FXQL Parser API

## Description

FXQL Parser API is a service designed to process, store, and retrieve FXQL statements. The service supports both local and production environments, with robust error handling, database configuration, and a Docker setup for seamless deployment.

## Features

- **Parse FXQL Statements:** Process FXQL inputs and store the latest values for each currency pair.
- **RESTful Endpoints:** Access and manage FXQL entries.
- **Swagger API Documentation:** Available for both local and production environments.(https://fxqlassessment.onrender.com/api#)-production, (http://localhost:3000/api#/)-development 
- **Rate Limiting:** Protect the API from overuse.
- **Database Support:** Utilizes PostgreSQL with flexible configurations for development and potgres on render for production.
- **Docker Support:** Fully containerized for easy deployment and scalability.
- create  a .env file in the root directory

```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=fxql_database
NODE_ENV=development
```

---

## Setup Instructions

### Installation

```bash
$ git clone https://github.com/dotun2203/fxql-parser.git
$ cd fxql-parser
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```


```


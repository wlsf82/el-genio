# PostgreSQL Database for Test Genie

This project is a dockerized PostgreSQL database that provides the backend storage for Test Genie, a test automation management system. The database contains tables for managing test suites, test cases, and test steps.

## Project Structure

```sh
db
├── Dockerfile # Docker definition of the PostgreSQL DB
├── init.sql   # SQL scripts to create tables and set up database schema
└── README.md  # Project documentation

```

## Database Schema

The database contains the following tables:

1. **test_suites**: Stores test suite information

   - id, name, description, timestamps (created_at, updated_at, deleted_at)

2. **test_cases**: Stores individual test cases

   - id, test_suite_id, description, timestamps

3. **test_steps**: Stores test execution steps
   - id, test_case_id, command, selector, value, length_value, contained_text, chain_option, is_chained, step_order, timestamps

## Setup Instructions

1. **Build the Docker image:**

```sh
docker build -t test-genie-db .

```

2. **Run the container:**

```sh
docker run -d --name test-genie-postgres -p 5432:5432 test-genie-db

```

## Usage

Once the container is running, you can connect to the database using:

```sh
psql -h localhost -U dbuser -d demo

```

The database is configured with the following credentials:

- Username: dbuser
- Database: demo
- Port: 5432
- Authentication: trust (no password required)

## Features

- Automatic timestamp management for created_at and updated_at fields
- Soft delete support via deleted_at fields
- Optimized indexes for better query performance
- Automatic trigger-based updated_at timestamp updates

## License

This project is licensed under the MIT License.

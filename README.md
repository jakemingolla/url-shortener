# `url-shortener`

## Features

- **API Documentation**: Integrated Swagger UI for easy exploration and testing of API endpoints.
- **Redirect Management**: Create, update, and delete URL redirects with ease.
- **Automated Testing**: Comprehensive test suites ensure the reliability and stability of the application.
- **Continuous Integration**: GitHub Actions workflow for linting, testing, and maintaining code quality.

## Getting Started

### Prerequisites

- **[Bun](https://bun.sh)**: Ensure you have Bun installed. You can install it using the following command:

  ```bash
  curl https://bun.sh/install | bash
  ```

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jakemingolla/url-shortener.git
   cd url-shortener
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory and include the necessary environment variables as needed.

### Running the Application

Start the server using `docker compose`:

```bash
bun run start
```

The server will be listening on [http://localhost:3000](http://localhost:3000).

To get logs of the application (or database):

```
bun run logs:app
bun run logs:postgres
```

### Example

- **Create Redirect**

  ```bash
  curl \
    -X POST \
    -H "Content-Type: application/json" \
    --data '{ "destination": "http://stackoverflow.com " }' \
    http://localhost:3000/api/v1/redirects

  >> {"id":"b2c3a275-5b2e-44cb-9f0c-aed5a1ca6f4a"}
  ```

- **Use Redirect**

  ```bash
  curl -v localhost:3000/r/b2c3a275-5b2e-44cb-9f0c-aed5a1ca6f4a
  ...
  < HTTP/1.1 302 Found
  < Location: http://stackoverflow.com
  ```

- **View Redirect Details**

  ```bash
    curl \
      -X GET \
      -H "Content-Type: application/json" \
      http://localhost:3000/api/v1/redirects/b2c3a275-5b2e-44cb-9f0c-aed5a1ca6f4a

    {
      "id": "b2c3a275-5b2e-44cb-9f0c-aed5a1ca6f4a",
      "destination": "http://stackoverflow.com ",
      "hits": 1,
      "createdAt": "2024-12-30T16:39:41.515Z",
      "updatedAt": "2024-12-30T16:40:58.357Z",
      "deletedAt": null
    }
  ```

### API Documentation

Access the Swagger UI for interactive API documentation at [http://localhost:3000/swagger](http://localhost:3000/swagger).

## Seeds

The [database seeds](./db/seeds/) add baseline redirects into Postgres for local
development and testing.

- **Run Seeds**
  ```bash
  bun run seed:up
  ```
- **Create Seeds**
  ```bash
  bun run seed:make <name>
  ```
- **Reseting Database**
  ```bash
  bun run reset
  ```

## Testing

> [!NOTE]  
> You must make sure you have all up-to-date [seeds](#seeds) created
> before running tests.

Run the test suites using Bun:

```bash
bun test
```

## Database Migrations

Manage your database schema with the provided migration scripts.

- **Run Migrations**

  ```bash
  bun run migration:up
  ```

- **Rollback Migrations**

  ```bash
  bun run migration:down
  ```

- **Create New Migration**

  ```bash
  bun run migration:make <name>
  ```

- **Update `src/db/types.d.ts`**

  This will adjust the TypeScript types to match what's in the current local database

  ```bash
  bun run generate-types
  ```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear and descriptive messages.
4. Push to your fork and create a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

This project was created using `bun init` in bun v1.1.42. [Bun](https://bun.sh)
is a fast all-in-one JavaScript runtime.

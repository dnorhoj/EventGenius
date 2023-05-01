# EventGenius

EventGenius is an event management system that allows users to create events, or join events created by other users. This could be anything such as concerts, parties, or even a simple get together.

- [EventGenius](#eventgenius)
  - [Stack](#stack)
  - [Development and testing](#development-and-testing)
    - [Prerequisites](#prerequisites)
    - [Running the application](#running-the-application)

## Stack

This project is built with the MVC pattern using the following technologies:

Backend:

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/#/)

Frontend:

- [ejs](https://ejs.co/)
- [Bootstrap](https://getbootstrap.com/)

Database:

- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/en/)

## Development and testing

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Running the application

First, you need some environment variables that the program needs in order to function. Create a file called `.env` with the following content:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

MAIL_HOST=
MAIL_USER=
MAIL_PASS=
MAIL_PORT=
MAIL_FROM=

SITE_URL=http://localhost:3000
```

You should fill out the SMTP information so that the program knows how to send emails.

To run the application, simply run the following command:

```bash
docker-compose up
```

This will build, and start the application as well as the database.

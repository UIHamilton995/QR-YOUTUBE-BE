# QR Code Movies Backend

NestJS backend for QR code movies application.

## Description

Backend API that provides QR code generation and movie data for the React frontend.

## Installation

```bash
$ npm install

# Download movie data
$ npm run setup:data
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Endpoints

- `GET /api/qr-code` - Generate a QR code that links to random movies
- `GET /api/movies` - Get a list of random movies
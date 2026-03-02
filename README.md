# API Key Admin

GraphQL API for user registration and login. Auth is delegated to AWS Lambda.

## Project structure

```
src/
├── index.ts                 # Express app, routes, server
├── application/
│   ├── services/            # Ports (e.g. AuthProvider)
│   └── usecases/            # RegisterUser, LoginUser
├── domain/                  # Entities (e.g. User)
├── infrastructure/
│   ├── config/              # DI container
│   └── services/            # LambdaAuthProvider (AWS Lambda impl)
└── interfaces/
    └── http/graphql/        # Schema, handler
```

## Prerequisites

- Node.js 18+
- pnpm (or npm / yarn)

## Installation

```bash
pnpm install
cp .env.example .env
```

Edit `.env` with your AWS region, credentials, and Lambda function names:

| Variable                                 | Description                   |
| ---------------------------------------- | ----------------------------- |
| `AWS_REGION`                             | AWS region (e.g. `us-east-1`) |
| `AWS_ACCESS_KEY_ID`                      | AWS access key                |
| `AWS_SECRET_ACCESS_KEY`                  | AWS secret key                |
| `AWS_LAMBDA_REGISTER_USER_FUNCTION_NAME` | Lambda for registration       |
| `AWS_LAMBDA_LOGIN_USER_FUNCTION_NAME`    | Lambda for login              |
| `PORT`                                   | Server port (default: `4000`) |

## How to run

```bash
pnpm dev
```

- Server: `http://localhost:4000`
- GraphQL: `http://localhost:4000/graphql`
- Health: `GET http://localhost:4000/health`

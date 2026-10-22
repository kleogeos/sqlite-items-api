# sqlite-items-api

Simple Express + Sequelize + SQLite REST API with full CRUD on a single
`items` table (`id`, `name`, `description` + timestamps).

## Run

```
npm install
npm start
```

Server listens on `:3000` (override with `PORT`). Data is stored in
`./data.sqlite` (created automatically on first run).

## Endpoints

| Method | Path         | Body                          | Response |
|--------|--------------|--------------------------------|----------|
| POST   | `/items`     | `{ "name", "description" }`    | `201` created item |
| GET    | `/items`     | —                               | `200` array of items |
| GET    | `/items/:id` | —                               | `200` item or `404` |
| PUT    | `/items/:id` | `{ "name"?, "description"? }`  | `200` updated item or `404` |
| DELETE | `/items/:id` | —                               | `204` or `404` |

## Test

```
npm test
```

9 tests, cover every endpoint including the 404/400 error paths, run against
an in-memory SQLite database (no setup needed).

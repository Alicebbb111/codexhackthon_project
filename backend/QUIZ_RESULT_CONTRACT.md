# Quiz Result API Contract

These read-only endpoints return results already stored in `user_quiz_results`, joined with quiz metadata.

## Get all results for a user

`GET http://localhost:3000/api/quiz-results/user/:userId`

### Request params

- `userId`: positive integer user ID.

### Success (`200`)

```json
{
  "results": [
    {
      "result_id": 12,
      "user_id": 7,
      "quiz_id": 3,
      "quiz_title": "SQL Joins",
      "score": 8,
      "total_score": 10,
      "percentage": 80,
      "completed_at": "2026-08-29T10:00:00.000Z"
    }
  ]
}
```

If no results exist, the endpoint still returns `200` with `{ "results": [] }`.

## Get one result for a user and quiz

`GET http://localhost:3000/api/quiz-results/user/:userId/quiz/:quizId`

### Request params

- `userId`: positive integer user ID.
- `quizId`: positive integer quiz ID.

### Success (`200`)

Returns one result object with the fields shown above (without the outer `results` array).

### Error behavior

- `400`: `userId` or `quizId` is missing, non-numeric, zero, or negative.
- `404`: the single-result endpoint finds no result for that user and quiz.
- `500`: database or server error. Credentials and internal connection details are not returned.

The list endpoint does not return `404`; no matching rows are represented by an empty `results` array.

## Field meanings

- `result_id`: primary key of the stored quiz result.
- `user_id`: user who completed the quiz.
- `quiz_id`: completed quiz identifier.
- `quiz_title`: title from the `quizzes` table.
- `score`: stored points earned.
- `total_score`: stored maximum points.
- `percentage`: calculated in JavaScript as `(score / total_score) * 100`, or `0` when `total_score` is not positive; rounded to two decimals. It is not stored in the database.
- `completed_at`: timestamp when the result was recorded.

No `correct_count` or `incorrect_count` is included because the stored `answers_detail` structure has not been established.

## Frontend integration example

```js
async function loadQuizResults(userId) {
  const response = await fetch(`http://localhost:3000/api/quiz-results/user/${userId}`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  const { results } = await response.json();
  return results;
}

async function loadQuizResult(userId, quizId) {
  const response = await fetch(
    `http://localhost:3000/api/quiz-results/user/${userId}/quiz/${quizId}`,
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  return response.json();
}
```

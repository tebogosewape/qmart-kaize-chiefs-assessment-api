# Kaizer Chiefs Fan Engagement and Match Analysis API

## Project Overview

This project is an API for fan engagement and match analysis for Kaizer Chiefs football club. It allows fans to interact by commenting on matches and player performances and provides match analysis statistics such as possession, shots on goal, and player ratings.

## Features

- **Fan Comments**: Allows fans to post comments about matches and player performances.
- **Comment Replies**: Allows fans to reply to other comments.
- **Match Schedule**: Provides the match schedule.
- **Player Profiles**: Provides details about the players.
- **Match Results**: Provides match results and statistics.

## Database Schema

The database consists of two tables: `fan-comments` and `fan-comment-reply`.

```sql
CREATE DATABASE `chiefs-assessment-db` /*!40100 COLLATE 'latin1_swedish_ci' */;

CREATE TABLE `fan-comments` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
    `comment` TEXT NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
    `created_at` DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

CREATE TABLE `fan-comment-reply` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `comment_id` INT(11) NULL DEFAULT NULL,
    `fan_name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
    `fan_reply` TEXT NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
    `created_at` DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
```

## Setup Instructions
### Prerequisites
1. Docker
2. Docker Compose

### Steps

Clone the Repository:
git clone <repository-url>
cd <repository-directory>

**Update db.js with your local db settings**
```js
{
    host: '10.0.0.56',
    user: 'test-user',
    password: 'test-password',
    database: 'chiefs-assessment-db'
}
```

3. **Build and Start the Docker Containers**:

    ```bash
    docker-compose up --build

    Output:
    [+] Running 1/1
    ✔ Container kaizer-chiefs-assessment-api-app-1  Recreated                                                                                             0.1s 
    Attaching to kaizer-chiefs-assessment-api-app-1
    kaizer-chiefs-assessment-api-app-1  | Server is running on port 7000
    kaizer-chiefs-assessment-api-app-1  | Connected to the database as ID 272093
    ```

4. **Access the Application**:

    The application will be accessible at `http://localhost:7000`.

## API Endpoints
### Get Match Schedule
URL: /api/schedule
Method: GET
Success Response:
Code: 200
Content:
```js
[
    {
        "date": "2024-06-28",
        "opponent": "Team A",
        "location": "Home"
    },
    ...
]
```

### Get Player Profiles
URL: /api/players
Method: GET
Success Response:
Code: 200
Content:
```js
[
    {
        "id": 1,
        "name": "Player 1",
        "position": "Forward",
        "stats": {
            "goals": 10,
            "assists": 5
        }
    },
    ...
]
```
### Get Match Results
URL: /api/results
Method: GET
Success Response:
Code: 200
Content:
```js
[
    {
        "match_id": 1,
        "date": "2024-06-28",
        "opponent": "Team A",
        "score": "2-1",
        "statistics": {
            "possession": "60%",
            "shots_on_goal": 8
        }
    },
    ...
]
```
### Add a Comment
URL: /api/comments
Method: POST
Body:
```js
{
    "name": "Fan Name",
    "comment": "Great match!"
}
```
Success Response:
Code: 201
Content:
```js
{
    "id": 1,
    "name": "Fan Name",
    "comment": "Great match!",
    "created_at": "2024-06-28T12:00:00Z"
}
```
### Reply to a Comment
URL: /api/comments/:comment_id/replies
Method: POST
Body:
```js
{
    "fan_name": "Another Fan",
    "fan_reply": "I agree!",
    "created_at": "2024-06-28T12:30:00Z"
}
```
Success Response:
Code: 201
Content:
```js
{
    "id": 1,
    "comment_id": 1,
    "fan_name": "Another Fan",
    "fan_reply": "I agree!",
    "created_at": "2024-06-28T12:30:00Z"
}
```

### Get All Comments and Replies
URL: /api/comments
Method: GET
Success Response:
Code: 200
Content:
```js
[
    {
        "id": 1,
        "name": "Fan Name",
        "comment": "Great match!",
        "created_at": "2024-06-28T12:00:00Z",
        "replies": [
            {
                "id": 1,
                "comment_id": 1,
                "fan_name": "Another Fan",
                "fan_reply": "I agree!",
                "created_at": "2024-06-28T12:30:00Z"
            }
        ]
    },
    ...
]
```
### Get Comments and Replies by Comment ID
URL: /api/comments/:comment_id
Method: GET
Success Response:
Code: 200
Content:
```js
{
    "id": 1,
    "name": "Fan Name",
    "comment": "Great match!",
    "created_at": "2024-06-28T12:00:00Z",
    "replies": [
        {
            "id": 1,
            "comment_id": 1,
            "fan_name": "Another Fan",
            "fan_reply": "I agree!",
            "created_at": "2024-06-28T12:30:00Z"
        }
    ]
}
```
# MERN Blog

A full-stack **blogging platform** built with the MERN stack (MongoDB, Express, React, Node). Register, log in, write posts in a rich-text editor with a cover image, and read what others have published.

## Features
- **Accounts:** register and log in. Passwords are hashed with bcrypt, and logins use a JWT stored in a cookie
- **Write posts:** title, summary, rich-text body (React Quill) and a cover image upload
- **Home feed:** the 20 most recent posts, newest first, with author names
- **Post page:** read a full post
- **Protected actions:** only logged-in users see "Create new Post"

## Tech stack
| Layer | Tools |
|---|---|
| Frontend | React 19, React Router 7, React Quill, date-fns |
| Backend | Node.js, Express 5, Multer (file uploads) |
| Database | MongoDB Atlas with Mongoose |
| Auth | bcryptjs, JSON Web Tokens, cookie-parser |

## Project structure
```
blog/
├── api/                  # Express server (port 4000)
│   ├── index.js          # routes: register, login, profile, logout, posts
│   ├── models/           # User and Post schemas
│   └── .env.example      # environment variables you need to set
└── client/               # React app (port 3000)
    └── src/
        ├── pages/        # Index, Login, Register, CreatePost, PostPage, EditPost
        └── Header.jsx, Layout.jsx, Post.jsx, UserContext.js
```

## API
| Method | Route | What it does |
|---|---|---|
| POST | `/register` | Create an account |
| POST | `/login` | Log in and set the token cookie |
| GET | `/profile` | Return the logged-in user |
| POST | `/logout` | Clear the token cookie |
| POST | `/post` | Create a post with a cover image (login required) |
| GET | `/post` | List the latest posts |
| GET | `/post/:id` | Get one post |

## Run it locally
You need Node.js and a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

```bash
git clone https://github.com/aahint/MERN.git
cd MERN/blog/api
npm install
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm run dev               # API on http://localhost:4000

# in a second terminal
cd MERN/blog/client
npm install
npm start                 # app on http://localhost:3000
```

## Configuration
Create `blog/api/.env` from `.env.example`:

| Variable | Meaning |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random string used to sign login tokens |

The `.env` file is ignored by git. Never commit real credentials.

## Roadmap
- Finish post editing (the edit page exists in the client, the server route is not written yet)
- Move the hardcoded `http://localhost:4000` API address in the client into a config value
- Store cover images in cloud storage instead of the server's disk
- Input validation and clearer error messages

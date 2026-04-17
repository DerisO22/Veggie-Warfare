# Computer Networking Final Project

### Tech Stack
- React Three Fiber
- TypeScript
- Express and Node
- Socket.io
- PostgreSQL

## Project Set Up (Locally)
1. Clone repository
2. Open Project in VS Code
3. Open multiple terminals in VS Code. One for frontend, server, and git related stuff.

3. Also create an account on Clerk (its free). Create a project and then use the given CLERK_PUBLISHABLE_KEY to create a `.env` for the frontend directory based on the `.env.example`.

## Method 1
### On Root Directory
Install and open Docker Desktop. run `docker compose up` to run the project.

### Method 2
### PostgreSQL Database
- You can set up your own local database with PGAdmin by downloading PostgrSQL. 
Or you can create a Railway account and deploy a PostgreSQL instance (with Free Trial). Then just
use the DATABASE_PUBLIC_URL environment variable that Railway gives you.

### Frontend/Client
1. cd to frontend and run `npm install`
2. Then run `npm run dev`
3. Open localhost in browser

### Backend/Server
1. cd to backend and run `npm install`
2. Then run `node server.js`

## Project Set Up (Production)
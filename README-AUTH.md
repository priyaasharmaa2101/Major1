# CampusSync — original dashboard with MVC authentication

## Setup
### Backend
```powershell
cd server
npm install
Copy-Item .env.example .env
```
Edit `server/.env`: set your MongoDB Atlas URI (include a database name such as `/campussync`) and a generated JWT secret:
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Keep `.env` private; it is gitignored. Start backend:
```powershell
npm run dev
```
Expected: `MongoDB connected` and `CampusSync API listening on 5000`.

### Frontend (second terminal)
```powershell
cd client
npm install
npm run dev
```
Open the Vite URL, usually `http://localhost:5173`.

## Authentication behavior
- Signup creates student accounts only.
- Login has Student Login and Admin Login options.
- Student accounts redirect to the existing dashboard; the dashboard profile uses the name on the logged-in account.
- Admin accounts redirect to a separate presentation admin dashboard.
- Public signup cannot create admin accounts.

## Create a presentation admin
Create a student account, then for a local demo only change that user's `role` field to `admin` in the MongoDB Atlas `users` collection. Log out and use Admin Login with that account. Never expose public admin signup in a real deployment.

## Security
This ZIP deliberately excludes real database credentials and JWT secrets. Do not commit `.env`. Atlas Network Access must allow your current IP.

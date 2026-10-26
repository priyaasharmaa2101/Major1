# CampusSync: Student + Admin

## Run
```
npm install
npm run dev
```
- Student dashboard: http://localhost:5173/
- Admin panel:       http://localhost:5173/admin   (demo login: admin@campus.edu / admin123)

Open both in two browser tabs: whatever admin does shows up on the student side instantly.

## Folder layout (src)
```
src/
  main.jsx            decides student vs admin by URL
  student/            student app only (StudentApp.jsx + components/)
  admin/              admin app only (AdminApp.jsx, AdminLogin.jsx, ui.jsx, components/)
  shared/
    store.js          data + automation engine (the only thing both apps share)
    hooks.js          automation loop (runs every 5 s)
```

## What is automated (Admin > Automation, each rule has an ON/OFF switch)
1. Auto-screening: CGPA / branch / hostel check on every application
2. Interview slot allocation: next free slot, no double booking
3. Auto-selection: interview score >= threshold -> Selected (vacancy -1), else Rejected
4. Payment verification + QR pass issue
5. Grievance SLA escalation to Chief Warden after N hours
6. Auto-close hiring on deadline or when vacancies = 0
7. Super 50 ranking: composite score, rank, Confirmed / Waitlisted always recalculated
Every automatic action is logged in the activity feed and sent as a notification to the student.

## Before going live (important)
- Data is stored in browser localStorage (demo mode). For real use, move `shared/store.js`
  actions to a Node/Express + MongoDB/PostgreSQL API and run the rules in a server cron job.
- Admin login is demo-only (password is inside the JS bundle). Use real auth (JWT/session) + role check.
- Student is fixed to roll no 23CS1089 (`CURRENT_STUDENT_ROLL` in store.js). Add student login to remove this.
- On production hosting add a rewrite so `/admin` serves index.html (Netlify `_redirects`, Vercel rewrites).

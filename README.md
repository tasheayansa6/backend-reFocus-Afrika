# EYAI Registration + Login API

Express + MySQL backend using **Vercel-style register attributes** + **email/password login**.

## Setup

```bash
cd backend
npm install
npm run db:init
npm run dev
```

## Register — `POST /api/register`

Body (same style as https://refocus-africa-courses-mu.vercel.app/#/register + password):

```json
{
  "fullName": "Abebe Kebede",
  "age": 20,
  "gender": "Male",
  "region": "Addis Ababa",
  "phone": "+251911000000",
  "email": "abebe@example.com",
  "education": "University student",
  "occupation": "Student",
  "category": "Youth learner",
  "course": "30-Day AI Literacy & Social Media Content Creation",
  "level": "Beginner",
  "interests": "AI, content creation",
  "careerGoal": "Build a creative portfolio",
  "mode": "Online",
  "consent": true,
  "password": "secret123"
}
```

## Login — `POST /api/login`

```json
{
  "email": "abebe@example.com",
  "password": "secret123"
}
```

## Profile — `GET /api/register/me`

Header: `Authorization: Bearer <token>`

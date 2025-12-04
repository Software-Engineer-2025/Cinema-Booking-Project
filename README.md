# <ins>Cinema-Booking-Project</ins>

![Logo](.frontend/public/logo-cinema.png)

Software Engineer Project to Create a Cinema-Booking App

<ins>**NOTICE**</ins>

At the moment, this app is in development. Thank you for understanding.

## Table of Contents

- <ins>Use Guide</ins>
  - [Getting Started](#getting-started)
  - [How To Start Up](#start-up)
  - [How To Use The App](#use-app)
  - [How to Close Down the App](#close-app)
  - [Things To Be Aware Of](#aware-of)
  - [Ideas for Further Work](#further-work)
  - [Other Dependencies](#other-dependencies)
  - [Contributors & Acknowledgements](#contrib-acknow)
  - [Contribution Guidelines](#contrib-guidelines)
  - [License](#license)

# <ins>Use Guide</ins>

## <a name="getting-started">Getting Started</a>

1. Pull the dev branch

2. Install backend dependencies from the backend directory:
```
pip install -r requirements.txt
```

3. Install frontend dependencies:
```
npm install
```

4. Install Supabase CLI from the root directory:
```
npm install supabase --save-dev
```

5. Make sure Docker Desktop is open and start Supabase:
```
npx supabase start
```

6. Create `.env` files in the following directories:

   **Backend (`backend/src/.env`):**
   - Copy `backend/src/.env.example`
   - Add your Supabase URL and API key
   
   **Frontend (`frontend/.env`):**
   - Copy `frontend/.env.example`
   - Add your Supabase configuration
   
   **Supabase Functions (`supabase/functions/.env`):**
   - Copy `supabase/functions/.env.example`
   - Add environment variables for edge functions (e.g., email service credentials)

## <a name="start-up">How To Start Up</a>

After the initial setup, use the following command from the root directory to start everything:

```
./run.sh
```

This will start:
- Supabase database
- FastAPI backend
- Next.js frontend

Alternatively, you can run them in separate terminals:

**Terminal 1 - Supabase:**
```
npx supabase start
```

**Terminal 2 - Backend:**
```
./run.sh backend
```

**Terminal 3 - Frontend:**
```
./run.sh frontend
```

Once running, open the link provided by the frontend (typically http://localhost:3000).

To view API documentation, add `/docs` to the backend URL (typically http://localhost:8000/docs).

## <a name="use-app">How To Use The App</a>

It's a booking app similar to Fandango. Browse movies, select showtimes, choose seats, and book your tickets!

## <a name="close-app">How to Close Down the App</a>

**To stop Supabase:**
```
npx supabase stop
```

**To stop backend and frontend:**
Use `Ctrl + C` in each terminal.

## <a name="aware-of">Things To Be Aware Of</a>

- Always stop the Supabase Docker container when not in use to save system resources
- Make sure Docker Desktop is running before starting Supabase
- The backend and frontend must be running for the app to work properly

## <a name="further-work">Ideas for Further Work</a>

- Mobile app optimization
- Payment processing integration
- Advanced seat selection UI
- User review system

## <a name="other-dependencies">Other Dependencies</a>

- **Supabase Local Development**: https://supabase.com/docs/guides/local-development
- **HeyAPI TypeScript Client Generator**: https://heyapi.dev/
- **FastAPI**: https://fastapi.tiangolo.com/
- **Next.js**: https://nextjs.org/

## <a name="contrib-acknow">Contributors & Acknowledgements</a>

This app was created by the Software Engineer 2025 team.
- Kade Styron | KadeStyron
- Ben Wright | BenWrightSWE
- Heyran Lee | hran-8
- Ty Torbett | Tytorb
- Sean Choi  | seanhchoi10

## <a name="contrib-guidelines">Contribution Guidelines</a>

Follow the AGPL-3.0 license guidelines. Please create a pull request and message the team regarding any changes you make.

## <a name="license">License</a>

This project uses the AGPL-3.0 license. Please respect this.

For more information, see the LICENSE file.

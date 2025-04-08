TECH STACK
FRONTEND: React + Vite + TailwindCSS 

BACKEND: Django + Django REST Framework

DATABASE: SQLite (default), can be swapped with PostgreSQL/MySQL

API: RESTful API using DRF
DEPLOYMENT: NOT YET.


PROJECT STRUCTURE.

Tiberbu-webapp-version-one/
│
├── backend/                             # Django backend
│   ├── backend/                         # Django project root (settings, urls, wsgi, etc.)
│   ├── chat/                            # Chat app
│   ├── insurance/                       # Insurance app
│   ├── insurance_files/                # Supporting files or media for insurance
│   ├── userauth/                        # Custom authentication app
│   ├── build_files.sh                   # Deployment or build automation script
│   ├── db.sqlite3                       # SQLite database (dev only)
│   ├── manage.py                        # Django management script
│   ├── requirements.txt                 # Python dependencies
│   └── vercel.json                      # Vercel config (for deployment)
│
├── client/                              # React frontend
│   ├── public/                          # Static files (favicon, etc.)
│   ├── src/                             # Source code for React app
│   │   ├── Illness/                     # Illness-related components/pages
│   │   ├── Patient/                     # Patient-related components/pages
│   │   ├── Physician/                   # Physician-related components/pages
│   │   ├── assets/                      # Images, logos, etc.
│   │   ├── components/                  # Reusable UI components
│   │   ├── context/                     # React Context providers
│   │   ├── pages/                       # Page components (routes)
│   │   ├── utils/                       # Utility functions/helpers
│   │   ├── App.css                      # App-level CSS
│   │   ├── App.jsx                      # Root App component
│   │   └── main.jsx                     # Entry point
│   │
│   ├── .gitignore                       # Git ignore rules
│   ├── README.md                        # Frontend-specific README (optional)
│   ├── eslint.config.js                # Linting config
│   ├── index.html                       # HTML template for Vite
│   ├── package-lock.json                # Locked npm dependencies
│   ├── package.json                     # Project dependencies & scripts
│   └── vite.config.js                   # Vite config
│
└── .gitignore                           # Global Git ignore (optional)





⚙️ SETUP INSTRUCTIONS
1. Clone the Repo

>>git clone (https://github.com/19DennisBrown/Tiberbu-webapp-version-one)
>>cd Tiberbu-webapp-version-one

2. BACKEND SETUP (Django)
cd backend
>>python -m venv venv
>>venv\Scripts\activate
>>pip install -r requirements.txt

# Run migrations and start the server
>>py manage.py migrate
>>py manage.py runserver
>>
>>
3. FRONTEND SETUP (React + Vite)
>>cd client
>>npm install
>>npm run dev
>>
TESTING
Backend: Run Django tests with python manage.py test

Frontend: Use your preferred testing library (Jest, React Testing Library, etc.)

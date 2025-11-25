# ContentCraft Pro - AI-Assisted Document Authoring Platform

A full-stack, AI-powered web application that enables authenticated users to generate, refine, and export structured business documents with intelligent content generation powered by Google Gemini API.

## 🎯 Project Overview

ContentCraft Pro is a professional document creation platform that guides users through the complete document lifecycle:
1. **Authentication** - Secure JWT-based user registration and login
2. **Document Configuration** - Define structure for Word documents or PowerPoint presentations
3. **AI Content Generation** - Leverage Google Gemini API for intelligent, context-aware content creation
4. **Interactive Refinement** - Iteratively improve content with AI assistance, feedback, and comments
5. **Professional Export** - Download polished documents in .docx or .pptx format

## ✨ Key Features

### Core Functionality
- ✅ **User Authentication & Project Management**
  - Secure JWT-based authentication with password hashing (bcrypt)
  - Session management with automatic token validation
  - User dashboard displaying all projects
  - Create, view, and delete projects

- ✅ **Document Configuration (Scaffolding)**
  - Choose document type: Microsoft Word (.docx) or PowerPoint (.pptx)
  - Define main topic/prompt for content generation
  - **For Word Documents**: Create custom outlines (add, remove, reorder sections)
  - **For PowerPoint**: Define number of slides with individual titles
  
- ✅ **AI-Powered Content Generation**
  - Section-by-section or slide-by-slide content generation
  - Context-aware LLM calls using Google Gemini API
  - All content stored in database with full history

- ✅ **Interactive Refinement Interface**
  - Editor-style interface showing full document structure
  - **AI Refinement Prompts**: Request specific improvements per section
  - **Feedback System**: Like/Dislike buttons for user satisfaction tracking
  - **Comment System**: Add personal notes to each section
  - **Revision History**: All refinements and prompts persisted in database

- ✅ **Document Export**
  - Export to professional .docx files (python-docx)
  - Export to formatted .pptx presentations (python-pptx)
  - Well-formatted output with proper styling

### Bonus Feature
- ✅ **AI-Generated Templates** (Bonus Feature Implemented!)
  - Click "Smart Suggest" during configuration
  - AI automatically generates section headers (Word) or slide titles (PowerPoint)
  - Users can accept, edit, or regenerate suggestions

## 🛠 Technology Stack

### Backend (FastAPI)
- **FastAPI**: Modern, high-performance Python web framework
- **SQLite**: Lightweight relational database for data persistence
- **Google Gemini API**: Large Language Model for intelligent content generation
- **JWT (PyJWT)**: Secure token-based authentication
- **bcrypt**: Password hashing and verification
- **python-docx**: Microsoft Word document generation
- **python-pptx**: PowerPoint presentation generation
- **aiosqlite**: Async database operations
- **Pydantic**: Data validation and settings management

### Frontend (React)
- **React 18**: Modern JavaScript UI framework
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React component library
- **Lucide React**: Beautiful icon library
- **Sonner**: Toast notifications

### Deployment
- **Backend**: Render (https://oceanai-assignment-cg5f.onrender.com)
- **Frontend**: Vercel (Production-ready deployment)
- **HTTPS**: Encrypted communication for security

## 📋 Prerequisites
## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.9+** (Python 3.10+ recommended)
- **Node.js 16+** and npm or yarn
- **Git** for cloning the repository
- **Google Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🚀 Installation & Setup

1. **Clone and navigate to project**:
```bash
# Clone the repository
git clone https://github.com/RitikTiwari7379/OceanAI_Assignment.git
cd OceanAI_Assignment
```

2. **Create and activate virtual environment**:
#### Step 2.1: Create Virtual Environment

**Important**: Create the virtual environment at the **project root level** (not inside backend directory).

```bash
# From project root (OceanAI_Assignment)
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On macOS/Linux
.venv\Scripts\activate     # On Windows
```

#### Step 2.2: Install Dependencies
#### Step 2.2: Install Dependencies

```bash
cd backend
pip3 install -r requirements.txt
```

**Dependencies installed:**
- fastapi>=0.100.0 - Web framework
- uvicorn>=0.23.0 - ASGI server
- aiosqlite>=0.19.0 - Async SQLite
- bcrypt>=4.0.0 - Password hashing
- python-dotenv>=1.0.0 - Environment variables
- google-generativeai>=0.7.0 - Gemini API
- python-docx>=0.8.11 - Word generation
- python-pptx>=0.6.21 - PowerPoint generation
- PyJWT>=2.8.0 - JWT tokens
- pydantic>=2.0.0 - Data validation
- python-multipart>=0.0.6 - File uploads
- email-validator>=2.0.0 - Email validation

#### Step 2.3: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# backend/.env
SECRET_KEY=your-strong-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
CORS_ORIGINS=http://localhost:3000
```

**Environment Variable Descriptions:**

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Secret key for JWT token signing (must be strong in production) | Generate with: `python3 -c "import secrets; print(secrets.token_urlsafe(32))"` |
| `GEMINI_API_KEY` | Google Gemini API key for content generation | Get from [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated for multiple) | `http://localhost:3000` for development, `https://yourapp.vercel.app` for production |

**How to get Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" → "Create API Key"
4. Copy the key and paste it in your `.env` file

#### Step 2.4: Start Backend Server
#### Step 2.4: Start Backend Server

```bash
# Make sure you're in backend directory with virtual environment active
python3 server.py
```

**Expected Output:**
```
✓ Gemini API Key loaded: AIzaSyDvAL...
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

Backend will be available at: **http://localhost:8000**

**API Documentation:** Visit http://localhost:8000/docs for interactive Swagger UI

---

### 3. Frontend Setup (React)

#### Step 3.1: Navigate to Frontend Directory
#### Step 3.1: Navigate to Frontend Directory

```bash
# Open a new terminal (keep backend running)
cd OceanAI_Assignment/frontend
```

#### Step 3.2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag resolves dependency conflicts with React 18.

#### Step 3.3: Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# frontend/.env
REACT_APP_BACKEND_URL=http://localhost:8000
WDS_SOCKET_PORT=3000
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

**Environment Variable Descriptions:**

| Variable | Description | Value |
|----------|-------------|-------|
| `REACT_APP_BACKEND_URL` | Backend API URL | `http://localhost:8000` (development)<br>`https://oceanai-assignment-cg5f.onrender.com` (production) |
| `WDS_SOCKET_PORT` | Webpack Dev Server port | `3000` |
| `REACT_APP_ENABLE_VISUAL_EDITS` | Visual editing features | `false` |
| `ENABLE_HEALTH_CHECK` | Health check polling | `false` |

#### Step 3.4: Start Development Server
```bash
npm start
```

#### Step 3.4: Start Development Server

```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Frontend will be available at: **http://localhost:3000**

---

## 🎮 Usage Guide

### Getting Started

1. **Register Account**
   - Navigate to http://localhost:3000
   - Click "Sign Up"
   - Enter email and password (min 8 characters)
   - Click "Sign Up" to create account

2. **Login**
   - Enter registered email and password
   - Session persists through page refreshes
   - Automatically logs out when browser closes

3. **Create New Project**
   - Click "Create New Project" from dashboard
   - Choose document type: **Word Document** or **PowerPoint Presentation**
   - Enter main topic/description

4. **Configure Document Structure**

   **For Word Documents (.docx):**
   - Add section headers (e.g., "Introduction", "Market Analysis", "Conclusion")
   - Reorder sections by dragging
   - Remove unwanted sections
   - **Optional:** Click "Smart Suggest" to let AI generate an outline

   **For PowerPoint (.pptx):**
   - Specify number of slides
   - Enter title for each slide
   - Reorder slides as needed
   - **Optional:** Click "Smart Suggest" to let AI generate slide titles

5. **Generate Content**
   - Click "Generate Content" button
   - AI will create section-by-section content
   - Progress bar shows generation status
   - Wait for all sections to complete

6. **Refine Content (Interactive Editor)**
   
   For each section, you can:
   
   - **View Generated Content**: See AI-generated text
   
   - **AI Refinement**: 
     - Enter refinement prompt (e.g., "Make this more formal", "Add statistics", "Shorten to 100 words")
     - Click "Refine Section"
     - AI generates improved version
     - View revision history
   
   - **Provide Feedback**:
     - Click 👍 (Like) or 👎 (Dislike)
     - Feedback stored in database
   
   - **Add Comments**:
     - Enter personal notes
     - Comments saved automatically
     - View comment history

7. **Export Document**
   - Click "Export as DOCX" or "Export as PPTX"
   - Download professional, formatted document
   - Open in Microsoft Word or PowerPoint

### Example Workflow

**Creating a Business Plan:**
```
1. Topic: "Business Plan for AI-Powered Fitness App"
2. Document Type: Word Document
3. Click "Smart Suggest" → AI generates:
   - Executive Summary
   - Market Analysis
   - Product Description
   - Marketing Strategy
   - Financial Projections
   - Conclusion
4. Generate Content → Wait for AI
5. Refine "Market Analysis":
   - Prompt: "Add statistics about fitness app market size"
   - Click Refine
6. Add feedback and comments
7. Export as DOCX
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validate JWT token

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `DELETE /api/projects/{id}` - Delete project

### Content Generation
- `POST /api/generate` - Generate section content
- `POST /api/refine` - Refine section with AI
- `POST /api/ai-template` - Generate AI-suggested outline

### Sections
- `GET /api/projects/{id}/sections` - Get all sections
- `PUT /api/sections/{id}` - Update section content
- `GET /api/sections/{id}/revisions` - Get revision history

### Feedback & Comments
- `POST /api/feedback` - Add like/dislike feedback
- `GET /api/sections/{id}/feedback` - Get section feedback
- `POST /api/comments` - Add comment
- `GET /api/sections/{id}/comments` - Get section comments

### Export
- `GET /api/export/{id}` - Export document as .docx or .pptx

### Health Check
- `GET /health` - Check API health status

**Interactive API Documentation:** http://localhost:8000/docs

---

## 🗄 Database Schema

SQLite database with the following tables:

### users
```sql
id TEXT PRIMARY KEY
email TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
created_at TEXT NOT NULL
```

### projects
```sql
id TEXT PRIMARY KEY
user_id TEXT NOT NULL (FK → users.id)
name TEXT NOT NULL
type TEXT NOT NULL ('docx' or 'pptx')
topic TEXT NOT NULL
config TEXT NOT NULL (JSON)
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
```

### sections
```sql
id TEXT PRIMARY KEY
project_id TEXT NOT NULL (FK → projects.id)
section_order INTEGER NOT NULL
title TEXT NOT NULL
content TEXT
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
```

### refinements
```sql
id TEXT PRIMARY KEY
section_id TEXT NOT NULL (FK → sections.id)
prompt TEXT NOT NULL
response TEXT NOT NULL
feedback TEXT ('like' or 'dislike')
comment TEXT
created_at TEXT NOT NULL
```

---

## 🔒 Security Features

### Authentication & Authorization
- ✅ **JWT Tokens**: Secure stateless authentication
- ✅ **Password Hashing**: bcrypt with salt for password storage
- ✅ **Token Expiration**: 8-hour token lifetime
- ✅ **Session Management**: sessionStorage for automatic cleanup
- ✅ **Token Validation**: Server-side validation on every request

### API Security
- ✅ **CORS Configuration**: Restricted origins in production
- ✅ **HTTPS**: Encrypted communication (Render/Vercel)
- ✅ **Input Validation**: Pydantic models for request validation
- ✅ **SQL Injection Protection**: Parameterized queries with aiosqlite
- ✅ **Error Handling**: Graceful error responses without exposing internals

### Best Practices
- ✅ Environment variables for secrets
- ✅ `.env` files in `.gitignore`
- ✅ Strong SECRET_KEY in production
- ✅ Rate limiting ready (implement with slowapi if needed)
- ✅ Health check endpoint for monitoring

---

## 🚀 Deployment

### Production Deployment URLs

- **Backend (Render):** https://oceanai-assignment-cg5f.onrender.com
- **Frontend (Vercel):** [Your Vercel URL here]
- **API Docs:** https://oceanai-assignment-cg5f.onrender.com/docs

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`
5. Set environment variables:
   ```
   SECRET_KEY=<strong-random-key>
   GEMINI_API_KEY=<your-gemini-key>
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   PYTHON_VERSION=3.11.0
   ```
6. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Set environment variable:
   ```
   REACT_APP_BACKEND_URL=https://oceanai-assignment-cg5f.onrender.com
   ```
5. Deploy

---

## 📁 Project Structure

```
OceanAI_Assignment/
├── backend/
│   ├── server.py              # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── render.yaml           # Render deployment config
│   ├── .env                  # Environment variables (local)
│   └── app.db                # SQLite database (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── index.js          # React entry point
│   │   ├── components/
│   │   │   ├── Auth.jsx              # Login/Register
│   │   │   ├── Dashboard.jsx         # Project dashboard
│   │   │   ├── CreateProject.jsx     # Project creation & config
│   │   │   ├── ProjectEditor.jsx     # Content editing & refinement
│   │   │   └── ui/                   # Reusable UI components
│   │   ├── hooks/
│   │   │   └── use-toast.js          # Toast notification hook
│   │   └── lib/
│   │       └── utils.js              # Utility functions
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── package.json          # Node dependencies
│   ├── vercel.json          # Vercel deployment config
│   ├── tailwind.config.js   # Tailwind configuration
│   └── .env                 # Frontend environment variables
│
├── .venv/                   # Python virtual environment
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation (this file)
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Token validation works
- [ ] Create Word project
- [ ] Create PowerPoint project
- [ ] AI template suggestion works
- [ ] Content generation works
- [ ] Section refinement works
- [ ] Like/Dislike feedback works
- [ ] Comments work
- [ ] Revision history visible
- [ ] Export .docx works
- [ ] Export .pptx works
- [ ] Session persists on refresh
- [ ] Logout works
- [ ] Projects deleted successfully

### API Testing

Use the interactive Swagger UI at http://localhost:8000/docs to test all endpoints.

---

## 🐛 Troubleshooting

### Backend Issues

**Error: ModuleNotFoundError**
```bash
# Make sure virtual environment is activated
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows

# Reinstall dependencies
cd backend
pip3 install -r requirements.txt
```

**Error: GEMINI_API_KEY not found**
```bash
# Check .env file exists in backend/ directory
ls backend/.env

# Verify contents
cat backend/.env
```

**Error: Database locked**
```bash
# Stop all running instances of server.py
# Delete app.db and restart
rm backend/app.db
python3 backend/server.py
```

### Frontend Issues

**Error: npm install fails**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Clear cache if needed
npm cache clean --force
npm install --legacy-peer-deps
```

**Error: Cannot connect to backend**
```bash
# Check REACT_APP_BACKEND_URL in frontend/.env
cat frontend/.env

# Verify backend is running
curl http://localhost:8000/health
```

**Error: Blank page in browser**
```bash
# Check browser console (F12)
# Common issue: CORS error → Check backend CORS_ORIGINS
```

---

## 📝 Assignment Requirements Checklist

### ✅ Functional Requirements

- [x] **User Authentication & Project Management**
  - [x] Secure JWT-based registration and login
  - [x] Dashboard with all user projects
  - [x] Create new projects
  - [x] Delete projects
  - [x] Store document configuration, content, and refinement history

- [x] **Document Configuration (Scaffolding)**
  - [x] Choose document type (.docx or .pptx)
  - [x] Enter main topic/prompt
  - [x] Word: Create custom outline (add, remove, reorder sections)
  - [x] PowerPoint: Define slides with titles
  
- [x] **AI-Powered Content Generation**
  - [x] Section-by-section generation using Gemini API
  - [x] Context-aware LLM calls
  - [x] Content stored in database

- [x] **Interactive Refinement Interface**
  - [x] Editor-style interface
  - [x] AI refinement prompts per section
  - [x] Like/Dislike feedback buttons
  - [x] Comment system
  - [x] All revisions persisted

- [x] **Document Export**
  - [x] Export .docx with python-docx
  - [x] Export .pptx with python-pptx
  - [x] Well-formatted output

- [x] **Bonus: AI-Generated Templates**
  - [x] "Smart Suggest" feature
  - [x] AI generates section headers (Word) or slide titles (PowerPoint)
  - [x] User can accept, edit, or regenerate

### ✅ Technical Requirements

- [x] **Backend**: FastAPI ✓
- [x] **Frontend**: React ✓
- [x] **Database**: SQLite ✓
- [x] **Authentication**: JWT ✓
- [x] **LLM Integration**: Google Gemini API ✓
- [x] **Document Generation**: python-docx & python-pptx ✓

### ✅ Evaluation Criteria

- [x] **Functionality**: End-to-end flow works (Login → Configure → Generate → Refine → Export)
- [x] **AI Integration**: Gemini API used for generation and refinement
- [x] **User Experience**: Clean, responsive, intuitive UI
- [x] **Output Quality**: Well-formatted .docx and .pptx files
- [x] **Code Quality**: Clean, modular, readable code with best practices
- [x] **Documentation**: Comprehensive README with setup, usage, and deployment instructions

---

## 👨‍💻 Development

### Running in Development Mode

**Terminal 1 - Backend:**
```bash
cd OceanAI_Assignment/backend
source ../.venv/bin/activate  # Activate venv from project root
python3 server.py
```

**Terminal 2 - Frontend:**
```bash
cd OceanAI_Assignment/frontend
npm start
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output in frontend/build/
```

**Backend:**
```bash
# No build step needed
# Configure environment variables on Render
```

---

## 📄 License

This project is created as part of an assignment for educational purposes.

---

## 🤝 Contributing

This is an assignment project. Contributions are not being accepted at this time.

---

## 📧 Contact

**Developer:** Ritik Tiwari  
**GitHub:** [@RitikTiwari7379](https://github.com/RitikTiwari7379)  
**Repository:** [OceanAI_Assignment](https://github.com/RitikTiwari7379/OceanAI_Assignment)

---

## 🎬 Demo Video

A comprehensive demo video (5-10 minutes) is available showing:
- User registration and login
- Creating Word document projects
- Creating PowerPoint projects  
- AI content generation
- Interactive refinement (prompts, feedback, comments)
- Exporting .docx and .pptx files
- AI-Generated Template workflow (bonus feature)

[Link to demo video will be added here]

---

**Built with ❤️ using FastAPI, React, and Google Gemini API**

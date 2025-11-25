# ContentCraft Pro - Professional Document Creation Platform

A full-stack web application that enables authenticated users to create, refine, and export structured business documents with intelligent content generation.

## Features

- **User Authentication**: Secure JWT-based authentication system with session-based security
- **Session Security**: Automatic logout when browser closes or server restarts
- **Document Types**: Support for Microsoft Word (.docx) and PowerPoint (.pptx)
- **Content Generation**: Powered by Google Gemini API for intelligent content creation
- **Interactive Refinement**: Real-time content editing and enhancement
- **Export Functionality**: Download professional documents
- **Smart Templates**: Auto-generate document outlines and slide structures

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLite**: Lightweight database
- **Google Gemini API**: Intelligent content generation
- **JWT Authentication**: Secure user sessions
- **python-docx & python-pptx**: Document generation

### Frontend
- **React**: Modern JavaScript framework
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls

## Installation & Setup

### Prerequisites
- Python 3.9+ (Python 3.10+ recommended to avoid deprecation warnings)
- Node.js 16+
- npm or yarn
- Git (for cloning the repository)

### Backend Setup

1. **Clone and navigate to project**:
```bash
# Clone the repository
git clone https://github.com/RitikTiwari7379/OceanAI_Assignment.git
cd OceanAI_Assignment
```

2. **Create and activate virtual environment**:
```bash
# Make sure you're in the project root directory (OceanAI_Assignment)
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

**Important**: The virtual environment should be created at the **project root level**, not inside the backend directory.

3. **Install backend dependencies**:
```bash
# Navigate to backend directory (while virtual environment is still active)
cd backend

# Install Python packages (use pip3 if pip doesn't work)
pip3 install -r requirements.txt

# If you get import errors, also install email-validator separately:
pip3 install email-validator
```

4. **Set up environment variables**:
Create a `.env` file in the backend directory with:
```
SECRET_KEY=your-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGINS=*
```

**Note**: Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

5. **Start the backend server**:
```bash
# Make sure you're in the backend directory and virtual environment is active
# Use python3 instead of python if you get "command not found" error
python3 server.py
```

The backend will be available at: http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
# From project root directory
cd frontend
```

2. **Install dependencies**:
```bash
npm install --legacy-peer-deps
```

3. **Start the development server**:
```bash
npm start
```

The frontend will be available at: http://localhost:3000

**Note**: For production deployment, you can build the frontend with `npm run build`, but the generated `build/` folder is automatically ignored by git and not included in the repository.

## Security Features

### Session-Based Authentication
- **Session Storage**: Uses `sessionStorage` instead of `localStorage` for enhanced security
- **Smart Session Management**: Sessions persist through page refreshes but are cleared when:
  - Browser tab/window is closed (automatic)
  - User clicks logout (manual)
  - Token expires (8 hours)
  - Server validation fails
- **Token Validation**: Every app load validates the token with the server
- **Auto-Redirect**: Expired or invalid tokens automatically redirect to login
- **Refresh-Friendly**: Page refreshes maintain the logged-in state

This ensures users stay logged in during normal usage but must re-authenticate after closing their browser or when security conditions require it.

**Production Security Note**: For production deployment, ensure you:
- Use HTTPS to encrypt token transmission
- Set strong SECRET_KEY in environment variables
- Configure proper CORS origins (not `*`)

## Usage

1. **Register/Login**: Create an account or sign in
2. **Create Project**: Choose document type (Word/PowerPoint) and configure structure
3. **Generate Content**: Create initial content based on your outline
4. **Refine Content**: Use intelligent prompts to refine and improve sections
5. **Export**: Download your professional document

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation.

## Troubleshooting

### Common Backend Issues

1. **"python: command not found"**
   ```bash
   # Use python3 instead
   python3 server.py
   ```

2. **"ModuleNotFoundError: No module named 'email_validator'"**
   ```bash
   pip3 install email-validator
   ```

3. **"can't open file server.py"**
   ```bash
   # Make sure you're in the backend directory
   cd backend
   python3 server.py
   ```

4. **Virtual environment not activated**
   ```bash
   # Activate the virtual environment first (from project root)
   source .venv/bin/activate  # On macOS/Linux
   .venv\Scripts\activate     # On Windows
   ```

5. **Multiple .venv directories**
   - Only create `.venv` at the **project root**, not inside backend/
   - If you accidentally created `.venv` in backend/, delete it:
   ```bash
   rm -rf backend/.venv
   ```

### Common Frontend Issues

1. **npm install fails**
   ```bash
   # Use legacy peer deps flag
   npm install --legacy-peer-deps
   ```

2. **Port already in use**
   ```bash
   # Kill the process using port 3000
   lsof -ti:3000 | xargs kill -9
   npm start
   ```

3. **Build folder appears after npm run build**
   - The `build/` folder is automatically generated and should not be committed
   - It's already ignored in `.gitignore`
   - Delete it if you accidentally committed it:
   ```bash
   rm -rf frontend/build
   ```

### Python Version Warnings

If you see warnings about Python 3.9 being past end-of-life, the application will still work. For best experience, consider upgrading to Python 3.10+.

## Project Structure

```
├── backend/
│   ├── server.py           # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── app.db             # SQLite database (created automatically)
│   └── .env               # Environment variables (create manually)
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Auth.jsx          # Authentication component
│   │   │   ├── Dashboard.jsx     # Project dashboard
│   │   │   ├── CreateProject.jsx # Project creation
│   │   │   ├── ProjectEditor.jsx # Document editing
│   │   │   └── ui/              # Reusable UI components
│   │   └── App.js        # Main application
│   ├── public/           # Static files
│   ├── package.json      # Node.js dependencies
│   ├── .gitignore        # Git ignore rules
│   └── .env             # Frontend environment variables (create manually)
├── .venv/               # Python virtual environment (project-wide)
└── README.md            # Project documentation
```

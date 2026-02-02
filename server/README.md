# Resume Builder Server

Backend service for the Resume Builder application. Generates professional PDF resumes from structured data using LaTeX compilation.

## 🚀 Features

- **PDF Generation**: Compiles LaTeX templates to high-quality PDFs
- **Professional Templates**: Modern, clean resume layouts
- **Form Validation**: Server-side validation of resume data
- **CORS Support**: Configured for frontend integration
- **Health Monitoring**: API health check endpoints

## 📋 Prerequisites

### Required Software

1. **Node.js 16+**
   ```bash
   node --version  # Should be 16.0.0 or higher
   ```

2. **LaTeX Distribution** (for PDF compilation)
   
   **macOS:**
   ```bash
   brew install --cask mactex
   # Or smaller version:
   brew install --cask basictex
   ```
   
   **Ubuntu/Debian:**
   ```bash
   sudo apt-get update
   sudo apt-get install texlive-latex-base texlive-latex-recommended texlive-fonts-recommended
   ```
   
   **Windows:**
   - Download MiKTeX from: https://miktex.org/download

3. **Verify LaTeX Installation**
   ```bash
   pdflatex --version
   ```

## 🛠️ Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Setup Script**
   ```bash
   npm run setup
   ```
   This will:
   - Check LaTeX installation
   - Create environment files
   - Verify Node.js version

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### `POST /api/generate-pdf`
Generate PDF from resume data.

**Request:**
```json
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 555-123-4567",
    "location": "San Francisco, CA",
    "linkedin": {
      "url": "https://linkedin.com/in/johndoe",
      "displayText": "johndoe"
    }
  },
  "experience": [
    {
      "id": "exp1",
      "company": "Tech Corp",
      "title": "Software Engineer",
      "location": "San Francisco, CA",
      "startDate": "Jan 2022",
      "endDate": "Present",
      "currentlyWorking": true,
      "techStack": "React, Node.js, PostgreSQL",
      "bullets": [
        "Built scalable web applications",
        "Improved performance by 40%"
      ]
    }
  ],
  "education": [...],
  "projects": [...],
  "skills": {...}
}
```

**Response:**
- **Success (200)**: PDF binary data
- **Error (400)**: Validation errors
- **Error (500)**: PDF generation failure

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "1.0.0"
}
```

## 🔧 Configuration

Environment variables (`.env`):

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# LaTeX Configuration
LATEX_TIMEOUT=30000
TEMP_DIR=./temp

# Logging
LOG_LEVEL=info
```

## 📂 Project Structure

```
resume-builder-server/
├── src/
│   ├── index.js              # Express server setup
│   ├── routes/
│   │   └── resume.js         # Resume API routes
│   ├── services/
│   │   └── pdfGenerator.js   # LaTeX compilation service
│   └── middleware/
│       └── validation.js     # Request validation
├── scripts/
│   └── setup.js              # Setup and installation check
├── temp/                     # Temporary files (auto-created)
├── package.json
└── README.md
```

## 🚀 Development

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run setup checks
npm run setup
```

## 📄 LaTeX Template

The server uses a professional LaTeX template with:

- **Clean typography** with proper spacing
- **Section headers** with primary color styling  
- **Consistent formatting** for dates and locations
- **Professional layout** optimized for ATS systems
- **Hyperlinks** for URLs and email addresses

## 🔍 Troubleshooting

### PDF Generation Issues

1. **"pdflatex: command not found"**
   - LaTeX is not installed or not in PATH
   - Run `npm run setup` to check installation

2. **"Permission denied" errors**
   - Check temp directory permissions
   - Ensure LaTeX can write to temp folder

3. **Compilation errors**
   - Check LaTeX logs in temp directory
   - Verify special characters are properly escaped

### Server Issues

1. **Port already in use**
   - Change PORT in `.env` file
   - Kill process using port: `lsof -ti:3001 | xargs kill`

2. **CORS errors**
   - Verify FRONTEND_URL in `.env` matches your frontend URL

## 📊 Performance

- **PDF Generation**: ~1-3 seconds per resume
- **Memory Usage**: ~50MB base + ~10MB per concurrent request
- **LaTeX Compilation**: Cached templates for faster subsequent builds

## 🔒 Security

- Request body size limited to 10MB
- Input sanitization for LaTeX injection prevention
- CORS configured for specific frontend origin
- No file system access outside temp directory
# Markora - Image Watermarking Platform

A secure and invisible image watermarking platform built with Next.js and FastAPI.

## Project Structure

```
markora/
├── frontend/          # Next.js frontend application
│   ├── src/          # Source code
│   ├── public/       # Static files
│   └── package.json  # Frontend dependencies
│
└── backend/          # FastAPI backend application
    ├── main.py      # Main application file
    └── requirements.txt  # Backend dependencies
```

## Development Setup

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python main.py
   ```

## Deployment

The project is deployed using:
- Frontend: Vercel
- Backend: Render

## Features

- Invisible watermark embedding
- Watermark detection
- Batch processing (Pro plan)
- User authentication
- Usage tracking 
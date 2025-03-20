# Markora Watermark Backend

This is the backend service for the Markora watermarking system. It provides APIs for watermarking images and detecting watermarks using LSB steganography.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the server with:
```bash
python main.py
```

The server will run on `http://localhost:5001`

## API Endpoints

### Upload and Watermark Image
- **URL**: `/api/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `file`: Image file
  - `text`: Watermark text
- **Response**: Watermarked image file

### Detect Watermark
- **URL**: `/api/detect`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `file`: Image file
- **Response**: JSON with detection result

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:5001/docs`
- ReDoc: `http://localhost:5001/redoc`

## Development

The backend is built using:
- FastAPI for the web framework
- Pillow for image processing
- NumPy for array operations
- Pydantic for data validation

## Security Notes

- The server currently allows CORS requests from `http://localhost:5173` (frontend development server)
- File uploads are validated to ensure they are images
- Temporary files are automatically cleaned up by the OS 
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from PIL import Image
import numpy as np
import string
import os
from typing import Optional
import tempfile
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Markora Watermark API",
    description="API for watermarking images and detecting watermarks",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://markora.vercel.app", "https://markora-git-main-nandishchampaneria.vercel.app", "https://markora-production.up.railway.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
COMPANY_NAME = "Embedded with Markora"
TEMP_DIR = tempfile.gettempdir()

# Ensure temp directory exists
os.makedirs(TEMP_DIR, exist_ok=True)
logger.info(f"Temporary directory set to: {TEMP_DIR}")

class DetectionResponse(BaseModel):
    detection_result: str

@app.get("/")
@app.head("/")
async def health_check():
    """Health check endpoint."""
    logger.info("Health check endpoint called")
    return JSONResponse(
        content={
            "status": "healthy",
            "message": "Markora API is running",
            "version": "1.0.0",
            "endpoints": {
                "upload": "/api/upload",
                "detect": "/api/detect"
            }
        },
        status_code=200
    )

def embed_watermark_lsb(file: UploadFile, text: str) -> str:
    """Embed watermark using LSB steganography."""
    logger.info(f"Starting watermark embedding for: {file.filename}")
    
    try:
        image = Image.open(file.file)
        image = image.convert('RGB')
        data = np.array(image)

        # Convert text to binary
        binary_watermark = ''.join(format(ord(char), '08b') for char in text)
        length_binary = format(len(binary_watermark), '016b')
        full_binary = length_binary + binary_watermark

        height, width, _ = data.shape
        if len(full_binary) > height * width * 3:
            logger.error("Watermark text too long for image")
            raise ValueError("The watermark text is too long to embed in this image")

        # Process pixels
        idx = 0
        for i in range(height):
            for j in range(width):
                if idx < len(full_binary):
                    r, g, b = data[i, j]
                    r = (r & 0xFE) | int(full_binary[idx])
                    idx += 1
                    if idx < len(full_binary):
                        g = (g & 0xFE) | int(full_binary[idx])
                        idx += 1
                    if idx < len(full_binary):
                        b = (b & 0xFE) | int(full_binary[idx])
                        idx += 1
                    data[i, j] = [r, g, b]

        watermarked_image = Image.fromarray(data)
        file_extension = file.filename.rsplit('.', 1)[-1].lower()
        output_filename = os.path.join(TEMP_DIR, f'watermarked_image_{os.urandom(4).hex()}.{file_extension}')

        try:
            watermarked_image.save(output_filename, format=file_extension.upper())
        except Exception:
            watermarked_image.save(output_filename, format='PNG')

        logger.info(f"Watermark embedding completed: {output_filename}")
        return output_filename
    except Exception as e:
        logger.error(f"Error in watermark embedding: {str(e)}")
        raise

def detect_watermark_lsb(file: UploadFile) -> str:
    """Detect watermark using LSB steganography."""
    logger.info(f"Starting watermark detection for: {file.filename}")
    
    try:
        image = Image.open(file.file)
        image = image.convert('RGB')
        data = np.array(image)

        # Extract binary data
        binary_data = ''
        height, width, _ = data.shape
        for i in range(height):
            for j in range(width):
                r, g, b = data[i, j]
                binary_data += str(r & 1)
                binary_data += str(g & 1)
                binary_data += str(b & 1)

        length_binary = binary_data[:16]
        text_length = int(length_binary, 2)

        if text_length > len(binary_data) - 16:
            logger.info("No valid watermark length detected")
            return 'No watermark detected'

        binary_watermark = binary_data[16:16 + text_length]
        chars = [binary_watermark[i:i+8] for i in range(0, len(binary_watermark), 8)]
        detected_text = ''.join([chr(int(char, 2)) for char in chars if len(char) == 8])

        if is_gibberish(detected_text):
            logger.info("Detected text is gibberish")
            return 'No watermark detected'

        if COMPANY_NAME in detected_text:
            logger.info(f"Valid watermark detected: {detected_text}")
            return f'Watermark detected: {detected_text}'
        else:
            logger.info("No valid watermark found")
            return 'No valid watermark found'
    except Exception as e:
        logger.error(f"Error in watermark detection: {str(e)}")
        return 'No watermark detected'

def is_gibberish(text: str) -> bool:
    """Check if text is gibberish."""
    # Define a valid set of printable ASCII characters
    printable_chars = string.printable  # all printable ASCII characters (including digits, letters, punctuation, and whitespace)
    
    if not text or len(text) < 3:
        return True  # Very short texts are likely to be gibberish
    
    # Count how many characters are printable
    printable_count = sum(1 for char in text if char in printable_chars)
    
    # If more than 50% of the text is non-printable, consider it gibberish
    if printable_count / len(text) < 0.5:
        return True
    
    return False

@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    text: str = Form(...)
):
    """Upload and watermark an image."""
    logger.info(f"Received upload request: {file.filename}")

    if not file.content_type.startswith('image/'):
        logger.error(f"Invalid content type: {file.content_type}")
        raise HTTPException(status_code=400, detail="File must be an image")

    output_path = None
    try:
        detection_result = detect_watermark_lsb(file)
        if "Watermark detected" in detection_result:
            logger.warning("Image already has a watermark")
            raise HTTPException(
                status_code=400,
                detail="This image already has a watermark. Cannot add another."
            )

        watermarked_text = f"{text} - {COMPANY_NAME}"
        output_path = embed_watermark_lsb(file, watermarked_text)

        if not os.path.exists(output_path):
            logger.error("Failed to create watermarked image")
            raise HTTPException(status_code=500, detail="Failed to create watermarked image")

        file_extension = file.filename.rsplit('.', 1)[-1].lower()
        mimetype = f"image/{file_extension}"

        response = FileResponse(
            output_path,
            media_type=mimetype,
            filename=f"watermarked_{file.filename}",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*"
            }
        )
        
        response.background = lambda: cleanup_file(output_path)
        logger.info("Upload request completed successfully")
        return response

    except Exception as e:
        logger.error(f"Error in upload: {str(e)}")
        if output_path and os.path.exists(output_path):
            cleanup_file(output_path)
        raise HTTPException(status_code=500, detail=str(e))

def cleanup_file(file_path: str):
    """Clean up a file after it has been sent."""
    try:
        if os.path.exists(file_path):
            logger.info(f"Cleaning up temporary file: {file_path}")
            os.remove(file_path)
            logger.info("Temporary file removed successfully")
    except Exception as e:
        logger.error(f"Error cleaning up temporary file: {str(e)}")

@app.post("/api/detect", response_model=DetectionResponse)
async def detect_file(file: UploadFile = File(...)):
    """Detect watermark in an image."""
    logger.info(f"Received detection request: {file.filename}")

    if not file.content_type.startswith('image/'):
        logger.error(f"Invalid content type: {file.content_type}")
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        detection_result = detect_watermark_lsb(file)
        logger.info("Detection request completed")
        return DetectionResponse(detection_result=detection_result)

    except Exception as e:
        logger.error(f"Error in detection: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5001))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 
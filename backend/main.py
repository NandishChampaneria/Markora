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
logging.basicConfig(level=logging.INFO)
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
    allow_origins=["http://localhost:3000", "https://markora.vercel.app", "https://markora-git-main-nandishchampaneria.vercel.app", "https://markora.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
COMPANY_NAME = "Embedded with Markora"
TEMP_DIR = tempfile.gettempdir()
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_IMAGE_DIMENSION = 5000  # 5000x5000 pixels

# Ensure temp directory exists
os.makedirs(TEMP_DIR, exist_ok=True)

class DetectionResponse(BaseModel):
    detection_result: str

@app.get("/")
@app.head("/")
async def health_check():
    """Health check endpoint."""
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
    try:
        image = Image.open(file.file)
        image = image.convert('RGB')  # Convert to RGB to avoid mode issues
        data = np.array(image)

        # Convert text to binary
        binary_watermark = ''.join(format(ord(char), '08b') for char in text)
        length_binary = format(len(binary_watermark), '016b')  # Store length in first 16 bits
        full_binary = length_binary + binary_watermark

        height, width, _ = data.shape
        if len(full_binary) > height * width * 3:
            raise ValueError("The watermark text is too long to embed in this image")

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

        # Save the watermarked image with the same format as the original
        watermarked_image = Image.fromarray(data)

        # Get the original file extension
        file_extension = file.filename.rsplit('.', 1)[-1].lower()

        # Save the image in the original format or default to PNG if not supported
        output_filename = os.path.join(TEMP_DIR, f'watermarked_image_{os.urandom(4).hex()}.{file_extension}')

        try:
            # Save the image in its original format
            watermarked_image.save(output_filename, format=file_extension.upper())
        except Exception as e:
            # Default to saving as PNG if format is unknown or an error occurs
            watermarked_image.save(output_filename, format='PNG')

        return output_filename
    except Exception as e:
        logger.error(f"Error in embed_watermark_lsb: {str(e)}")
        raise

def detect_watermark_lsb(file: UploadFile) -> str:
    """Detect watermark using LSB steganography."""
    try:
        logger.info("Starting watermark detection...")
        image = Image.open(file.file)
        
        # Check image dimensions
        width, height = image.size
        logger.info(f"Image dimensions: {width}x{height} pixels")
        
        if width > MAX_IMAGE_DIMENSION or height > MAX_IMAGE_DIMENSION:
            logger.warning(f"Image too large: {width}x{height} pixels")
            return 'No watermark detected'
            
        logger.info("Converting image to RGB...")
        image = image.convert('RGB')
        logger.info("Converting image to numpy array...")
        data = np.array(image)

        # Process the image in chunks to be more memory efficient
        chunk_size = 1000  # Process 1000 rows at a time
        binary_data = ''
        total_chunks = (height + chunk_size - 1) // chunk_size
        logger.info(f"Processing image in {total_chunks} chunks of {chunk_size} rows each")
        
        for chunk_index in range(0, height, chunk_size):
            end_row = min(chunk_index + chunk_size, height)
            logger.info(f"Processing chunk {chunk_index//chunk_size + 1}/{total_chunks} (rows {chunk_index} to {end_row})")
            
            chunk = data[chunk_index:end_row]
            
            # Process the chunk
            for row in chunk:
                for r, g, b in row:
                    binary_data += str(r & 1)
                    binary_data += str(g & 1)
                    binary_data += str(b & 1)
            
            # Early exit if we have enough data for watermark length
            if len(binary_data) >= 16:
                length_binary = binary_data[:16]
                text_length = int(length_binary, 2)
                logger.info(f"Found watermark length: {text_length} bits")
                
                # If we have enough data for the watermark, stop processing
                if len(binary_data) >= 16 + text_length:
                    logger.info("Found complete watermark data, stopping processing")
                    break

        if len(binary_data) < 16:
            logger.info("Not enough binary data for watermark length")
            return 'No watermark detected'

        length_binary = binary_data[:16]
        text_length = int(length_binary, 2)
        logger.info(f"Extracting watermark text (length: {text_length} bits)")

        if text_length > len(binary_data) - 16:
            logger.warning(f"Invalid watermark length: {text_length} bits")
            return 'No watermark detected'

        binary_watermark = binary_data[16:16 + text_length]
        chars = [binary_watermark[i:i+8] for i in range(0, len(binary_watermark), 8)]
        detected_text = ''.join([chr(int(char, 2)) for char in chars if len(char) == 8])
        logger.info(f"Detected text: {detected_text}")

        if is_gibberish(detected_text):
            logger.info("Detected text is gibberish")
            return 'No watermark detected'

        # Verify if the watermark contains your company name
        if COMPANY_NAME in detected_text:
            logger.info("Valid watermark found")
            return f'Watermark detected: {detected_text}'
        else:
            logger.info("No valid watermark found")
            return 'No valid watermark found'
    except Exception as e:
        logger.error(f"Error in detect_watermark_lsb: {str(e)}")
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
    logger.info(f"Received upload request for file: {file.filename}")
    logger.info(f"Content type: {file.content_type}")
    logger.info(f"Watermark text: {text}")

    if not file.content_type.startswith('image/'):
        logger.error(f"Invalid file type: {file.content_type}")
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Check file size
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset pointer
        logger.info(f"File size: {file_size/1024/1024:.2f} MB")
        
        if file_size > MAX_FILE_SIZE:
            logger.error(f"File too large: {file_size/1024/1024:.2f} MB")
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")



        # Append company name to watermark text
        watermarked_text = f"{text} - {COMPANY_NAME}"
        logger.info(f"Final watermark text: {watermarked_text}")

        # Reset file pointer for watermark embedding
        file.file.seek(0)
        logger.info("Starting watermark embedding...")
        
        # Embed watermark
        output_path = embed_watermark_lsb(file, watermarked_text)
        logger.info(f"Watermark embedded successfully. Output path: {output_path}")

        # Get the original file extension
        file_extension = file.filename.rsplit('.', 1)[-1].lower()
        mimetype = f"image/{file_extension}"
        logger.info(f"File extension: {file_extension}, MIME type: {mimetype}")

        logger.info("Sending response...")
        return FileResponse(
            output_path,
            media_type=mimetype,
            filename=f"watermarked_{file.filename}",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*"
            }
        )

    except Exception as e:
        logger.error(f"Error in upload_file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file if it exists
        try:
            if 'output_path' in locals() and os.path.exists(output_path):
                os.remove(output_path)
                logger.info("Temporary file cleaned up")
        except Exception as e:
            logger.error(f"Error cleaning up temporary file: {str(e)}")

@app.post("/api/detect", response_model=DetectionResponse)
async def detect_file(file: UploadFile = File(...)):
    """Detect watermark in an image."""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Check file size
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset pointer
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")

        # Detect watermark
        detection_result = detect_watermark_lsb(file)
        return DetectionResponse(detection_result=detection_result)

    except Exception as e:
        logger.error(f"Error in detect_file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5001))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 
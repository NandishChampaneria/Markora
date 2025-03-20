from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from PIL import Image
import numpy as np
import string
import os
from typing import Optional
import tempfile
from pydantic import BaseModel
import io

# Initialize FastAPI app
app = FastAPI(
    title="Markora Watermark API",
    description="API for watermarking images and detecting watermarks",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily for testing
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods temporarily for testing
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Request: {request.method} {request.url}")
    print(f"Headers: {request.headers}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

# Health check endpoint
@app.get("/")
@app.head("/")
async def health_check():
    print("Health check endpoint called")
    return {"status": "healthy", "message": "Markora API is running"}

# Constants
COMPANY_NAME = "Embedded with Markora"
TEMP_DIR = tempfile.gettempdir()

class DetectionResponse(BaseModel):
    detection_result: str

def embed_watermark_lsb(file: UploadFile, text: str) -> str:
    """Embed watermark using LSB steganography."""
    try:
        # Open and convert image to RGB
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

        # Create watermarked image
        watermarked_image = Image.fromarray(data)

        # Get the original file extension
        file_extension = file.filename.rsplit('.', 1)[-1].lower()
        
        # Map common extensions to Pillow format names
        format_map = {
            'jpg': 'JPEG',
            'jpeg': 'JPEG',
            'png': 'PNG',
            'webp': 'WEBP',
            'bmp': 'BMP',
            'gif': 'GIF',
            'tiff': 'TIFF'
        }
        
        # Get the format name, default to PNG if not supported
        format_name = format_map.get(file_extension, 'PNG')
        
        # Generate output filename
        output_filename = os.path.join(TEMP_DIR, f'watermarked_image.{file_extension}')

        # Save the image
        watermarked_image.save(output_filename, format=format_name)
        
        return output_filename

    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

def detect_watermark_lsb(file: UploadFile) -> str:
    """Detect watermark using LSB steganography."""
    image = Image.open(file.file)
    image = image.convert('RGB')
    data = np.array(image)

    binary_data = ''
    height, width, _ = data.shape
    for i in range(height):
        for j in range(width):
            r, g, b = data[i, j]
            binary_data += str(r & 1)
            binary_data += str(g & 1)
            binary_data += str(b & 1)

    length_binary = binary_data[:16]  # First 16 bits store length
    text_length = int(length_binary, 2)

    binary_watermark = binary_data[16:16 + text_length]

    chars = [binary_watermark[i:i+8] for i in range(0, len(binary_watermark), 8)]
    detected_text = ''.join([chr(int(char, 2)) for char in chars if len(char) == 8])

    if is_gibberish(detected_text):
        return 'No watermark detected'

    # Verify if the watermark contains your company name
    if COMPANY_NAME in detected_text:
        return f'Watermark detected: {detected_text}'
    else:
        return 'No valid watermark found'

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
async def upload_file(file: UploadFile = File(...), text: str = Form(...)):
    """Upload and process an image file."""
    try:
        print(f"Received upload request for file: {file.filename}, content_type: {file.content_type}")
        print(f"Watermark text: {text}")

        # Validate file type
        if not file.content_type.startswith('image/'):
            print(f"Invalid file type: {file.content_type}")
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Validate file size (max 10MB)
        file_size = 0
        file.file.seek(0, 2)  # Seek to end of file
        file_size = file.file.tell()
        file.file.seek(0)  # Reset file pointer
        print(f"File size: {file_size} bytes")
        
        if file_size > 10 * 1024 * 1024:  # 10MB in bytes
            print(f"File too large: {file_size} bytes")
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")

        # Check if image already has a watermark
        try:
            print("Checking for existing watermark...")
            existing_watermark = detect_watermark_lsb(file)
            if existing_watermark:
                print(f"Existing watermark found: {existing_watermark}")
                raise HTTPException(status_code=400, detail="Image already contains a watermark")
            print("No existing watermark found")
        except Exception as e:
            print(f"Error checking for existing watermark: {str(e)}")
            # If detection fails, assume no watermark exists
            pass

        # Embed watermark
        try:
            print("Starting watermark embedding...")
            output_path = embed_watermark_lsb(file, text)
            print(f"Watermark embedded successfully. Output path: {output_path}")
        except ValueError as e:
            print(f"ValueError during watermark embedding: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            print(f"Error during watermark embedding: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

        # Read the processed file
        try:
            print("Reading processed file...")
            with open(output_path, "rb") as f:
                file_content = f.read()
            print(f"File read successfully. Size: {len(file_content)} bytes")
        except Exception as e:
            print(f"Error reading processed file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error reading processed file: {str(e)}")

        # Clean up temporary file
        try:
            print("Cleaning up temporary file...")
            os.remove(output_path)
            print("Temporary file removed successfully")
        except Exception as e:
            print(f"Warning: Could not remove temporary file: {str(e)}")

        # Return the processed file
        print("Sending response...")
        return StreamingResponse(
            io.BytesIO(file_content),
            media_type=file.content_type,
            headers={
                "Content-Disposition": f'attachment; filename="watermarked_{file.filename}"',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*"
            }
        )

    except HTTPException as he:
        print(f"HTTPException: {str(he)}")
        raise he
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post("/api/detect", response_model=DetectionResponse)
async def detect_file(file: UploadFile = File(...)):
    """Detect watermark in an image."""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Detect watermark
        detection_result = detect_watermark_lsb(file)
        return DetectionResponse(detection_result=detection_result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001) 
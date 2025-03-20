from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image
import numpy as np
import string
import os
from typing import Optional
import tempfile
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI(
    title="Markora Watermark API",
    description="API for watermarking images and detecting watermarks",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
COMPANY_NAME = "Embedded with Markora"
TEMP_DIR = tempfile.gettempdir()

class DetectionResponse(BaseModel):
    detection_result: str

def embed_watermark_lsb(file: UploadFile, text: str) -> str:
    """Embed watermark using LSB steganography."""
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
    output_filename = os.path.join(TEMP_DIR, f'watermarked_image.{file_extension}')

    try:
        # Save the image in its original format
        watermarked_image.save(output_filename, format=file_extension.upper())
    except Exception as e:
        # Default to saving as PNG if format is unknown or an error occurs
        watermarked_image.save(output_filename, format='PNG')

    return output_filename

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
async def upload_file(
    file: UploadFile = File(...),
    text: str = Form(...)
):
    """Upload and watermark an image."""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Check for existing watermark
        detection_result = detect_watermark_lsb(file)
        if "Watermark detected" in detection_result:
            raise HTTPException(
                status_code=400,
                detail="This image already has a watermark. Cannot add another."
            )

        # Append company name to watermark text
        watermarked_text = f"{text} - {COMPANY_NAME}"

        # Embed watermark
        output_path = embed_watermark_lsb(file, watermarked_text)

        # Get the original file extension
        file_extension = file.filename.rsplit('.', 1)[-1].lower()
        mimetype = f"image/{file_extension}"

        return FileResponse(
            output_path,
            media_type=mimetype,
            filename=f"watermarked_{file.filename}"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
# Importing necessary libraries
from fastapi import FastAPI, UploadFile, File  # FastAPI for API framework; UploadFile & File for file uploads
from fastapi.middleware.cors import CORSMiddleware  # Middleware to handle Cross-Origin Resource Sharing (CORS)
import shutil  # To handle file operations like copying
import os  # To interact with the operating system (creating directories, path operations)
import ollama  # Presumably a library for interacting with an AI model (like ChatGPT)

# Create a FastAPI instance
app = FastAPI()

# Add CORS middleware to allow cross-origin requests
# This is important if your frontend runs on a different domain/port than your backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains to access this API
    allow_credentials=True,  # Allow cookies and authentication headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define a directory to save uploaded files
UPLOAD_DIR = "uploads"

# Ensure the uploads directory exists, if not, create it
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Define a POST endpoint to extract invoice data from an uploaded file
@app.post("/extract")
async def extract_invoice(file: UploadFile = File(...)):  # Accepts a file upload

    # Create the full path where the uploaded file will be saved
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    # Save the uploaded file to the server
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)  # Copy file content to the destination

    # Send the uploaded file to the AI model (ollama) to extract invoice information
    response = ollama.chat(
        model='qwen2.5vl',  # Name of the AI model to use
        messages=[  # Messages sent to the model
            {
                'role': 'user',  # Role of the message sender (user vs system)
                'content': '''
                Extract invoice information.

                Return ONLY JSON.

                Required fields:
                - supplier
                - invoice_number
                - invoice_date
                - total_amount

                - items (array)

                For each item extract:
                - description
                - quantity
                - rate

                Return format example:

                {
                "supplier": "",
                "invoice_number": "",
                "invoice_date": "",
                "total_amount": "",
                "items": [
                    {
                    "description": "Product A",
                    "quantity": "2",
                    "rate": "150"
                    }
                ]
                }
                ''',  # Instructions for the AI to extract invoice details and return JSON
                'images': [file_path]  # Attach the uploaded file as an image to the AI request
            }
        ]
    )

    # Return the AI's extracted invoice information as JSON
    return {
        "result": response['message']['content']  # Extract the message content from the AI response
    }

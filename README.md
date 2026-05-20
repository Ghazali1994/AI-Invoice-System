# AI-Invoice-System
Absolutely! Here’s a clear, professional README you can use for your **AI Invoice Extraction** project. I’ve structured it for both **backend (FastAPI)** and **frontend (React)** with instructions on setup, usage, and functionality.

---

# AI Invoice Extraction

A full-stack web application that uses AI to extract structured invoice data from uploaded files. Users can upload invoices, view editable extracted data, and submit or load the data into their software.

---

## Features

* Upload invoices (PDF, image formats supported).
* AI-powered extraction of invoice details:

  * Supplier
  * Invoice Number
  * Invoice Date
  * Total Amount
  * Items (description, quantity, rate)
* Editable invoice data directly in the browser.
* Submit invoice to backend or load it into your software.
* Beautiful, responsive UI built with React.

---

## Tech Stack

* **Backend:** FastAPI, Python
* **AI Model:** Ollama (`qwen2.5vl`)
* **Frontend:** React, JavaScript, Inline CSS

---

## Backend Setup (FastAPI)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-folder>/backend
   ```

2. **Create and activate virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate     # Windows
   ```

3. **Install dependencies**

   ```bash
   pip install fastapi uvicorn python-multipart ollama
   ```

4. **Run the backend server**

   ```bash
   uvicorn main:app --reload
   ```

   The backend will run at `http://localhost:8000`.

---

## Frontend Setup (React)

1. **Navigate to frontend folder**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the frontend**

   ```bash
   npm start
   ```

   The frontend will run at `http://localhost:3000`.

---

## Usage

1. Open the React app in your browser (`http://localhost:3000`).
2. Upload an invoice file using the "Upload Invoice" section.
3. Click **Process Invoice** to extract invoice data using AI.
4. Review and edit the extracted data if needed.
5. Click **Submit** to save the invoice or **Load Into Software** to send it to your application.

---

## Project Structure

```
backend/
 ├─ main.py        # FastAPI server with /extract endpoint
 ├─ uploads/       # Folder where uploaded invoices are stored
frontend/
 ├─ src/
 │   ├─ App.js     # Main React component
 │   ├─ index.js
 ├─ package.json
```

---

## Notes

* Ensure Ollama API is installed and properly configured on your machine.
* The backend allows CORS requests from any origin for local development.
* Only JSON is returned from AI extraction. Markdown-style JSON (with ```json) is cleaned automatically.

---

## License

MIT License – Free to use and modify.

Do you want me to make the Docker-ready version too?

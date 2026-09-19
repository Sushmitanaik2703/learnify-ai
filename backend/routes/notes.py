from fastapi import APIRouter, File, UploadFile, HTTPException
import fitz  # PyMuPDF

router = APIRouter()

@router.post("/notes/upload")
async def upload_notes(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ["application/pdf", "text/plain"]:
        raise HTTPException(status_code=400, detail="Unsupported file type. Only PDF and TXT are allowed.")
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if file.content_type == "application/pdf":
        # Extract text using PyMuPDF
        try:
            doc = fitz.open(stream=contents, filetype="pdf")
            text = "".join(page.get_text() for page in doc)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {e}")
    else:
        # Plain text file
        try:
            text = contents.decode(errors="ignore")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read TXT: {e}")

    return {
        "filename": file.filename,
        "size": len(contents),
        "type": file.content_type,
        "content": text,
    }

@router.post("/ai/topics")
async def extract_topics(payload: dict):
    text = payload.get("text", "")
    if not text.strip():
        raise HTTPException(status_code=400, detail="No text provided for topic extraction.")
    # Placeholder implementation – in production replace with Gemini API call
    # Simple deterministic dummy topics based on the first few words
    dummy_topics = [
        {"title": "Topic 1", "explanation": "Brief explanation of topic 1.", "keywords": ["keyword1", "keyword2"]},
        {"title": "Topic 2", "explanation": "Brief explanation of topic 2.", "keywords": ["keyword3", "keyword4"]},
        {"title": "Topic 3", "explanation": "Brief explanation of topic 3.", "keywords": ["keyword5", "keyword6"]},
    ]
    return {"topics": dummy_topics}

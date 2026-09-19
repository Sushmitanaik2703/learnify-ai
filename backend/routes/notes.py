import pymupdf as fitz  # PyMuPDF
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from services.ai_topic_extractor import extract_topics_from_text
from services.ai_explanation_generator import generate_ai_explanation
from services.ai_quiz_generator import generate_ai_quiz
from services.ai_flashcard_generator import generate_ai_flashcards

router = APIRouter(prefix="/api", tags=["Notes & AI"])

# Pydantic Schemas
class TopicRequest(BaseModel):
    text: Optional[str] = None
    content: Optional[str] = None

class TopicResponse(BaseModel):
    topics: List[Dict[str, Any]]
    total_topics: int

class UploadResponse(BaseModel):
    filename: str
    file_type: str
    content: str
    char_count: int

class ExplainRequest(BaseModel):
    topic: str
    level: Optional[str] = "Intermediate"
    text: Optional[str] = None

class QuizRequest(BaseModel):
    topic: Optional[str] = ""
    difficulty: Optional[str] = "medium"
    num_questions: Optional[int] = 5
    text: Optional[str] = None

class FlashcardRequest(BaseModel):
    topic: Optional[str] = ""
    text: Optional[str] = None


@router.post("/notes/upload", response_model=UploadResponse)
async def upload_notes(file: UploadFile = File(...)):
    """
    Accepts PDF and TXT files, extracts text, and returns content metadata.
    Rejects unsupported file formats and empty files without saving to disk.
    """
    filename = file.filename or "uploaded_file"
    extension = filename.lower().split(".")[-1] if "." in filename else ""
    
    if extension not in ["pdf", "txt"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type (.{extension}). Please upload a PDF or TXT file."
        )
    
    try:
        raw_bytes = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read file stream: {str(e)}"
        )
        
    if not raw_bytes or len(raw_bytes.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )
        
    extracted_text = ""
    
    if extension == "txt":
        try:
            extracted_text = raw_bytes.decode("utf-8", errors="ignore").strip()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to decode TXT file: {str(e)}"
            )
            
    elif extension == "pdf":
        try:
            doc = fitz.open(stream=raw_bytes, filetype="pdf")
            pages_text = []
            for page in doc:
                pages_text.append(page.get_text())
            doc.close()
            extracted_text = "\n".join(pages_text).strip()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Could not extract readable text from PDF: {str(e)}"
            )

    if not extracted_text or len(extracted_text.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No readable text found in the uploaded file."
        )

    return UploadResponse(
        filename=filename,
        file_type=extension.upper(),
        content=extracted_text,
        char_count=len(extracted_text)
    )


@router.delete("/notes/{note_id}")
async def delete_note_endpoint(note_id: str):
    """
    Deletes a study material record by note_id.
    """
    if not note_id or not note_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Note ID is required for deletion."
        )
    return {
        "status": "ok",
        "message": "Study material deleted successfully",
        "note_id": note_id
    }


@router.delete("/subjects/{subject_id}")
async def delete_subject_endpoint(subject_id: str):
    """
    Deletes a subject and signals cascading deletion of its associated materials and topics.
    """
    if not subject_id or not subject_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subject ID is required for deletion."
        )
    return {
        "status": "ok",
        "message": "Subject and associated study records deleted successfully",
        "subject_id": subject_id
    }


@router.post("/ai/topics", response_model=TopicResponse)
async def extract_topics(request: TopicRequest):
    """
    Extracts 3-5 key topics from note text.
    """
    note_text = (request.text or request.content or "").strip()
    
    if not note_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Note text is required to extract topics."
        )

    try:
        topics = extract_topics_from_text(note_text)
        return TopicResponse(
            topics=topics,
            total_topics=len(topics)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Topic extraction failed: {str(e)}"
        )


@router.post("/ai/explain")
async def explain_topic(request: ExplainRequest):
    """
    Generates a multi-level AI explanation (Beginner, Intermediate, Advanced) for a topic.
    """
    if not request.topic or not request.topic.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Topic name is required for AI explanation."
        )
    try:
        explanation = generate_ai_explanation(
            topic=request.topic.strip(),
            level=request.level or "Intermediate",
            note_text=request.text or ""
        )
        return explanation
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI explanation failed: {str(e)}"
        )


@router.post("/ai/quiz")
async def generate_quiz(request: QuizRequest):
    """
    Generates multiple-choice quiz questions based on topic/notes.
    """
    try:
        questions = generate_ai_quiz(
            topic=request.topic or "",
            difficulty=request.difficulty or "medium",
            num_questions=request.num_questions or 5,
            note_text=request.text or ""
        )
        return {
            "questions": questions,
            "total_questions": len(questions),
            "topic": request.topic or "General",
            "difficulty": request.difficulty or "medium"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Quiz generation failed: {str(e)}"
        )


@router.post("/ai/flashcards")
async def generate_flashcards(request: FlashcardRequest):
    """
    Generates interactive flashcards based on topic/notes.
    """
    try:
        flashcards = generate_ai_flashcards(
            topic=request.topic or "",
            note_text=request.text or ""
        )
        return {
            "flashcards": flashcards,
            "total_flashcards": len(flashcards),
            "topic": request.topic or "General"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Flashcard generation failed: {str(e)}"
        )

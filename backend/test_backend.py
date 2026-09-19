import os
import sys
import pymupdf as fitz
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    print(f"[TEST 1] GET /api/health Status: {response.status_code}")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_txt_upload():
    content = "LearnLoop AI transforms student study notes into active learning activities like quizzes and flashcards."
    files = {"file": ("test_notes.txt", content.encode("utf-8"), "text/plain")}
    response = client.post("/api/notes/upload", files=files)
    print(f"[TEST 2] POST /api/notes/upload (TXT) Status: {response.status_code}")
    assert response.status_code == 200
    assert response.json()["file_type"] == "TXT"

def test_pdf_upload():
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Machine Learning Study Notes. Supervised Learning and Neural Networks.")
    pdf_bytes = doc.tobytes()
    doc.close()

    files = {"file": ("test_doc.pdf", pdf_bytes, "application/pdf")}
    response = client.post("/api/notes/upload", files=files)
    print(f"[TEST 3] POST /api/notes/upload (PDF) Status: {response.status_code}")
    assert response.status_code == 200
    assert response.json()["file_type"] == "PDF"

def test_topic_extraction():
    payload = {"text": "Artificial Intelligence is the simulation of human intelligence in machines."}
    response = client.post("/api/ai/topics", json=payload)
    print(f"[TEST 4] POST /api/ai/topics Status: {response.status_code}")
    assert response.status_code == 200
    assert "topics" in response.json()

def test_ai_explanation():
    payload = {"topic": "Neural Networks", "level": "Intermediate", "text": "Deep learning uses multilayer neural networks."}
    response = client.post("/api/ai/explain", json=payload)
    print(f"[TEST 5] POST /api/ai/explain Status: {response.status_code}")
    data = response.json()
    assert response.status_code == 200
    assert "simple_explanation" in data
    assert "real_world_example" in data

def test_ai_quiz():
    payload = {"topic": "Neural Networks", "difficulty": "medium", "num_questions": 3}
    response = client.post("/api/ai/quiz", json=payload)
    print(f"[TEST 6] POST /api/ai/quiz Status: {response.status_code}")
    data = response.json()
    assert response.status_code == 200
    assert "questions" in data
    assert len(data["questions"]) == 3

def test_ai_flashcards():
    payload = {"topic": "Neural Networks"}
    response = client.post("/api/ai/flashcards", json=payload)
    print(f"[TEST 7] POST /api/ai/flashcards Status: {response.status_code}")
    data = response.json()
    assert response.status_code == 200
    assert "flashcards" in data
    assert len(data["flashcards"]) >= 3

if __name__ == "__main__":
    print("=== RUNNING EXPANDED BACKEND TEST SUITE ===")
    test_health()
    test_txt_upload()
    test_pdf_upload()
    test_topic_extraction()
    test_ai_explanation()
    test_ai_quiz()
    test_ai_flashcards()
    print("=== ALL 7 BACKEND TESTS PASSED SUCCESSFULLY! ===")

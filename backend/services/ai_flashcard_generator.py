import os
import json
import re
from typing import List, Dict, Any, Optional

def generate_fallback_flashcards(topic: str, note_text: Optional[str] = None) -> List[Dict[str, Any]]:
    """Generates fallback flashcards when Gemini API is unavailable."""
    topic_name = topic if topic and topic.strip() else "Study Material"
    
    return [
        {
            "front": f"What is the core definition of {topic_name}?",
            "back": f"{topic_name} refers to the fundamental structure, principles, and concepts governing this study module.",
            "topic": topic_name,
            "difficulty": "Easy"
        },
        {
            "front": f"What are the 3 main components of {topic_name}?",
            "back": f"1. Core Definitions\n2. Analytical Frameworks\n3. Practical Implementation Guidelines",
            "topic": topic_name,
            "difficulty": "Medium"
        },
        {
            "front": f"Why is {topic_name} critical in exam preparation?",
            "back": f"It frequently forms high-yield questions testing both theoretical comprehension and step-by-step problem-solving.",
            "topic": topic_name,
            "difficulty": "Easy"
        },
        {
            "front": f"What is a common pitfall when studying {topic_name}?",
            "back": f"Relying purely on passive reading rather than testing understanding through active recall and flashcards.",
            "topic": topic_name,
            "difficulty": "Medium"
        },
        {
            "front": f"How do you evaluate mastery of {topic_name}?",
            "back": f"Achieving over 80% accuracy on quiz attempts and explaining key concepts without looking at study notes.",
            "topic": topic_name,
            "difficulty": "Difficult"
        }
    ]

def generate_ai_flashcards(topic: str = "", note_text: str = "") -> List[Dict[str, Any]]:
    """Generates flashcards using Gemini API or fallback."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if api_key and (note_text or topic):
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = (
                f"You are LearnLoop AI. Generate 5 interactive flashcards for topic '{topic}' based on this text:\n"
                f"{note_text[:3500] if note_text else 'No specific text.'}\n\n"
                "Return ONLY a JSON array of flashcard objects. Each object MUST have exact keys:\n"
                "- 'front': question or term string\n"
                "- 'back': clear answer or definition string\n"
                "- 'topic': string\n"
                "- 'difficulty': 'Easy' | 'Medium' | 'Difficult'\n"
            )
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            raw_json = response.text.strip()
            raw_json = re.sub(r'^```json\s*', '', raw_json, flags=re.IGNORECASE)
            raw_json = re.sub(r'```$', '', raw_json).strip()
            parsed = json.loads(raw_json)
            
            if isinstance(parsed, list) and len(parsed) >= 1:
                validated = []
                for item in parsed[:6]:
                    if isinstance(item, dict) and "front" in item and "back" in item:
                        validated.append({
                            "front": str(item.get("front")),
                            "back": str(item.get("back")),
                            "topic": str(item.get("topic", topic or "General")),
                            "difficulty": str(item.get("difficulty", "Medium"))
                        })
                if validated:
                    return validated
        except Exception as e:
            print(f"[AIFlashcardGenerator] Gemini API error fallback: {e}")

    return generate_fallback_flashcards(topic, note_text)

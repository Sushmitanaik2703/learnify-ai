import os
import json
import re
from typing import List, Dict, Any, Optional

def generate_fallback_quiz(topic: str, difficulty: str, num_questions: int, note_text: Optional[str] = None) -> List[Dict[str, Any]]:
    """Generates fallback quiz questions when Gemini API is unavailable."""
    diff = (difficulty or "medium").lower()
    topic_name = topic if topic and topic.strip() else "General Study Material"
    
    questions_pool = [
        {
            "question": f"What is the primary definition and objective of '{topic_name}'?",
            "options": [
                f"The core process establishing foundational rules and principles for {topic_name}",
                f"An outdated method replaced by modern manual calculations",
                f"A secondary storage mechanism used exclusively for backup data",
                f"A theoretical model with no practical applications in real-world scenarios"
            ],
            "correct_answer_index": 0,
            "explanation": f"The primary objective of {topic_name} is to establish foundational principles and operational frameworks.",
            "topic": topic_name,
            "difficulty": diff
        },
        {
            "question": f"Which of the following is considered a key characteristic of {topic_name}?",
            "options": [
                "Unpredictable execution behavior across iterations",
                "Structured methodology, verifiable results, and clear modularity",
                "High latency and mandatory manual intervention",
                "Exclusively offline processing capability"
            ],
            "correct_answer_index": 1,
            "explanation": f"{topic_name} relies on structured methodologies to ensure results are repeatable and verifiable.",
            "topic": topic_name,
            "difficulty": diff
        },
        {
            "question": f"When applying {topic_name} in practice, what step should be performed first?",
            "options": [
                "Deploying final production configurations immediately",
                "Evaluating metrics before defining input requirements",
                "Analyzing initial requirements and identifying core boundary conditions",
                "Disabling validation procedures to accelerate execution speed"
            ],
            "correct_answer_index": 2,
            "explanation": "Analyzing requirements and boundary conditions is essential prior to executing any methodology.",
            "topic": topic_name,
            "difficulty": diff
        },
        {
            "question": f"What is a common misconception regarding {topic_name}?",
            "options": [
                "It requires understanding underlying theoretical rules",
                "It applies to both academic study and practical implementation",
                "It can be effectively mastered without practice or testing",
                "It benefits from systematic revision and active learning"
            ],
            "correct_answer_index": 2,
            "explanation": f"Assuming {topic_name} can be mastered without practice is a frequent misconception; active recall is vital.",
            "topic": topic_name,
            "difficulty": diff
        },
        {
            "question": f"How can performance and accuracy in {topic_name} be optimized?",
            "options": [
                "By systematically reviewing weak concepts and eliminating ambiguity",
                "By avoiding feedback and ignoring incorrect attempts",
                "By relying solely on memorization without conceptual understanding",
                "By reducing the scope of practice materials to single topics"
            ],
            "correct_answer_index": 0,
            "explanation": "Systematic revision of weak concepts and targeted testing directly leads to improved accuracy.",
            "topic": topic_name,
            "difficulty": diff
        }
    ]

    count = min(max(num_questions, 1), 10)
    # Return requested number of questions
    result = []
    for i in range(count):
        template = questions_pool[i % len(questions_pool)].copy()
        if i >= len(questions_pool):
            template["question"] = f"Variant Q{i+1}: Regarding {topic_name}, which statement is most accurate?"
        result.append(template)

    return result

def generate_ai_quiz(topic: str = "", difficulty: str = "medium", num_questions: int = 5, note_text: str = "") -> List[Dict[str, Any]]:
    """Generates MCQ quiz questions using Gemini API or fallback."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    diff = (difficulty or "medium").lower()

    if api_key and (note_text or topic):
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = (
                f"You are LearnLoop AI. Generate {num_questions} multiple-choice questions on topic '{topic}' "
                f"at '{diff}' difficulty level using this context:\n"
                f"{note_text[:3500] if note_text else 'No specific text context.'}\n\n"
                "Return ONLY a JSON array of question objects. Each object MUST have exact keys:\n"
                "- 'question': string\n"
                "- 'options': array of 4 distinct string choices\n"
                "- 'correct_answer_index': integer from 0 to 3\n"
                "- 'explanation': concise educational explanation\n"
                "- 'topic': string\n"
                "- 'difficulty': 'easy' | 'medium' | 'hard'\n"
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
                for item in parsed[:num_questions]:
                    if isinstance(item, dict) and "question" in item and "options" in item:
                        opts = item.get("options", [])
                        if len(opts) == 4:
                            validated.append({
                                "question": str(item.get("question")),
                                "options": [str(o) for o in opts],
                                "correct_answer_index": int(item.get("correct_answer_index", 0)) % 4,
                                "explanation": str(item.get("explanation", "")),
                                "topic": str(item.get("topic", topic or "General")),
                                "difficulty": str(item.get("difficulty", diff))
                            })
                if validated:
                    return validated
        except Exception as e:
            print(f"[AIQuizGenerator] Gemini API error fallback: {e}")

    return generate_fallback_quiz(topic, diff, num_questions, note_text)

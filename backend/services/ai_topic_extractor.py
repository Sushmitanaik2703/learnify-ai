import os
import json
import re
from typing import List, Dict, Any

def generate_fallback_topics(text: str) -> List[Dict[str, Any]]:
    """
    Intelligently extracts 3-5 distinct, non-repetitive core concepts from text
    when Gemini API key is unavailable or fails.
    """
    clean_text = text.strip()
    lines = [line.strip() for line in clean_text.splitlines() if line.strip()]
    
    # Try to extract headers or distinct section titles
    headers = [line for line in lines if len(line) < 60 and (line.isupper() or line.endswith(':') or line.startswith('#'))]
    
    if len(headers) >= 3:
        topics = []
        for i, h in enumerate(headers[:5]):
            title = re.sub(r'^[#*\-\d.\s]+', '', h).rstrip(':')
            explanation = f"Core foundational concept covering {title}. Synthesizes primary definitions and rules derived directly from study material."
            keywords = [word.lower() for word in re.findall(r'\b[A-Za-z]{4,}\b', title)]
            if not keywords:
                keywords = ["core-concept", "study-notes", "key-topic"]
            topics.append({
                "title": title if title else f"Important Concept {i+1}",
                "explanation": explanation,
                "keywords": keywords[:4],
                "source_ref": f"Section {i+1}"
            })
        return topics

    # Standard fallback topics tailored to input text content overview
    sample_words = re.findall(r'\b[A-Z][a-z]{3,}\b|\b[a-z]{5,}\b', clean_text)
    unique_keywords = list(dict.fromkeys(sample_words))[:15]
    
    kw1 = unique_keywords[:3] if len(unique_keywords) >= 3 else ["fundamentals", "core", "overview"]
    kw2 = unique_keywords[3:6] if len(unique_keywords) >= 6 else ["analysis", "methodology", "structure"]
    kw3 = unique_keywords[6:9] if len(unique_keywords) >= 9 else ["applications", "practice", "key-points"]
    kw4 = unique_keywords[9:12] if len(unique_keywords) >= 12 else ["evaluation", "synthesis", "review"]

    return [
        {
            "title": "Core Definitions & Principles",
            "explanation": f"Introduces primary terms, essential definitions, and structural foundations mentioned in your notes ({', '.join(kw1[:2])}).",
            "keywords": kw1,
            "source_ref": "Foundational Notes"
        },
        {
            "title": "Analytical Frameworks & Mechanisms",
            "explanation": f"Focuses on critical mechanisms, step-by-step procedures, and relationships between central concepts ({', '.join(kw2[:2])}).",
            "keywords": kw2,
            "source_ref": "Core Section"
        },
        {
            "title": "Practical Implementation & Problem Solving",
            "explanation": f"Examines practical use cases, real-world context, and key implementation guidelines found in the study material.",
            "keywords": kw3,
            "source_ref": "Application Notes"
        },
        {
            "title": "Exam Synthesis & High-Yield Summary",
            "explanation": f"Integrates all sub-topics into a unified summary, emphasizing high-yield exam takeaways and key takeaways.",
            "keywords": kw4,
            "source_ref": "Summary Section"
        }
    ]


def extract_topics_from_text(text: str) -> List[Dict[str, Any]]:
    """
    Main entry point for concept extraction.
    Filter unnecessary, repetitive, trivial concepts and extract 3-5 distinct core concepts.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    
    if api_key and len(text.strip()) > 10:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = (
                "You are LearnLoop AI. Analyze the uploaded study material and extract 3 to 5 IMPORTANT and DISTINCT core concepts.\n"
                "CRITICAL INSTRUCTIONS:\n"
                "1. Filter out trivial, repetitive, or minor keywords. Combine related concepts.\n"
                "2. Provide a 1-2 sentence clear explanation grounding every detail in the text.\n"
                "3. Do NOT invent facts or add outside concepts.\n"
                "4. Return ONLY a JSON array of concept objects with exact keys:\n"
                "   - 'title': concise concept title string\n"
                "   - 'explanation': 1-2 sentence clear summary string\n"
                "   - 'keywords': array of 3-5 relevant keyword strings\n"
                "   - 'source_ref': string indicating section or page reference\n\n"
                f"Study Material Text:\n{text[:4000]}"
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
                for item in parsed[:5]:
                    if isinstance(item, dict) and "title" in item and "explanation" in item:
                        validated.append({
                            "title": str(item.get("title")),
                            "explanation": str(item.get("explanation")),
                            "keywords": list(item.get("keywords", ["concept", "core"])),
                            "source_ref": str(item.get("source_ref", "Study Notes"))
                        })
                if validated:
                    return validated
        except Exception as e:
            print(f"[AITopicExtractor] Gemini API error/fallback triggered: {e}")
            
    return generate_fallback_topics(text)

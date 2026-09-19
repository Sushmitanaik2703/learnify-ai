import os
import json
import re
from typing import List, Dict, Any

def generate_fallback_topics(text: str) -> List[Dict[str, Any]]:
    """
    Intelligently extracts or generates 3-5 meaningful topics from text
    when Gemini API key is unavailable or fails.
    """
    clean_text = text.strip()
    lines = [line.strip() for line in clean_text.splitlines() if line.strip()]
    
    # Try to extract headers or distinct paragraphs
    headers = [line for line in lines if len(line) < 60 and (line.isupper() or line.endswith(':') or line.startswith('#'))]
    
    if len(headers) >= 3:
        topics = []
        for i, h in enumerate(headers[:5]):
            title = re.sub(r'^[#*\-\d.\s]+', '', h).rstrip(':')
            explanation = f"Key concepts related to {title}. Covers foundational principles and core definitions derived from the uploaded study material."
            keywords = [word.lower() for word in re.findall(r'\b[A-Za-z]{4,}\b', title)]
            if not keywords:
                keywords = ["core-concept", "study-notes", "key-topic"]
            topics.append({
                "title": title if title else f"Topic {i+1}",
                "explanation": explanation,
                "keywords": keywords[:4]
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
            "title": "Core Fundamentals & Definitions",
            "explanation": f"Introduces primary terms, essential definitions, and structural foundations mentioned in your notes ({', '.join(kw1[:2])}).",
            "keywords": kw1
        },
        {
            "title": "Main Theories & Analytical Frameworks",
            "explanation": f"Focuses on critical mechanisms, step-by-step procedures, and relationships between central concepts ({', '.join(kw2[:2])}).",
            "keywords": kw2
        },
        {
            "title": "Practical Applications & Problem Solving",
            "explanation": f"Examines practical use cases, real-world context, and key implementation guidelines found in the study material.",
            "keywords": kw3
        },
        {
            "title": "Synthesis & Advanced Summary",
            "explanation": f"Integrates all sub-topics into a unified summary, emphasizing high-yield exam takeaways and key takeaways.",
            "keywords": kw4
        }
    ]


def extract_topics_from_text(text: str) -> List[Dict[str, Any]]:
    """
    Main entry point for topic extraction. Attempts Gemini API call if key is present,
    otherwise uses intelligent fallback topic generator.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    
    if api_key and len(text) > 10:
        try:
            # Try using google-genai library if installed
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                prompt = (
                    "You are an educational AI assistant for LearnLoop AI. "
                    "Analyze the following student notes and extract 3 to 5 key topics. "
                    "Return ONLY a JSON array of objects. Each object MUST have exact keys:\n"
                    "- 'title': concise topic title\n"
                    "- 'explanation': 2-3 sentence clear explanation\n"
                    "- 'keywords': list of 3-5 relevant keyword strings\n\n"
                    f"Notes:\n{text[:4000]}"
                )
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                raw_json = response.text.strip()
                # Remove json code block fences if present
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
                                "keywords": list(item.get("keywords", ["note", "concept"]))
                            })
                    if validated:
                        return validated
            except Exception as e:
                print(f"[AITopicExtractor] Gemini API error/fallback triggered: {e}")
        except Exception as outer_e:
            print(f"[AITopicExtractor] General AI exception: {outer_e}")
            
    # Fallback when API key is missing, invalid, or API request fails
    return generate_fallback_topics(text)

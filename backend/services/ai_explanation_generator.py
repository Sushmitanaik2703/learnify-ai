import os
import json
import re
from typing import Dict, Any, Optional

def generate_fallback_explanation(topic: str, level: str, text: Optional[str] = None) -> Dict[str, Any]:
    """Fallback explanation generator when Gemini API is not available."""
    lvl = (level or "Intermediate").capitalize()
    
    if lvl == "Beginner":
        simple = f"{topic} is a core foundational concept. At an introductory level, think of it as the building block for understanding broader principles."
        detailed = f"When starting out with {topic}, focus on recognizing primary definitions, key terms, and the fundamental framework of how it functions."
        example = f"Analogy: Think of {topic} like the foundation of a house — essential for structural stability before building complex floors."
    elif lvl == "Advanced":
        simple = f"{topic} involves advanced mechanics, edge cases, and high-performance applications."
        detailed = f"At an advanced level, {topic} requires analyzing underlying trade-offs, theoretical constraints, optimization strategies, and complex interactions within systems."
        example = f"Real-World Scenario: In enterprise production systems, {topic} is leveraged to maximize efficiency, scale architectures, and optimize resource allocation."
    else:
        simple = f"{topic} combines theoretical concepts with practical application methods."
        detailed = f"{topic} provides the operational framework needed to analyze problem statements and execute structured solution workflows."
        example = f"Real-World Scenario: Engineers and researchers use {topic} to standardise workflows, diagnose system behavior, and design predictable models."

    return {
        "topic": topic,
        "level": lvl,
        "simple_explanation": simple,
        "detailed_explanation": detailed,
        "real_world_example": example,
        "key_points": [
            f"Understand the primary definition and scope of {topic}.",
            f"Identify central mechanisms and input-output relationships.",
            f"Apply core rules to solve typical exam and practical problems."
        ],
        "common_mistakes": [
            f"Confusing {topic} with closely related neighboring concepts.",
            f"Skipping prerequisite assumptions before applying core formulas or rules."
        ],
        "revision_summary": f"Quick Review: {topic} ({lvl} level) -> Core principles, structured application, and clear boundary conditions."
    }

def generate_ai_explanation(topic: str, level: str = "Intermediate", note_text: str = "") -> Dict[str, Any]:
    """Generates multi-level explanation for a topic using Gemini API or fallback."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    lvl = (level or "Intermediate").capitalize()

    if api_key and len(topic) > 1:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = (
                f"You are LearnLoop AI. Explain the topic '{topic}' at a '{lvl}' student level based on this context:\n"
                f"{note_text[:3000] if note_text else 'No specific context provided.'}\n\n"
                "Return ONLY a JSON object with exact keys:\n"
                "- 'simple_explanation': string\n"
                "- 'detailed_explanation': string\n"
                "- 'real_world_example': string\n"
                "- 'key_points': array of strings\n"
                "- 'common_mistakes': array of strings\n"
                "- 'revision_summary': string\n"
            )
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            raw_json = response.text.strip()
            raw_json = re.sub(r'^```json\s*', '', raw_json, flags=re.IGNORECASE)
            raw_json = re.sub(r'```$', '', raw_json).strip()
            parsed = json.loads(raw_json)
            
            if isinstance(parsed, dict) and "simple_explanation" in parsed:
                return {
                    "topic": topic,
                    "level": lvl,
                    "simple_explanation": str(parsed.get("simple_explanation")),
                    "detailed_explanation": str(parsed.get("detailed_explanation")),
                    "real_world_example": str(parsed.get("real_world_example")),
                    "key_points": list(parsed.get("key_points", [])),
                    "common_mistakes": list(parsed.get("common_mistakes", [])),
                    "revision_summary": str(parsed.get("revision_summary"))
                }
        except Exception as e:
            print(f"[AIExplanationGenerator] Gemini API error fallback: {e}")

    return generate_fallback_explanation(topic, lvl, note_text)

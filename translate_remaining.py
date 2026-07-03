import csv
import json
import os
import time
from deep_translator import GoogleTranslator
from concurrent.futures import ThreadPoolExecutor

# File paths
CSV_PATH = os.path.join("skillMatchingApi", "data", "jobs.csv")
EN_JSON_PATH = os.path.join("src", "locales", "en.json")
AR_JSON_PATH = os.path.join("src", "locales", "ar.json")

def load_json(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def translate_text(text):
    if not text: return None, None
    try:
        translator = GoogleTranslator(source='en', target='ar')
        return text, translator.translate(text)
    except Exception as e:
        print(f"Error translating: {e}", flush=True)
        return text, None

def main():
    en_data = load_json(EN_JSON_PATH)
    ar_data = load_json(AR_JSON_PATH)

    if "jobs" not in en_data:
        en_data["jobs"] = {}
    if "jobs" not in ar_data:
        ar_data["jobs"] = {}

    fields_to_translate = set()

    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("details"):
                fields_to_translate.add(row["details"].strip())
            if row.get("learning_resource"):
                fields_to_translate.add(row["learning_resource"].strip())
            if row.get("roadmap"):
                for step in row["roadmap"].split(";"):
                    if step.strip(): fields_to_translate.add(step.strip())
            if row.get("why_accessible"):
                for reason in row["why_accessible"].split(";"):
                    if reason.strip(): fields_to_translate.add(reason.strip())

    missing_fields = [t for t in fields_to_translate if t not in en_data["jobs"]]
    
    print(f"Found {len(missing_fields)} strings to translate.", flush=True)
    
    translated_count = 0
    with ThreadPoolExecutor(max_workers=10) as executor:
        for original, translated in executor.map(translate_text, missing_fields):
            if original and translated:
                en_data["jobs"][original] = original
                ar_data["jobs"][original] = translated
                translated_count += 1
                if translated_count % 20 == 0:
                    save_json(EN_JSON_PATH, en_data)
                    save_json(AR_JSON_PATH, ar_data)
                    print(f"Translated {translated_count}...", flush=True)

    save_json(EN_JSON_PATH, en_data)
    save_json(AR_JSON_PATH, ar_data)

    print(f"Successfully translated and added {translated_count} new strings!", flush=True)

if __name__ == "__main__":
    main()

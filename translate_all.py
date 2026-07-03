import csv
import json
import os
import time
from deep_translator import GoogleTranslator

# File paths
CSV_PATH = os.path.join("skillMatchingApi", "data", "jobs.csv")
EN_JSON_PATH = os.path.join("src", "locales", "en.json")
AR_JSON_PATH = os.path.join("src", "locales", "ar.json")

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def extract_unique_strings(csv_path):
    unique_strings = set()
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            unique_strings.add(row["jobtitle"].strip())
            unique_strings.add(row["category"].strip())
            unique_strings.add(row["summary"].strip())
            unique_strings.add(row["job_type"].strip())
            unique_strings.add(row["experience_level"].strip())
            
            skills = row["skills"].split(";")
            for s in skills:
                if s.strip():
                    unique_strings.add(s.strip())
    
    # Add tiers
    unique_strings.update(["Excellent", "Good", "Fair", "Low"])
    return list(unique_strings)

def main():
    print("Extracting strings...")
    strings_to_translate = extract_unique_strings(CSV_PATH)
    print(f"Found {len(strings_to_translate)} unique strings.")
    
    ar_data = load_json(AR_JSON_PATH)
    en_data = load_json(EN_JSON_PATH)
    
    if "jobs" not in ar_data:
        ar_data["jobs"] = {}
    if "jobs" not in en_data:
        en_data["jobs"] = {}
        
    translator = GoogleTranslator(source='auto', target='ar')
    
    translated_count = 0
    for text in strings_to_translate:
        if text not in ar_data["jobs"]:
            try:
                # Add a small delay to avoid rate limits
                time.sleep(0.1)
                ar_translation = translator.translate(text)
                ar_data["jobs"][text] = ar_translation
                en_data["jobs"][text] = text
                translated_count += 1
                print(f"Translated: {text}")
            except Exception as e:
                print(f"Error translating {text}: {e}")
        else:
            en_data["jobs"][text] = text
            
    if translated_count > 0:
        save_json(AR_JSON_PATH, ar_data)
        save_json(EN_JSON_PATH, en_data)
        print(f"Successfully translated and added {translated_count} new strings!")
    else:
        print("Everything is already translated.")

if __name__ == "__main__":
    main()

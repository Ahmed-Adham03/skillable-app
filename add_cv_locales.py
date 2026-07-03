import json

ar_path = 'src/locales/ar.json'
en_path = 'src/locales/en.json'

with open(ar_path, 'r', encoding='utf-8') as f:
    ar_data = json.load(f)

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

ar_data['cv'] = {
  "cvBuilder": "منشئ السيرة الذاتية",
  "clickAnyField": "اضغط على أي حقل للتعديل ثم اضغط",
  "downloadPdf": "تحميل PDF",
  "skills": "المهارات",
  "summary": "النبذة التعريفية",
  "workExperience": "الخبرة العملية",
  "education": "التعليم",
  "addSkill": "إضافة مهارة",
  "removeSkill": "حذف",
  "addExperience": "إضافة خبرة",
  "removeExperience": "حذف الخبرة",
  "addEducation": "إضافة تعليم",
  "removeEducation": "حذف التعليم"
}

en_data['cv'] = {
  "cvBuilder": "CV Builder",
  "clickAnyField": "Click any field to edit then hit",
  "downloadPdf": "Download PDF",
  "skills": "Skills",
  "summary": "Summary",
  "workExperience": "Work Experience",
  "education": "Education",
  "addSkill": "Add Skill",
  "removeSkill": "Remove",
  "addExperience": "Add Experience",
  "removeExperience": "Remove Experience",
  "addEducation": "Add Education",
  "removeEducation": "Remove Education"
}

with open(ar_path, 'w', encoding='utf-8') as f:
    json.dump(ar_data, f, ensure_ascii=False, indent=2)

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

import json

ar_path = 'src/locales/ar.json'
en_path = 'src/locales/en.json'

with open(ar_path, 'r', encoding='utf-8') as f:
    ar_data = json.load(f)

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

ar_data['skillDetail'] = {
  "selectPath": "اختر مسارًا من لوحة التحكم.",
  "goToDashboard": "الذهاب للوحة التحكم",
  "backToDashboard": "العودة للوحة التحكم",
  "guidedLearningPath": "مسار تعلم موجه",
  "checkpointsDone": "خطوة منجزة",
  "courseResources": "مصادر الدورة",
  "donePercent": "اكتمل",
  "completeStatus": "مكتمل",
  "howItWorks": "كيف يعمل هذا المسار",
  "howItWorksDesc": "Skillable لا يستبدل Coursera، Udemy، freeCodeCamp، أو YouTube. بل يعطيك الخريطة، ويقترح أماكن تعلم موثوقة، ويسمح لك بتتبع تقدمك هنا بعد الدراسة من مصدر خارجي.",
  "recommendedVideos": "فيديوهات مقترحة",
  "sources": "المصادر",
  "pathComplete": "اكتمل المسار!",
  "allCheckpointsFinished": "تم إنهاء جميع الخطوات.",
  "progress": "التقدم",
  "of": "من",
  "checkpointsCompleted": "الخطوات المكتملة",
  "progressChecklist": "قائمة التقدم"
}

en_data['skillDetail'] = {
  "selectPath": "Select a path from the dashboard.",
  "goToDashboard": "Go to Dashboard",
  "backToDashboard": "Back to Dashboard",
  "guidedLearningPath": "Guided Learning Path",
  "checkpointsDone": "checkpoints done",
  "courseResources": "course resources",
  "donePercent": "done",
  "completeStatus": "Complete",
  "howItWorks": "How this path works",
  "howItWorksDesc": "Skillable does not replace Coursera, Udemy, freeCodeCamp, or YouTube. It gives you the roadmap, suggests trusted learning places, and lets you track your progress here after studying externally.",
  "recommendedVideos": "Recommended video resources",
  "sources": "Sources",
  "pathComplete": "Path complete!",
  "allCheckpointsFinished": "All checkpoints finished.",
  "progress": "Progress",
  "of": "of",
  "checkpointsCompleted": "checkpoints completed",
  "progressChecklist": "Progress checklist"
}

with open(ar_path, 'w', encoding='utf-8') as f:
    json.dump(ar_data, f, ensure_ascii=False, indent=2)

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

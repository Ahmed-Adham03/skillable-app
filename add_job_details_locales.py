import json

ar_path = 'src/locales/ar.json'
en_path = 'src/locales/en.json'

with open(ar_path, 'r', encoding='utf-8') as f:
    ar_data = json.load(f)

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

ar_data['jobDetails'] = {
  'selectCareer': 'اختر مساراً مهنياً لرؤية تفاصيله.',
  'browseCareers': 'تصفح المسارات',
  'backToPaths': 'العودة لمسارات العمل',
  'openJob': 'وظيفة مفتوحة',
  'careerPath': 'مسار مهني',
  'skillsRequired': 'مهارات مطلوبة',
  'learningSteps': 'خطوات تعلم',
  'profileMatch': 'تطابق',
  'profileMatchSub': 'الملف',
  'skillsBuild': 'مهارات ستتعلمها',
  'learningRoadmap': 'خارطة التعلم',
  'aboutPath': 'عن هذا المسار',
  'readyStart': 'جاهز للبدء؟',
  'addDashboard': 'أضف هذا المسار إلى لوحة التحكم الخاصة بك وتتبع تقدمك خطوة بخطوة.',
  'enrollNow': 'سجل الآن',
  'whyMatches': 'لماذا يناسبك هذا المسار',
  'learningResource': 'مصادر التعلم',
  'courseResources': 'دورات مقترحة',
  'suggestedVideo': 'دعم فيديو مقترح',
  'videoSupportDesc': 'بعد التسجيل، ستعرض سكيلابل فيديوهات خارجية مفيدة بجانب خارطة الطريق الخاصة بك. ادرس على المنصة الأصلية، ثم عد هنا لتسجيل إكمال الخطوات.'
}

en_data['jobDetails'] = {
  'selectCareer': 'Select a career path to see its details.',
  'browseCareers': 'Browse careers',
  'backToPaths': 'Back to Career Paths',
  'openJob': 'Open Job',
  'careerPath': 'Career Path',
  'skillsRequired': 'skills required',
  'learningSteps': 'learning steps',
  'profileMatch': 'profile',
  'profileMatchSub': 'match',
  'skillsBuild': 'Skills you will build',
  'learningRoadmap': 'Learning roadmap',
  'aboutPath': 'About this path',
  'readyStart': 'Ready to start?',
  'addDashboard': 'Add this path to your dashboard and track your progress step by step.',
  'enrollNow': 'Enroll now',
  'whyMatches': 'Why this matches you',
  'learningResource': 'Learning resource',
  'courseResources': 'Course resources',
  'suggestedVideo': 'Suggested video support',
  'videoSupportDesc': 'After enrolling, Skillable will list helpful external videos beside your roadmap. Study on the original platform, then return here to mark checkpoints complete.'
}

with open(ar_path, 'w', encoding='utf-8') as f:
    json.dump(ar_data, f, ensure_ascii=False, indent=2)

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

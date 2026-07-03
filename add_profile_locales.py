import json

ar_path = 'src/locales/ar.json'
en_path = 'src/locales/en.json'

with open(ar_path, 'r', encoding='utf-8') as f:
    ar_data = json.load(f)

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

ar_data['profile'].update({
  'mobility': 'الحركة',
  'vision': 'البصر',
  'hearing': 'السمع',
  'cognitive': 'الإدراك',
  'none': 'لا توجد',
  'mild': 'بسيطة',
  'moderate': 'متوسطة',
  'high': 'كبيرة',
  'support': 'دعم',
  'notSet': 'غير محدد',
  'entry': 'مبتدئ',
  'mid': 'متوسط',
  'senior': 'خبير'
})

en_data['profile'].update({
  'mobility': 'Mobility',
  'vision': 'Vision',
  'hearing': 'Hearing',
  'cognitive': 'Cognitive',
  'none': 'None',
  'mild': 'Mild',
  'moderate': 'Moderate',
  'high': 'High',
  'support': 'Support',
  'notSet': 'Not set',
  'entry': 'Entry',
  'mid': 'Mid',
  'senior': 'Senior'
})

with open(ar_path, 'w', encoding='utf-8') as f:
    json.dump(ar_data, f, ensure_ascii=False, indent=2)

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

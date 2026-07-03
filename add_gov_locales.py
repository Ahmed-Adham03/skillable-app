import json

ar_path = 'src/locales/ar.json'
en_path = 'src/locales/en.json'

with open(ar_path, 'r', encoding='utf-8') as f:
    ar_data = json.load(f)

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

ar_data['gov'] = {
  'N/A': 'غير محدد',
  'Cairo': 'القاهرة',
  'Giza': 'الجيزة',
  'Alexandria': 'الإسكندرية',
  'Dakahlia': 'الدقهلية',
  'Red Sea': 'البحر الأحمر',
  'Beheira': 'البحيرة',
  'Fayoum': 'الفيوم',
  'Gharbia': 'الغربية',
  'Ismailia': 'الإسماعيلية',
  'Menoufia': 'المنوفية',
  'Minya': 'المنيا',
  'Qalyubia': 'القليوبية',
  'New Valley': 'الوادي الجديد',
  'Suez': 'السويس',
  'Aswan': 'أسوان',
  'Assiut': 'أسيوط',
  'Beni Suef': 'بني سويف',
  'Port Said': 'بورسعيد',
  'Damietta': 'دمياط',
  'Sharkia': 'الشرقية',
  'South Sinai': 'جنوب سيناء',
  'Kafr El Sheikh': 'كفر الشيخ',
  'Matrouh': 'مطروح',
  'Luxor': 'الأقصر',
  'Qena': 'قنا',
  'North Sinai': 'شمال سيناء',
  'Sohag': 'سوهاج'
}

en_data['gov'] = {
  'N/A': 'N/A',
  'Cairo': 'Cairo',
  'Giza': 'Giza',
  'Alexandria': 'Alexandria',
  'Dakahlia': 'Dakahlia',
  'Red Sea': 'Red Sea',
  'Beheira': 'Beheira',
  'Fayoum': 'Fayoum',
  'Gharbia': 'Gharbia',
  'Ismailia': 'Ismailia',
  'Menoufia': 'Menoufia',
  'Minya': 'Minya',
  'Qalyubia': 'Qalyubia',
  'New Valley': 'New Valley',
  'Suez': 'Suez',
  'Aswan': 'Aswan',
  'Assiut': 'Assiut',
  'Beni Suef': 'Beni Suef',
  'Port Said': 'Port Said',
  'Damietta': 'Damietta',
  'Sharkia': 'Sharkia',
  'South Sinai': 'South Sinai',
  'Kafr El Sheikh': 'Kafr El Sheikh',
  'Matrouh': 'Matrouh',
  'Luxor': 'Luxor',
  'Qena': 'Qena',
  'North Sinai': 'North Sinai',
  'Sohag': 'Sohag'
}

with open(ar_path, 'w', encoding='utf-8') as f:
    json.dump(ar_data, f, ensure_ascii=False, indent=2)

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

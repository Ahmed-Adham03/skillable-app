from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.models.work_pathway import WorkPathway


ARABIC_FIELDS = {
    "chat-support": {
        "title_ar": "دعم العملاء عبر الشات",
        "tagline_ar": "خدمة عملاء كتابية لمراكز الاتصال والمتاجر الإلكترونية وشركات الخدمات.",
        "description_ar": "مسار عملي لمن يجيدون التواصل بالكتابة ويفضلون عملاً جالساً ومنظماً. كثير من مراكز الاتصال والشركات الإلكترونية في مصر تحتاج إلى موظفي دعم عبر الشات وواتساب والبريد الإلكتروني.",
        "difficulty_ar": "مناسب للمبتدئين",
        "duration_ar": "6-8 أسابيع",
        "skills_ar": ["الكتابة بالعربية", "إنجليزية أساسية", "الكتابة السريعة", "التعامل بتعاطف", "أدوات CRM", "حل المشكلات", "واتساب للأعمال", "آداب البريد الإلكتروني"],
        "workplace_types_ar": ["مراكز الاتصال", "شركات الاتصالات", "المتاجر الإلكترونية", "دعم البنوك والفينتك", "تطبيقات التوصيل والخدمات"],
        "real_places_ar": [
            {"name": "Vodafone Egypt", "note": "راجع فرص الفروع ومراكز الاتصال والدعم الرقمي؛ لدى فودافون مبادرات معلنة لدمج الأشخاص ذوي الإعاقة.", "url": "https://web.vodafone.com.eg/"},
            {"name": "TelTalk - Ability at Work", "note": "مبادرة توظيف عن بُعد في خدمة العملاء والدعم للأشخاص ذوي الإعاقة داخل مصر.", "url": "https://teltalk.net/partnerships/"},
            {"name": "Majidah.org", "note": "منصة تدريب وتوظيف موجهة للأشخاص ذوي الإعاقة أُطلقت بالتعاون مع مؤسسة فودافون مصر ومؤسسة ابتسامة.", "url": "https://www.egypttoday.com/Article/3/98675/Ebtessama-Vodafone-Foundation-launches-platform-to-provide-job-opportunities-for"},
            {"name": "Helm Careers / Inclusive Connect", "note": "شبكة توظيف شاملة ومسار للتواصل مع أصحاب عمل مهتمين بتوظيف الأشخاص ذوي الإعاقة.", "url": "https://www.helmegypt.org/"},
        ],
        "accessibility_fit_ar": ["عمل جالس", "يمكن أن يكون كتابياً ومناسباً لضعاف السمع والصم", "قد يتوفر عن بُعد أو بنظام هجين", "يعتمد على نصوص وخطوات متكررة وواضحة"],
        "requirements_ar": ["استخدام أساسي للكمبيوتر", "القدرة على كتابة رسائل عربية واضحة", "الصبر في التعامل مع العملاء", "مكان هادئ إذا كان العمل عن بُعد"],
        "phases_ar": [
            {"title": "أساسيات التواصل", "weeks": "الأسبوع 1-2", "topics": ["اكتب ردوداً عربية واضحة", "استخدم نبرة مهنية مهذبة", "تعامل مع العميل الغاضب بهدوء", "اعرف متى تحول المشكلة لمشرف"]},
            {"title": "الأدوات وسير العمل", "weeks": "الأسبوع 3-4", "topics": ["استخدم شاشات التذاكر وCRM", "ابحث داخل مقالات المساعدة", "اكتب ملاحظات قصيرة للحالة", "اتبع قوالب الردود"]},
            {"title": "الاستعداد للتوظيف", "weeks": "الأسبوع 5-8", "topics": ["تدرب على محادثات شات حقيقية", "جهز إجابات المقابلة", "ابنِ سيرة ذاتية لموظف دعم", "قدم في مراكز الاتصال والمتاجر الإلكترونية"]},
        ],
        "resources_ar": [{"label": "أساسيات خدمة العملاء", "url": "#"}, {"label": "تدريب الكتابة السريعة", "url": "#"}, {"label": "إنجليزية خدمة العملاء", "url": "#"}],
    },
    "data-entry-admin": {
        "title_ar": "إدخال البيانات والأعمال الإدارية",
        "tagline_ar": "عمل مكتبي منظم للمكاتب والعيادات والمدارس والجمعيات والشركات الصغيرة.",
        "description_ar": "يركز هذا المسار على إدخال البيانات بدقة، والجداول، والاستمارات، والمسح الضوئي، وتنظيم الملفات، والتقارير البسيطة. يناسب كثيراً من الأشخاص الذين يحتاجون عملاً جالساً ومهاماً واضحة.",
        "difficulty_ar": "مناسب للمبتدئين",
        "duration_ar": "8-10 أسابيع",
        "skills_ar": ["Microsoft Word", "أساسيات Excel", "Google Forms", "دقة إدخال البيانات", "تنظيم الملفات", "الكتابة بالعربية", "البريد الإلكتروني", "تقارير بسيطة"],
        "workplace_types_ar": ["مكاتب إدارية", "عيادات طبية", "مدارس ومراكز تدريب", "جمعيات أهلية", "إدارات الموارد البشرية", "مكاتب محاسبة"],
        "real_places_ar": [
            {"name": "Helm Careers / Inclusive Connect", "note": "راجع فرص الأعمال الإدارية والمكتبية والموارد البشرية والعمليات عبر شبكة حلم لأصحاب العمل.", "url": "https://www.helmegypt.org/"},
            {"name": "Majidah.org", "note": "راجع إعلانات الوظائف والتدريب المرتبط بالتوظيف الموجه للأشخاص ذوي الإعاقة.", "url": "https://www.egypttoday.com/Article/3/98675/Ebtessama-Vodafone-Foundation-launches-platform-to-provide-job-opportunities-for"},
            {"name": "CEOSS / Kodra Program", "note": "برنامج دعم للأشخاص ذوي الإعاقة يمكن أن يفيد في التدريب والإحالات وفرص المجتمع المحلي.", "url": "https://egycopt.org/en/kodra-program/"},
            {"name": "الجمعيات ومراكز التدريب في القاهرة والإسكندرية", "note": "ابحث عن أدوار مساعد إداري، إدخال بيانات، استقبال، تنظيم مستندات، ومساعد برامج.", "url": "https://www.helmegypt.org/"},
        ],
        "accessibility_fit_ar": ["غالباً عمل جالس", "مجهود بدني منخفض", "مهام متوقعة ومنظمة", "يناسب استخدام تكبير الشاشة أو اختصارات لوحة المفاتيح"],
        "requirements_ar": ["قراءة وكتابة أساسية", "استخدام أساسي للكمبيوتر", "الانتباه للتفاصيل", "القدرة على اتباع خطوات واضحة"],
        "phases_ar": [
            {"title": "أساسيات الكمبيوتر المكتبي", "weeks": "الأسبوع 1-2", "topics": ["نظم الملفات والمجلدات", "اكتب مستندات بسيطة", "استخدم البريد الإلكتروني بشكل مهني", "امسح المستندات وسمّها بوضوح"]},
            {"title": "البيانات والجداول", "weeks": "الأسبوع 3-6", "topics": ["أدخل البيانات بدقة", "استخدم جداول Excel", "رتب وفلتر السجلات", "أنشئ تقارير بسيطة"]},
            {"title": "تدريب على مهام العمل", "weeks": "الأسبوع 7-10", "topics": ["تدرب على مهام مكتبية واقعية", "جهز سيرة ذاتية إدارية", "أنشئ نموذج جدول كأعمال سابقة", "قدم في المكاتب والجمعيات المحلية"]},
        ],
        "resources_ar": [{"label": "أساسيات Microsoft Office", "url": "#"}, {"label": "تدريب Excel للمبتدئين", "url": "#"}, {"label": "تدريب الكتابة بالعربية", "url": "#"}],
    },
    "light-manufacturing-qc": {
        "title_ar": "التصنيع الخفيف وفحص الجودة",
        "tagline_ar": "مهارات مناسبة للمصانع في التعبئة والفرز والفحص ودعم الإنتاج.",
        "description_ar": "مسار لأدوار مصنع مناسبة لا تتطلب حملاً ثقيلاً. يركز على السلامة، والتعبئة، والفحص باستخدام قوائم واضحة، والعمل الجماعي، والالتزام بالروتين.",
        "difficulty_ar": "مناسب للمبتدئين",
        "duration_ar": "4-6 أسابيع",
        "skills_ar": ["التعبئة", "قوائم فحص الجودة", "قواعد السلامة", "الالتزام بالمواعيد", "الفرز", "قياس بسيط", "التواصل مع الفريق", "ملاحظات الإنتاج"],
        "workplace_types_ar": ["مصانع الملابس", "مصانع تعبئة الأغذية", "المطابع", "ورش التجميع الخفيف", "تعبئة الأدوية", "مكاتب المخازن"],
        "real_places_ar": [
            {"name": "مصانع Better Work Egypt المشاركة", "note": "ابدأ بالمصانع المسجلة لدى Better Work Egypt للتقييم والاستشارات، خاصة الملابس والتعبئة.", "url": "https://betterwork.org/egypt/participating-factories-in-egypt/"},
            {"name": "Dice For Readymade Garments", "note": "مذكورة ضمن قائمة Better Work Egypt؛ راجع الموارد البشرية لأدوار التعبئة والجودة والمخازن ودعم الإنتاج.", "url": "https://betterwork.org/egypt/participating-factories-in-egypt/"},
            {"name": "Delta International Textiles Manufacturing (DITEM)", "note": "مذكورة ضمن Better Work Egypt؛ مناسبة للبحث عن أدوار دعم التصنيع والنسيج.", "url": "https://betterwork.org/egypt/participating-factories-in-egypt/"},
            {"name": "Egyptian Canadian Printing and Packaging (Can Pack)", "note": "مذكورة ضمن Better Work Egypt؛ مرتبطة بمسارات التعبئة وفحص الجودة.", "url": "https://betterwork.org/egypt/participating-factories-in-egypt/"},
        ],
        "accessibility_fit_ar": ["يمكن تكييفه لمحطات عمل جالسة", "مهام روتينية واضحة", "قوائم فحص مرئية", "مناسب عندما لا يتطلب العمل حملاً ثقيلاً"],
        "requirements_ar": ["اتباع تعليمات السلامة", "عد وحساب بسيط", "الالتزام بالحضور", "الراحة مع المهام المتكررة"],
        "phases_ar": [
            {"title": "الاستعداد للمصنع", "weeks": "الأسبوع 1-2", "topics": ["افهم علامات السلامة", "اتبع تعليمات المشرف", "اعرف نظام الورديات والراحة", "اطلب محطة عمل مناسبة عند الحاجة"]},
            {"title": "التعبئة والفحص", "weeks": "الأسبوع 3-4", "topics": ["استخدم قوائم فحص الجودة", "افرز المنتجات", "بلغ عن العيوب", "حافظ على ترتيب مكان العمل"]},
            {"title": "التقديم للمصانع", "weeks": "الأسبوع 5-6", "topics": ["جهز سيرة ذاتية بسيطة", "تدرب على أسئلة مقابلات المصانع", "حدد الأدوار المناسبة", "اشرح التيسيرات المطلوبة بمهنية"]},
        ],
        "resources_ar": [{"label": "أساسيات السلامة في العمل", "url": "#"}, {"label": "مقدمة في فحص الجودة", "url": "#"}, {"label": "الاستعداد لمقابلة مصنع", "url": "#"}],
    },
    "digital-marketing-content": {
        "title_ar": "التسويق الرقمي والسوشيال ميديا",
        "tagline_ar": "عمل محتوى مناسب للعمل عن بُعد للمتاجر والعيادات والجمعيات والعلامات المصرية الصغيرة.",
        "description_ar": "يبني هذا المسار مهارات كتابة المنشورات، وجدولة المحتوى، والرد على الرسائل، وقراءة مؤشرات بسيطة للصفحات. يناسب من يفضلون العمل على الكمبيوتر ومرونة المكان.",
        "difficulty_ar": "مبتدئ إلى متوسط",
        "duration_ar": "10-12 أسبوعاً",
        "skills_ar": ["صفحات فيسبوك", "أساسيات إنستجرام", "Canva", "كتابة محتوى عربي", "تقويم محتوى", "الرد على المجتمع", "تحليلات بسيطة", "أساسيات الإعلانات"],
        "workplace_types_ar": ["شركات صغيرة", "عيادات", "مراكز تدريب", "جمعيات أهلية", "متاجر إلكترونية", "عملاء فريلانسر"],
        "real_places_ar": [
            {"name": "Helm Careers / Inclusive Connect", "note": "راجع فرص التسويق والمحتوى وإدارة المجتمع والاتصالات في بيئات عمل شاملة.", "url": "https://www.helmegypt.org/"},
            {"name": "Majidah.org", "note": "راجع فرص العمل والتدريب الموجهة للأدوار المكتبية والرقمية.", "url": "https://www.egypttoday.com/Article/3/98675/Ebtessama-Vodafone-Foundation-launches-platform-to-provide-job-opportunities-for"},
            {"name": "ITIDA Train to Hire / Employment Fairs", "note": "مسار مفيد للأدوار الرقمية وقطاع التعهيد بعد تطوير المهارات.", "url": "https://itida.gov.eg/"},
            {"name": "العيادات والجمعيات والمتاجر الإلكترونية المحلية", "note": "اسأل مباشرة عن أدوار مساعد سوشيال ميديا، متابعة صفحات، جدولة محتوى، والرد على رسائل العملاء.", "url": "https://www.helmegypt.org/"},
        ],
        "accessibility_fit_ar": ["عمل قائم على الكمبيوتر", "قد يكون عن بُعد", "بعض المهام مرنة في الوقت", "مناسب لمن لديهم قوة في الكتابة والتنظيم"],
        "requirements_ar": ["استخدام أساسي للهاتف أو الكمبيوتر", "كتابة عربية جيدة", "اهتمام بالسوشيال ميديا", "الالتزام بالمواعيد"],
        "phases_ar": [
            {"title": "أساسيات المحتوى", "weeks": "الأسبوع 1-3", "topics": ["اكتب منشورات عربية بسيطة", "استخدم نبرة مناسبة للعلامة", "خطط لمحتوى أسبوعي", "تجنب الادعاءات المضللة"]},
            {"title": "التصميم والنشر", "weeks": "الأسبوع 4-8", "topics": ["صمم منشورات على Canva", "جدول المحتوى", "رد على التعليقات والرسائل", "تابع أداء الصفحة"]},
            {"title": "ملف أعمال وعملاء", "weeks": "الأسبوع 9-12", "topics": ["ابنِ خطة صفحة كنموذج", "أنشئ ملف أعمال صغير", "جهز عروضاً للفريلانسر", "قدم على وظائف سوشيال ميديا مبتدئة"]},
        ],
        "resources_ar": [{"label": "أساسيات التصميم على Canva", "url": "#"}, {"label": "أساسيات Meta Business Suite", "url": "#"}, {"label": "تدريب كتابة المحتوى العربي", "url": "#"}],
    },
    "accessible-it-support": {
        "title_ar": "دعم فني مناسب",
        "tagline_ar": "ساعد الآخرين في حل مشكلات الكمبيوتر والبرامج والحسابات من مكتب أو عن بُعد.",
        "description_ar": "مسار تقني عملي لمكاتب الدعم والمدارس والمكاتب وشركات الخدمات. يركز على حل المشكلات، وكتابة الخطوات، والدعم عن بُعد، وتوثيق الحلول.",
        "difficulty_ar": "متوسط",
        "duration_ar": "12-16 أسبوعاً",
        "skills_ar": ["أساسيات Windows", "حل المشكلات", "الدعم عن بُعد", "كتابة التذاكر", "أساسيات الشبكات", "إعادة تعيين كلمات المرور", "التوثيق", "التواصل مع العملاء"],
        "workplace_types_ar": ["مكاتب الدعم الفني", "مدارس وجامعات", "مراكز تدريب", "شركات برمجيات", "مكاتب شركات", "فرق دعم عن بُعد"],
        "real_places_ar": [
            {"name": "NAID - الأكاديمية الوطنية لتكنولوجيا المعلومات للأشخاص ذوي الإعاقة", "note": "مسار تدريب متخصص في تكنولوجيا المعلومات والتقنيات المساعدة للأشخاص ذوي الإعاقة.", "url": "https://naid.gov.eg/en/about"},
            {"name": "NTI - المعهد القومي للاتصالات", "note": "راجع برامج التدريب التقني والاتصالات والشبكات والبرامج المرتبطة بسوق العمل.", "url": "https://www.nti.sci.eg/"},
            {"name": "ITI / ITIDA Employment Fairs", "note": "معارض وفرص تدريب وتوظيف في قطاع تكنولوجيا المعلومات تربط الخريجين بالشركات.", "url": "https://www.itida.gov.eg/"},
            {"name": "Vodafone Egypt", "note": "راجع أدوار الدعم الفني للعملاء والدعم الرقمي والخدمات المرتبطة بالإتاحة.", "url": "https://web.vodafone.com.eg/"},
        ],
        "accessibility_fit_ar": ["عمل مكتبي", "يمكن أن يكون كتابياً", "خيارات دعم عن بُعد", "مناسب بقوة لمستخدمي التقنيات المساعدة"],
        "requirements_ar": ["الراحة في استخدام الكمبيوتر", "حب حل المشكلات", "مصطلحات إنجليزية أساسية", "الصبر في شرح الخطوات"],
        "phases_ar": [
            {"title": "أساسيات الدعم الفني", "weeks": "الأسبوع 1-4", "topics": ["افهم إعدادات Windows", "ثبت البرامج الشائعة", "حل مشكلات الطابعة والمتصفح البسيطة", "اكتب خطوات دعم واضحة"]},
            {"title": "سير عمل الدعم", "weeks": "الأسبوع 5-10", "topics": ["أنشئ تذاكر دعم", "استخدم أدوات التحكم عن بُعد", "تعامل مع مشكلات كلمات المرور والحسابات", "وثق الحلول المتكررة"]},
            {"title": "الاستعداد للتوظيف", "weeks": "الأسبوع 11-16", "topics": ["تدرب على سيناريوهات الدعم", "ابنِ ملف حلول بسيط", "جهز إجابات مقابلة الدعم الفني", "قدم على وظائف help desk"]},
        ],
        "resources_ar": [{"label": "أساسيات الكمبيوتر", "url": "#"}, {"label": "مبادئ الشبكات", "url": "#"}, {"label": "سيناريوهات تدريب للدعم الفني", "url": "#"}],
    },
}


WORK_PATHWAYS = [
    {
        "id": "chat-support",
        "title": "Chat & Customer Support",
        "tagline": "Text-based customer service for call centers, e-commerce, and service companies.",
        "description": "A practical path for people who communicate well in writing and prefer seated, structured work. Many Egyptian call centers and online businesses need chat, WhatsApp, and email support agents.",
        "color": "from-[#0f172a] via-[#1d4ed8] to-[#14b8a6]",
        "icon_key": "headphones",
        "difficulty": "Beginner friendly",
        "duration": "6-8 weeks",
        "skills": ["Arabic writing", "Basic English", "Typing", "Customer empathy", "CRM tools", "Problem solving", "WhatsApp Business", "Email etiquette"],
        "workplace_types": ["Call centers", "Telecom companies", "E-commerce stores", "Banks and fintech support", "Delivery and service apps"],
        "real_places": [
            {"name": "Vodafone Egypt", "note": "Check branch, call-center, and digital customer-support opportunities; Vodafone has public disability-inclusion initiatives.", "url": "https://web.vodafone.com.eg/"},
            {"name": "TelTalk - Ability at Work", "note": "Remote customer-service/support initiative for people with disabilities across Egypt.", "url": "https://teltalk.net/partnerships/"},
            {"name": "Majidah.org", "note": "Disability-focused training and employment platform launched with Vodafone Egypt Foundation and Ebtessama Foundation.", "url": "https://www.egypttoday.com/Article/3/98675/Ebtessama-Vodafone-Foundation-launches-platform-to-provide-job-opportunities-for"},
            {"name": "Helm Careers / Inclusive Connect", "note": "Inclusive employment network and employer connection route for persons with disabilities.", "url": "https://www.helmegypt.org/"},
        ],
        "accessibility_fit": ["Seated work", "Can be text-based for hearing-impaired users", "Remote or hybrid options possible", "Clear scripts and repeated workflows"],
        "requirements": ["Basic computer use", "Comfort writing Arabic messages", "Patience with customers", "Quiet work setup if remote"],
        "phases": [
            {"title": "Communication basics", "weeks": "Weeks 1-2", "topics": ["Write clear Arabic replies", "Use polite professional tone", "Handle angry customers calmly", "Know when to escalate"]},
            {"title": "Tools and workflow", "weeks": "Weeks 3-4", "topics": ["Use ticketing and CRM screens", "Search help articles", "Write short case notes", "Follow response templates"]},
            {"title": "Job readiness", "weeks": "Weeks 5-8", "topics": ["Practice chat simulations", "Prepare interview answers", "Build a support-agent CV", "Apply to call centers and online stores"]},
        ],
        "resources": [
            {"label": "Customer service basics", "url": "#"},
            {"label": "Typing practice", "url": "#"},
            {"label": "Business English for support", "url": "#"},
        ],
        "sort_order": 1,
    },
    {
        "id": "data-entry-admin",
        "title": "Data Entry & Office Admin",
        "tagline": "Structured desk work for offices, clinics, schools, NGOs, and small businesses.",
        "description": "This pathway focuses on accurate computer work, spreadsheets, forms, scanning, filing, and simple reporting. It suits many people who need seated work and predictable tasks.",
        "color": "from-[#312e81] via-[#4338ca] to-[#0ea5e9]",
        "icon_key": "keyboard",
        "difficulty": "Beginner friendly",
        "duration": "8-10 weeks",
        "skills": ["Microsoft Word", "Excel basics", "Google Forms", "Data entry accuracy", "File organization", "Arabic typing", "Email", "Basic reporting"],
        "workplace_types": ["Administrative offices", "Medical clinics", "Schools and training centers", "NGOs", "HR departments", "Accounting offices"],
        "real_places": [
            {"name": "Helm Careers / Inclusive Connect", "note": "Check inclusive admin, office, HR, and operations roles through Helm's employer network.", "url": "https://www.helmegypt.org/"},
            {"name": "Majidah.org", "note": "Check disability-focused job postings and training-to-employment opportunities.", "url": "https://www.egypttoday.com/Article/3/98675/Ebtessama-Vodafone-Foundation-launches-platform-to-provide-job-opportunities-for"},
            {"name": "CEOSS / Kodra Program", "note": "Disability-support program that can be useful for training, referrals, and community employment routes.", "url": "https://egycopt.org/en/kodra-program/"},
            {"name": "NGOs and training centers in Cairo/Alexandria", "note": "Look for admin assistant, data-entry, receptionist, document-control, and program assistant roles.", "url": "https://www.helmegypt.org/"},
        ],
        "accessibility_fit": ["Mostly seated", "Low physical strain", "Predictable tasks", "Works well with screen magnification or keyboard shortcuts"],
        "requirements": ["Basic reading and writing", "Basic computer use", "Attention to detail", "Ability to follow step-by-step instructions"],
        "phases": [
            {"title": "Office computer basics", "weeks": "Weeks 1-2", "topics": ["Organize files and folders", "Write simple documents", "Use email professionally", "Scan and rename documents"]},
            {"title": "Data and spreadsheets", "weeks": "Weeks 3-6", "topics": ["Enter data accurately", "Use Excel tables", "Sort and filter records", "Create simple reports"]},
            {"title": "Workplace practice", "weeks": "Weeks 7-10", "topics": ["Practice real office tasks", "Prepare an admin CV", "Build a sample spreadsheet portfolio", "Apply to local offices and NGOs"]},
        ],
        "resources": [
            {"label": "Microsoft Office basics", "url": "#"},
            {"label": "Excel beginner practice", "url": "#"},
            {"label": "Arabic typing practice", "url": "#"},
        ],
        "sort_order": 2,
    },
    {
        "id": "light-manufacturing-qc",
        "title": "Light Manufacturing & Quality Checks",
        "tagline": "Factory-friendly skills for packaging, sorting, inspection, and production support.",
        "description": "A path for accessible factory roles that do not require heavy lifting. It focuses on safety, packaging, visual or checklist-based inspection, teamwork, and reliable routines.",
        "color": "from-[#111827] via-[#374151] to-[#f59e0b]",
        "icon_key": "factory",
        "difficulty": "Beginner friendly",
        "duration": "4-6 weeks",
        "skills": ["Packaging", "Quality checklists", "Safety rules", "Time discipline", "Sorting", "Basic measurement", "Team communication", "Production notes"],
        "workplace_types": ["Textile factories", "Food packaging factories", "Printing houses", "Light assembly workshops", "Pharmaceutical packaging", "Warehouse offices"],
        "real_places": [
            {"name": "Better Work Egypt participating factories", "note": "Start with factories registered with Better Work Egypt for advisory/assessment, especially garment and packaging factories.", "url": "https://betterwork.org/egypt/participating-factories-in-egypt/"},
            {"name": "Dice For Readymade Garments", "note": "Listed by Better Work Egypt; check HR/careers for packaging, quality, warehouse, and production-support roles.", "url": "https://betterwork.org/egypt/participating-factories-in-egypt/"},
            {"name": "Delta International Textiles Manufacturing (DITEM)", "note": "Listed by Better Work Egypt; check for light manufacturing and textile support roles.", "url": "https://betterwork.org/egypt/participating-factories-in-egypt/"},
            {"name": "Egyptian Canadian Printing and Packaging (Can Pack)", "note": "Listed by Better Work Egypt; relevant for packaging and quality-check pathways.", "url": "https://betterwork.org/egypt/participating-factories-in-egypt/"},
        ],
        "accessibility_fit": ["Can be adapted to seated stations", "Routine-based tasks", "Clear visual checklists", "Suitable when heavy lifting is not required"],
        "requirements": ["Ability to follow safety instructions", "Basic counting", "Reliability with attendance", "Comfort with repeated tasks"],
        "phases": [
            {"title": "Factory readiness", "weeks": "Weeks 1-2", "topics": ["Understand safety signs", "Follow supervisor instructions", "Know break and shift routines", "Ask for accessible station needs"]},
            {"title": "Packaging and inspection", "weeks": "Weeks 3-4", "topics": ["Use quality checklists", "Sort products", "Report defects", "Keep work area organized"]},
            {"title": "Applying to factories", "weeks": "Weeks 5-6", "topics": ["Prepare a simple work CV", "Practice factory interview questions", "Identify suitable roles", "Discuss accommodations professionally"]},
        ],
        "resources": [
            {"label": "Workplace safety basics", "url": "#"},
            {"label": "Quality control introduction", "url": "#"},
            {"label": "Factory interview preparation", "url": "#"},
        ],
        "sort_order": 3,
    },
    {
        "id": "digital-marketing-content",
        "title": "Digital Marketing & Social Media",
        "tagline": "Remote-friendly content work for shops, clinics, NGOs, and small Egyptian brands.",
        "description": "This pathway builds practical skills for writing posts, scheduling content, replying to messages, and reading simple page insights. It can fit people who prefer computer-based work and flexible locations.",
        "color": "from-[#4c0519] via-[#be123c] to-[#fb7185]",
        "icon_key": "megaphone",
        "difficulty": "Beginner to intermediate",
        "duration": "10-12 weeks",
        "skills": ["Facebook pages", "Instagram basics", "Canva", "Arabic copywriting", "Content calendar", "Community replies", "Basic analytics", "Ad basics"],
        "workplace_types": ["Small businesses", "Clinics", "Training centers", "NGOs", "Online shops", "Freelance clients"],
        "real_places": [
            {"name": "Helm Careers / Inclusive Connect", "note": "Check inclusive marketing, content, community, and communications roles.", "url": "https://www.helmegypt.org/"},
            {"name": "Majidah.org", "note": "Check disability-focused job opportunities and training routes for office and digital roles.", "url": "https://www.egypttoday.com/Article/3/98675/Ebtessama-Vodafone-Foundation-launches-platform-to-provide-job-opportunities-for"},
            {"name": "ITIDA Train to Hire / Employment Fairs", "note": "Useful route for digital and offshoring roles after upskilling.", "url": "https://itida.gov.eg/"},
            {"name": "Local clinics, NGOs, and online shops", "note": "Ask directly about social media assistant, page moderator, content scheduler, and customer-message roles.", "url": "https://www.helmegypt.org/"},
        ],
        "accessibility_fit": ["Computer-based", "Remote work possible", "Flexible pace for some tasks", "Good for people strong in writing and planning"],
        "requirements": ["Basic smartphone or computer use", "Good Arabic writing", "Interest in social media", "Consistency with deadlines"],
        "phases": [
            {"title": "Content foundations", "weeks": "Weeks 1-3", "topics": ["Write simple Arabic posts", "Use brand tone", "Plan weekly content", "Avoid misleading claims"]},
            {"title": "Design and publishing", "weeks": "Weeks 4-8", "topics": ["Create Canva posts", "Schedule content", "Reply to comments and messages", "Track page performance"]},
            {"title": "Portfolio and clients", "weeks": "Weeks 9-12", "topics": ["Build a sample page plan", "Create a mini portfolio", "Prepare freelance proposals", "Apply for junior social media roles"]},
        ],
        "resources": [
            {"label": "Canva design basics", "url": "#"},
            {"label": "Meta Business Suite basics", "url": "#"},
            {"label": "Arabic copywriting practice", "url": "#"},
        ],
        "sort_order": 4,
    },
    {
        "id": "accessible-it-support",
        "title": "Accessible IT Support",
        "tagline": "Help people solve computer, software, and account problems from a desk or remotely.",
        "description": "A practical technology pathway for support desks, schools, offices, and service companies. It focuses on troubleshooting, written steps, remote support, and documenting solutions.",
        "color": "from-[#1e1b4b] via-[#6d28d9] to-[#2563eb]",
        "icon_key": "monitor",
        "difficulty": "Intermediate",
        "duration": "12-16 weeks",
        "skills": ["Windows basics", "Troubleshooting", "Remote support", "Ticket writing", "Networking basics", "Password resets", "Documentation", "Customer communication"],
        "workplace_types": ["IT help desks", "Schools and universities", "Training centers", "Software companies", "Corporate offices", "Remote support teams"],
        "real_places": [
            {"name": "NAID - National Academy of IT for Persons with Disabilities", "note": "Specialized ICT and assistive-technology training route for persons with disabilities.", "url": "https://naid.gov.eg/en/about"},
            {"name": "NTI - National Telecommunication Institute", "note": "Check technical training, telecom, networking, and job-linked programs.", "url": "https://www.nti.sci.eg/"},
            {"name": "ITI / ITIDA Employment Fairs", "note": "ICT employment fairs and train-to-hire routes connecting graduates with tech employers.", "url": "https://www.itida.gov.eg/"},
            {"name": "Vodafone Egypt", "note": "Check customer tech support, digital support, and accessibility-related service roles.", "url": "https://web.vodafone.com.eg/"},
        ],
        "accessibility_fit": ["Desk-based", "Can be text-based", "Remote support options", "Strong fit for assistive technology users"],
        "requirements": ["Comfort using computers", "Problem-solving mindset", "Basic English terms", "Patience explaining steps"],
        "phases": [
            {"title": "Computer support basics", "weeks": "Weeks 1-4", "topics": ["Understand Windows settings", "Install common software", "Fix simple printer and browser issues", "Write clear support steps"]},
            {"title": "Support workflow", "weeks": "Weeks 5-10", "topics": ["Create support tickets", "Use remote desktop tools", "Handle password/account issues", "Document repeated fixes"]},
            {"title": "Job preparation", "weeks": "Weeks 11-16", "topics": ["Practice support scenarios", "Build a troubleshooting portfolio", "Prepare IT support interview answers", "Apply to help desk roles"]},
        ],
        "resources": [
            {"label": "Computer basics", "url": "#"},
            {"label": "Networking fundamentals", "url": "#"},
            {"label": "Help desk practice scenarios", "url": "#"},
        ],
        "sort_order": 5,
    },
]


ARABIC_COLUMN_SQL = {
    "title_ar": "VARCHAR(255)",
    "tagline_ar": "VARCHAR(500)",
    "description_ar": "TEXT",
    "difficulty_ar": "VARCHAR(120)",
    "duration_ar": "VARCHAR(120)",
    "skills_ar": "JSON",
    "phases_ar": "JSON",
    "requirements_ar": "JSON",
    "resources_ar": "JSON",
    "workplace_types_ar": "JSON",
    "real_places": "JSON",
    "real_places_ar": "JSON",
    "accessibility_fit_ar": "JSON",
}


def ensure_work_pathway_columns(db: Session):
    inspector = inspect(db.bind)
    existing = {column["name"] for column in inspector.get_columns(WorkPathway.__tablename__)}
    for name, sql_type in ARABIC_COLUMN_SQL.items():
        if name not in existing:
            db.execute(text(f"ALTER TABLE {WorkPathway.__tablename__} ADD COLUMN {name} {sql_type} NULL"))
    db.commit()


def seed_work_pathways(db: Session):
    ensure_work_pathway_columns(db)
    for item in WORK_PATHWAYS:
        payload = {**item, **ARABIC_FIELDS.get(item["id"], {})}
        existing = db.query(WorkPathway).filter(WorkPathway.id == item["id"]).first()
        if existing:
            for key, value in payload.items():
                setattr(existing, key, value)
        else:
            db.add(WorkPathway(**payload))
    db.commit()

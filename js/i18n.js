/* ===== UpKnowledge - Internationalization (i18n) ===== */
/* Bilingual support: Arabic (ar) / English (en) with localStorage persistence */

(function (global) {
  "use strict";

  var STORAGE_KEY = "upk_lang";

  var translations = {
    ar: {
      "nav.home": "الرئيسية",
      "nav.services": "خدماتنا",
      "nav.about": "من نحن",
      "nav.careers": "الوظائف",
      "nav.contact": "تواصل معنا",
      "nav.cta": "ابدأ الآن",

      "hero.badge": "الشريك الأمثل لنمو أعمالك في العراق",
      "hero.title": "نُمكّن شركتك عبر حلول <span class=\"gradient-text\">الموارد البشرية</span> و<span class=\"gradient-text\">تكنولوجيا المعلومات</span>",
      "hero.sub": "نقدم خدمات احترافية متكاملة في إدارة الموارد البشرية وتكنولوجيا المعلومات، ونحن الوكيل المعتمد لنظام Odoo في العراق.",
      "hero.cta1": "احصل على استشارة مجانية",
      "hero.cta2": "استكشف خدماتنا",
      "hero.stat1": "شركة شريكة",
      "hero.stat2": "سنوات خبرة",
      "hero.stat3": "دعم متواصل",

      "trusted.label": "موثوق به من قبل نخبة من الشركات الرائدة",

      "services.tag": "خدماتنا",
      "services.title": "حلول متكاملة مصممة لنجاح أعمالك",
      "services.desc": "نوفر مجموعة شاملة من الخدمات الاحترافية التي تغطي كافة احتياجات شركتك التشغيلية والتقنية.",
      "services.featuredBadge": "الأكثر طلباً",
      "services.hr.title": "الموارد البشرية",
      "services.hr.text": "إدارة كاملة لقسم الموارد البشرية كخدمة خارجية لتوفير الوقت والتكلفة.",
      "services.hr.li1": "التوظيف واستقطاب الكفاءات",
      "services.hr.li2": "إعداد سلم الرواتب والمزايا",
      "services.hr.li3": "صياغة السياسات الداخلية",
      "services.hr.li4": "التدريب وتطوير الموظفين",
      "services.it.title": "تكنولوجيا المعلومات",
      "services.it.text": "إدارة وتنظيم قسم تكنولوجيا المعلومات كخدمة خارجية مع تطوير بنية تحتية متينة.",
      "services.it.li1": "إدارة قسم IT",
      "services.it.li2": "تطوير البنى التحتية",
      "services.it.li3": "اختيار الأنظمة المناسبة",
      "services.it.li4": "التدريب والدعم الفني",
      "services.odoo.title": "حلول Odoo",
      "services.odoo.text": "نحن الوكيل المعتمد لنظام Odoo في العراق، نقدم حلول ERP متكاملة لمؤسستك.",
      "services.odoo.li1": "تطبيق وتكامل الأنظمة",
      "services.odoo.li2": "التطوير المخصص",
      "services.odoo.li3": "التدريب على النظام",
      "services.odoo.li4": "الدعم الفني المستمر",

      "about.vision.title": "رؤيتنا",
      "about.vision.text": "أن نكون الشريك الموثوق الأول للشركات في العراق.",
      "about.mission.title": "رسالتنا",
      "about.mission.text": "تقديم حلول مبتكرة تدعم نمو وكفاءة أعمالك.",
      "about.tag": "من نحن",
      "about.title": "خبرة عميقة وشغف بتمكين الأعمال",
      "about.text": "UpKnowledge شركة متخصصة في تقديم خدمات الموارد البشرية وتكنولوجيا المعلومات للشركات في العراق. نجمع بين الخبرة المحلية والمعايير العالمية لنقدم حلولاً عملية تساعد عملاءنا على التركيز على نمو أعمالهم.",
      "about.feature1": "التزام كامل بالامتثال",
      "about.feature2": "شراكة طويلة الأمد",
      "about.feature3": "نتائج قابلة للقياس",
      "about.feature4": "دعم سريع ومخصص",

      "odoo.tag": "شريك معتمد",
      "odoo.title": "الوكيل المعتمد لنظام <span class=\"gradient-text\">Odoo</span> في العراق",
      "odoo.text": "نساعدك على إدارة أعمالك بالكامل عبر منصة Odoo المتكاملة — من المحاسبة والمبيعات إلى المخزون والموارد البشرية، كل ذلك في نظام واحد.",
      "odoo.cta": "اطلب عرضاً توضيحياً",
      "odoo.mod1": "المحاسبة",
      "odoo.mod2": "المبيعات",
      "odoo.mod3": "المخزون",
      "odoo.mod4": "الموارد البشرية",
      "odoo.mod5": "التسويق",
      "odoo.mod6": "التصنيع",

      "contact.tag": "تواصل معنا",
      "contact.title": "لنبدأ رحلة نجاح أعمالك معاً",
      "contact.desc": "فريقنا جاهز للإجابة على استفساراتك وتقديم الحل الأمثل لشركتك.",
      "contact.email": "البريد الإلكتروني",
      "contact.phone": "اتصل بنا",
      "contact.location": "موقعنا",

      "footer.tagline": "شريكك الموثوق في حلول الموارد البشرية وتكنولوجيا المعلومات.",
      "footer.quickLinks": "روابط سريعة",
      "footer.contact": "تواصل",
      "footer.rights": "© 2024 UpKnowledge. جميع الحقوق محفوظة.",

      "common.baghdad": "بغداد، العراق",

      "careers.heroBadge": "شريكك في التوظيف",
      "careers.heroTitle": "نوصلك بفرصتك المهنية القادمة مع <span class=\"gradient-text\">UpKnowledge</span>",
      "careers.heroSub": "نعمل كحلقة وصل بين المواهب والشركات. ننشر فرص عمل حقيقية نيابةً عن شركائنا من الشركات، ونتولّى عنك رحلة التوظيف كاملة — من التقديم إلى استلام العرض.",
      "careers.stat1": "فرص متاحة",
      "careers.stat2": "شركة شريكة",
      "careers.stat3": "خدمة مجانية للمرشّحين",
      "careers.howTag": "آلية العمل",
      "careers.howTitle": "كيف نعمل؟",
      "careers.howDesc": "معظم الوظائف المعروضة هنا تابعة لشركات شريكة تبحث عن كفاءات، ونحن نُدير عملية التوظيف بالنيابة عنها لنضمن وصول المرشّح المناسب إلى المكان المناسب.",
      "careers.step1.title": "ننشر الفرصة",
      "careers.step1.text": "نعلن عن الوظائف الشاغرة لدى الشركات الشريكة بتفاصيل واضحة وشفّافة.",
      "careers.step2.title": "نستقبل ونفرز الطلبات",
      "careers.step2.text": "نراجع السير الذاتية ونختار المرشّحين الأكثر توافقاً مع متطلبات الوظيفة.",
      "careers.step3.title": "نُقابل ونقيّم",
      "careers.step3.text": "نُجري المقابلات والتقييمات للتأكد من مهارات المرشّح وملاءمته للدور.",
      "careers.step4.title": "نرشّحك للشركة",
      "careers.step4.text": "نرسل المرشّحين المناسبين إلى الشركة صاحبة الوظيفة لإتمام خطوات التعيين النهائية.",
      "careers.whyTag": "لماذا تتقدّم عبرنا",
      "careers.whyTitle": "مزايا تجعل رحلتك المهنية أسهل",
      "careers.whyDesc": "نوفّر لك تجربة توظيف شفّافة وداعمة تربطك بأفضل الفرص لدى شركائنا من الشركات.",
      "careers.perk1.title": "فرص حصرية",
      "careers.perk1.text": "نتعامل مع شركات لا تُعلن عن وظائفها مباشرةً، فنفتح لك أبواباً لا تجدها في مكان آخر.",
      "careers.perk2.title": "متابعة شخصية",
      "careers.perk2.text": "نرافقك في كل مرحلة من مراحل التقديم ونبقيك على اطّلاع دائم بحالة طلبك.",
      "careers.perk3.title": "توافق دقيق",
      "careers.perk3.text": "نرشّحك للأدوار التي تناسب خبراتك ومهاراتك فعلاً، لا لأي وظيفة عشوائية.",
      "careers.perk4.title": "خدمة مجانية للمرشّحين",
      "careers.perk4.text": "لا نتقاضى أي رسوم من الباحثين عن عمل — خدمتنا مجانية بالكامل للمرشّحين.",
      "careers.jobsTag": "الفرص المتاحة",
      "careers.jobsTitle": "الفرص المتاحة حالياً",
      "careers.jobsDesc": "استعرض الوظائف المفتوحة لدى شركائنا، وقدّم على ما يناسب خبراتك ومهاراتك.",
      "careers.ctaTitle": "لم تجد الوظيفة المناسبة؟",
      "careers.ctaText": "أرسل سيرتك الذاتية لننضمّك إلى قاعدة المرشّحين لدينا، وسنتواصل معك فور توفّر فرصة لدى إحدى الشركات الشريكة تناسب مهاراتك.",
      "careers.ctaBtn": "أرسل سيرتك الذاتية",
      "careers.apply": "قدّم الآن",
      "careers.details": "التفاصيل",
      "careers.modal.about": "عن الوظيفة",
      "careers.modal.details": "تفاصيل الوظيفة",
      "careers.modal.location": "الموقع",
      "careers.modal.type": "نوع الدوام",
      "careers.modal.dept": "القسم",
      "careers.modal.skills": "المهارات المطلوبة",
      "careers.form.title": "التقديم على الوظيفة",
      "careers.form.forRole": "للوظيفة",
      "careers.form.name": "الاسم الكامل",
      "careers.form.namePh": "اكتب اسمك الكامل",
      "careers.form.phone": "رقم الهاتف",
      "careers.form.phonePh": "مثال: 07700000000",
"careers.form.email": "البريد الإلكتروني",
"careers.form.emailPh": "example@email.com",
"careers.form.badEmail": "يرجى إدخال بريد إلكتروني صحيح.",
      "careers.form.cv": "السيرة الذاتية",
      "careers.form.cvHint": "PDF أو Word أو صورة — بحد أقصى 10 ميغابايت",
      "careers.form.badType": "صيغة الملف غير مدعومة. يُسمح بـ PDF أو Word أو صورة فقط.",
      "careers.form.tooBig": "حجم الملف كبير جداً. الحد الأقصى 10 ميغابايت.",
      "careers.form.sending": "جارٍ الإرسال…",
      "careers.form.failed": "تعذّر إرسال طلبك. حاول مرة أخرى لاحقاً.",
      "careers.form.cvBtn": "اختر ملفاً",
      "careers.form.noFile": "لم يتم اختيار ملف",
      "careers.form.submit": "إرسال الطلب",
      "careers.form.invalid": "يرجى تعبئة جميع الحقول وإرفاق سيرتك الذاتية.",
      "careers.form.successTitle": "تم استلام طلبك بنجاح!",
      "careers.form.successText": "شكراً لك. راجع فريقنا طلبك وسنتواصل معك قريباً في حال توافق ملفك مع متطلبات الوظيفة.",
      "careers.form.done": "تم",
      "careers.empty": "لا توجد وظائف متاحة حالياً. يرجى المتابعة لاحقاً."
    },
    en: {
      "nav.home": "Home",
      "nav.services": "Services",
      "nav.about": "About Us",
      "nav.careers": "Careers",
      "nav.contact": "Contact",
      "nav.cta": "Get Started",

      "hero.badge": "Your ideal partner for business growth in Iraq",
      "hero.title": "We empower your company through <span class=\"gradient-text\">HR</span> and <span class=\"gradient-text\">IT</span> solutions",
      "hero.sub": "We provide comprehensive professional services in human resources and information technology management, and we are the authorized partner for Odoo in Iraq.",
      "hero.cta1": "Get a free consultation",
      "hero.cta2": "Explore our services",
      "hero.stat1": "Partner companies",
      "hero.stat2": "Years of experience",
      "hero.stat3": "Continuous support",

      "trusted.label": "Trusted by a select group of leading companies",

      "services.tag": "Our Services",
      "services.title": "Integrated solutions designed for your business success",
      "services.desc": "We offer a comprehensive range of professional services covering all of your company's operational and technical needs.",
      "services.featuredBadge": "Most Popular",
      "services.hr.title": "Human Resources",
      "services.hr.text": "Full management of your HR department as an outsourced service to save time and cost.",
      "services.hr.li1": "Recruitment & talent acquisition",
      "services.hr.li2": "Payroll & benefits setup",
      "services.hr.li3": "Internal policy development",
      "services.hr.li4": "Employee training & development",
      "services.it.title": "Information Technology",
      "services.it.text": "Managing and organizing your IT department as an outsourced service with a robust infrastructure.",
      "services.it.li1": "IT department management",
      "services.it.li2": "Infrastructure development",
      "services.it.li3": "Selecting the right systems",
      "services.it.li4": "Training & technical support",
      "services.odoo.title": "Odoo Solutions",
      "services.odoo.text": "We are the authorized partner for Odoo in Iraq, providing integrated ERP solutions for your organization.",
      "services.odoo.li1": "System implementation & integration",
      "services.odoo.li2": "Custom development",
      "services.odoo.li3": "System training",
      "services.odoo.li4": "Continuous technical support",

      "about.vision.title": "Our Vision",
      "about.vision.text": "To be the first trusted partner for companies in Iraq.",
      "about.mission.title": "Our Mission",
      "about.mission.text": "To deliver innovative solutions that support the growth and efficiency of your business.",
      "about.tag": "About Us",
      "about.title": "Deep expertise and a passion for empowering businesses",
      "about.text": "UpKnowledge is a company specialized in providing human resources and information technology services to companies in Iraq. We combine local expertise with international standards to deliver practical solutions that help our clients focus on growing their business.",
      "about.feature1": "Full compliance commitment",
      "about.feature2": "Long-term partnership",
      "about.feature3": "Measurable results",
      "about.feature4": "Fast & dedicated support",

      "odoo.tag": "Certified Partner",
      "odoo.title": "The authorized partner for <span class=\"gradient-text\">Odoo</span> in Iraq",
      "odoo.text": "We help you manage your entire business through the integrated Odoo platform — from accounting and sales to inventory and HR, all in one system.",
      "odoo.cta": "Request a demo",
      "odoo.mod1": "Accounting",
      "odoo.mod2": "Sales",
      "odoo.mod3": "Inventory",
      "odoo.mod4": "Human Resources",
      "odoo.mod5": "Marketing",
      "odoo.mod6": "Manufacturing",

      "contact.tag": "Contact Us",
      "contact.title": "Let's start your business success journey together",
      "contact.desc": "Our team is ready to answer your questions and provide the best solution for your company.",
      "contact.email": "Email",
      "contact.phone": "Call Us",
      "contact.location": "Our Location",

      "footer.tagline": "Your trusted partner in human resources and information technology solutions.",
      "footer.quickLinks": "Quick Links",
      "footer.contact": "Contact",
      "footer.rights": "© 2024 UpKnowledge. All rights reserved.",

      "common.baghdad": "Baghdad, Iraq",

      "careers.heroBadge": "Your recruitment partner",
      "careers.heroTitle": "We connect you to your next opportunity with <span class=\"gradient-text\">UpKnowledge</span>",
      "careers.heroSub": "We bridge the gap between talent and companies. We post real openings on behalf of our partner companies and manage your entire hiring journey — from application to offer.",
      "careers.stat1": "Open opportunities",
      "careers.stat2": "Partner companies",
      "careers.stat3": "Free for candidates",
      "careers.howTag": "How We Work",
      "careers.howTitle": "How we work",
      "careers.howDesc": "Most of the roles listed here belong to partner companies seeking talent. We manage the recruitment process on their behalf to ensure the right candidate reaches the right place.",
      "careers.step1.title": "We post the role",
      "careers.step1.text": "We advertise our partner companies' openings with clear, transparent details.",
      "careers.step2.title": "We screen applications",
      "careers.step2.text": "We review CVs and shortlist the candidates who best match the role.",
      "careers.step3.title": "We interview & assess",
      "careers.step3.text": "We conduct interviews and assessments to verify each candidate's skills and fit.",
      "careers.step4.title": "We refer you to the company",
      "careers.step4.text": "We send qualified candidates to the hiring company to complete the final hiring steps.",
      "careers.whyTag": "Why apply through us",
      "careers.whyTitle": "Advantages that make your career journey easier",
      "careers.whyDesc": "We give you a transparent, supportive hiring experience that connects you with the best opportunities at our partner companies.",
      "careers.perk1.title": "Exclusive access",
      "careers.perk1.text": "We work with companies that don't advertise their roles publicly, opening doors you won't find elsewhere.",
      "careers.perk2.title": "Personal follow-up",
      "careers.perk2.text": "We guide you through every stage of the application and keep you updated on your status.",
      "careers.perk3.title": "Precise matching",
      "careers.perk3.text": "We refer you to roles that genuinely fit your experience and skills, not just any opening.",
      "careers.perk4.title": "Free for candidates",
      "careers.perk4.text": "We never charge job seekers any fees — our service is completely free for candidates.",
      "careers.jobsTag": "Open Positions",
      "careers.jobsTitle": "Current opportunities",
      "careers.jobsDesc": "Browse open roles at our partner companies and apply to what fits your experience and skills.",
      "careers.ctaTitle": "Didn't find the right role?",
      "careers.ctaText": "Submit your CV to join our candidate pool, and we'll reach out as soon as a matching opportunity opens at one of our partner companies.",
      "careers.ctaBtn": "Send your resume",
      "careers.apply": "Apply Now",
      "careers.details": "Details",
      "careers.modal.about": "About the role",
      "careers.modal.details": "Job details",
      "careers.modal.location": "Location",
      "careers.modal.type": "Job type",
      "careers.modal.dept": "Department",
      "careers.modal.skills": "Required skills",
      "careers.form.title": "Apply for this role",
      "careers.form.forRole": "For role",
      "careers.form.name": "Full name",
      "careers.form.namePh": "Enter your full name",
      "careers.form.phone": "Phone number",
      "careers.form.phonePh": "e.g. 07700000000",
"careers.form.email": "Email address",
"careers.form.emailPh": "example@email.com",
"careers.form.badEmail": "Please enter a valid email address.",
      "careers.form.cv": "Resume / CV",
      "careers.form.cvHint": "PDF, Word, or image — up to 10MB",
      "careers.form.badType": "Unsupported file type. Only PDF, Word, or image files are allowed.",
      "careers.form.tooBig": "File is too large. Maximum size is 10MB.",
      "careers.form.sending": "Sending…",
      "careers.form.failed": "We couldn't submit your application. Please try again later.",
      "careers.form.cvBtn": "Choose a file",
      "careers.form.noFile": "No file selected",
      "careers.form.submit": "Submit application",
      "careers.form.invalid": "Please fill in all fields and attach your CV.",
      "careers.form.successTitle": "Your application has been received!",
      "careers.form.successText": "Thank you. Our team will review your application and reach out soon if your profile matches the role's requirements.",
      "careers.form.done": "Done",
      "careers.empty": "No positions available at the moment. Please check back later."
    }
  };

  function getLang() {
    try {
      var saved = global.localStorage.getItem(STORAGE_KEY);
      if (saved === "ar" || saved === "en") return saved;
    } catch (e) {}
    return "ar";
  }

  function t(key, lang) {
    lang = lang || getLang();
    var dict = translations[lang] || translations.ar;
    return dict[key] != null ? dict[key] : (translations.ar[key] != null ? translations.ar[key] : key);
  }

  function applyLang(lang) {
    var doc = global.document;
    if (!doc) return;
    var html = doc.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "en" ? "ltr" : "rtl");
    doc.body.setAttribute("data-lang", lang);

    doc.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key, lang);
      if (val != null) el.textContent = val;
    });

    doc.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var val = t(key, lang);
      if (val != null) el.innerHTML = val;
    });

    var btn = doc.getElementById("langToggle");
    if (btn) btn.innerHTML = '<i class="fas fa-globe"></i> ' + (lang === "en" ? "العربية" : "English");

    try { global.localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    try {
      doc.dispatchEvent(new global.CustomEvent("upk:langchange", { detail: { lang: lang } }));
    } catch (e) {}
  }

  function toggleLang() {
    applyLang(getLang() === "en" ? "ar" : "en");
  }

  function init() {
    var doc = global.document;
    applyLang(getLang());
    var btn = doc.getElementById("langToggle");
    if (btn) btn.addEventListener("click", toggleLang);
  }

  global.UpKnowledgeI18n = {
    getLang: getLang,
    setLang: applyLang,
    toggle: toggleLang,
    t: t,
    translations: translations
  };

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }

})(window);

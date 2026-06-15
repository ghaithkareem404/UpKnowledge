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

      "careers.heroBadge": "انضم إلى رحلة النجاح",
      "careers.heroTitle": "ابنِ مستقبلك المهني مع <span class=\"gradient-text\">UpKnowledge</span>",
      "careers.heroSub": "نبحث دائماً عن المواهب الطموحة لتنضم إلى فريقنا. اكتشف الفرص المتاحة في مجالات الموارد البشرية وتكنولوجيا المعلومات وحلول Odoo، وكن جزءاً من بيئة عمل تحفّز الإبداع والنمو.",
      "careers.stat1": "وظائف متاحة",
      "careers.stat2": "سنوات خبرة",
      "careers.stat3": "بيئة عمل محفّزة",
      "careers.whyTag": "لماذا UpKnowledge",
      "careers.whyTitle": "بيئة عمل تستحق أن تكون جزءاً منها",
      "careers.whyDesc": "نؤمن بأن نجاح شركتنا يبدأ من نجاح موظفينا، لذلك نوفر بيئة عمل داعمة ومحفّزة للتطور.",
      "careers.perk1.title": "نموّ مهني مستمر",
      "careers.perk1.text": "برامج تدريب وتطوير مستمرة تساعدك على تطوير مهاراتك وتحقيق طموحاتك المهنية.",
      "careers.perk2.title": "فريق متعاون",
      "careers.perk2.text": "اعمل ضمن فريق من المحترفين الشغوفين الذين يدعمون بعضهم البعض لتحقيق التميّز.",
      "careers.perk3.title": "توازن الحياة والعمل",
      "careers.perk3.text": "نحرص على توفير مرونة في العمل تتيح لك التوازن بين حياتك المهنية والشخصية.",
      "careers.perk4.title": "مزايا تنافسية",
      "careers.perk4.text": "رواتب ومزايا مجزية تعكس تقديرنا لجهودك ومساهمتك في نجاح الشركة.",
      "careers.jobsTag": "الوظائف المتاحة",
      "careers.jobsTitle": "الفرص الوظيفية الحالية",
      "careers.jobsDesc": "استعرض الوظائف الشاغرة المتاحة حالياً وقدّم على ما يناسب خبراتك ومهاراتك.",
      "careers.ctaTitle": "لم تجد الوظيفة المناسبة؟",
      "careers.ctaText": "نرحّب دائماً بالمواهب المتميّزة. أرسل لنا سيرتك الذاتية وسنتواصل معك عند توفّر فرصة تناسب خبراتك.",
      "careers.ctaBtn": "أرسل سيرتك الذاتية",
      "careers.apply": "قدّم الآن",
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

      "careers.heroBadge": "Join the success journey",
      "careers.heroTitle": "Build your career with <span class=\"gradient-text\">UpKnowledge</span>",
      "careers.heroSub": "We are always looking for ambitious talent to join our team. Discover the opportunities available in human resources, information technology, and Odoo solutions, and be part of a work environment that fosters creativity and growth.",
      "careers.stat1": "Open positions",
      "careers.stat2": "Years of experience",
      "careers.stat3": "Motivating environment",
      "careers.whyTag": "Why UpKnowledge",
      "careers.whyTitle": "A workplace worth being part of",
      "careers.whyDesc": "We believe our company's success starts with our employees' success, so we provide a supportive and motivating work environment for growth.",
      "careers.perk1.title": "Continuous career growth",
      "careers.perk1.text": "Ongoing training and development programs that help you develop your skills and achieve your career ambitions.",
      "careers.perk2.title": "Collaborative team",
      "careers.perk2.text": "Work within a team of passionate professionals who support each other to achieve excellence.",
      "careers.perk3.title": "Work-life balance",
      "careers.perk3.text": "We ensure flexible work that lets you balance your professional and personal life.",
      "careers.perk4.title": "Competitive benefits",
      "careers.perk4.text": "Rewarding salaries and benefits that reflect our appreciation for your efforts and contribution.",
      "careers.jobsTag": "Open Positions",
      "careers.jobsTitle": "Current job opportunities",
      "careers.jobsDesc": "Browse the currently available vacancies and apply for what matches your experience and skills.",
      "careers.ctaTitle": "Didn't find the right job?",
      "careers.ctaText": "We always welcome outstanding talent. Send us your resume and we'll contact you when an opportunity matching your experience becomes available.",
      "careers.ctaBtn": "Send your resume",
      "careers.apply": "Apply Now",
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

    // text content
    doc.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key, lang);
      if (val != null) el.textContent = val;
    });

    // html content (for strings with inline markup)
    doc.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var val = t(key, lang);
      if (val != null) el.innerHTML = val;
    });

    // toggle button label shows the OTHER language
    var btn = doc.getElementById("langToggle");
    if (btn) btn.innerHTML = '<i class="fas fa-globe"></i> ' + (lang === "en" ? "العربية" : "English");

    try { global.localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    // notify other scripts (e.g. jobs renderer) that language changed
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

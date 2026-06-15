/* ===== UpKnowledge - Jobs Data Layer ===== */
/* يدير إعلانات الوظائف عبر localStorage ويعرضها في صفحة الوظائف */
/* Bilingual aware: default jobs carry Arabic + English fields */

(function (global) {
  "use strict";

  var STORAGE_KEY = "upk_jobs";

  function currentLang() {
    try {
      if (global.UpKnowledgeI18n) return global.UpKnowledgeI18n.getLang();
      var saved = global.localStorage.getItem("upk_lang");
      return saved === "en" ? "en" : "ar";
    } catch (e) { return "ar"; }
  }

  // الوظائف الافتراضية تُعرض عند عدم وجود إعلانات منشورة من الأدمن
  // كل وظيفة تحمل النص العربي والإنكليزي
  var DEFAULT_JOBS = [
    {
      id: "default-1",
      icon: "fa-users-gear",
      title: "أخصائي موارد بشرية",
      department: "قسم الموارد البشرية",
      location: "بغداد، العراق",
      type: "دوام كامل",
      desc: "إدارة عمليات التوظيف وإعداد سلم الرواتب وصياغة السياسات الداخلية ومتابعة شؤون الموظفين بكفاءة عالية.",
      tags: ["توظيف", "رواتب", "سياسات داخلية"],
      badge: "الأكثر طلباً",
      en: {
        title: "Human Resources Specialist",
        department: "Human Resources Department",
        location: "Baghdad, Iraq",
        type: "Full-time",
        desc: "Managing recruitment, payroll setup, internal policy development, and efficiently handling employee affairs.",
        tags: ["Recruitment", "Payroll", "Internal Policies"],
        badge: "Most Popular"
      }
    },
    {
      id: "default-2",
      icon: "fa-server",
      title: "مهندس بنية تحتية لتكنولوجيا المعلومات",
      department: "قسم تكنولوجيا المعلومات",
      location: "بغداد، العراق",
      type: "دوام كامل",
      desc: "تصميم وتطوير البنى التحتية التقنية واختيار الأنظمة المناسبة وتقديم الدعم الفني لضمان استمرارية الأعمال.",
      tags: ["بنية تحتية", "شبكات", "دعم فني"],
      badge: "",
      en: {
        title: "IT Infrastructure Engineer",
        department: "Information Technology Department",
        location: "Baghdad, Iraq",
        type: "Full-time",
        desc: "Designing and developing technical infrastructure, selecting suitable systems, and providing technical support to ensure business continuity.",
        tags: ["Infrastructure", "Networks", "Technical Support"],
        badge: ""
      }
    },
    {
      id: "default-3",
      icon: "fa-cubes",
      title: "مستشار تطبيق أنظمة Odoo",
      department: "قسم حلول Odoo",
      location: "بغداد، العراق",
      type: "دوام كامل",
      desc: "تطبيق وتكامل أنظمة Odoo للعملاء، وتقديم التطوير المخصص والتدريب والدعم الفني المستمر لضمان نجاح المشاريع.",
      tags: ["ERP", "Odoo", "تطوير مخصص"],
      badge: "جديد",
      en: {
        title: "Odoo Implementation Consultant",
        department: "Odoo Solutions Department",
        location: "Baghdad, Iraq",
        type: "Full-time",
        desc: "Implementing and integrating Odoo systems for clients, providing custom development, training, and continuous technical support to ensure project success.",
        tags: ["ERP", "Odoo", "Custom Development"],
        badge: "New"
      }
    }
  ];

  /* ----- التخزين ----- */
  function getStoredJobs() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function saveJobs(jobs) {
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }

  // ترجع الوظائف المخزّنة أو الافتراضية إن لم توجد
  function getJobs() {
    var stored = getStoredJobs();
    return stored !== null ? stored : DEFAULT_JOBS.slice();
  }

  function addJob(job) {
    var stored = getStoredJobs();
    var jobs = stored !== null ? stored : [];
    job.id = "job-" + Date.now();
    jobs.unshift(job);
    saveJobs(jobs);
    return jobs;
  }

  function deleteJob(id) {
    var jobs = getJobs().filter(function (j) { return j.id !== id; });
    saveJobs(jobs);
    return jobs;
  }

  function resetJobs() {
    global.localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_JOBS.slice();
  }

  /* ----- اختيار الحقل حسب اللغة ----- */
  // ترجع نسخة من الوظيفة بالحقول المناسبة للغة الحالية
  function localizeJob(job, lang) {
    if (lang === "en" && job.en) {
      return {
        id: job.id,
        icon: job.icon,
        title: job.en.title != null ? job.en.title : job.title,
        department: job.en.department != null ? job.en.department : job.department,
        location: job.en.location != null ? job.en.location : job.location,
        type: job.en.type != null ? job.en.type : job.type,
        desc: job.en.desc != null ? job.en.desc : job.desc,
        tags: job.en.tags != null ? job.en.tags : job.tags,
        badge: job.en.badge != null ? job.en.badge : job.badge
      };
    }
    return job;
  }

  /* ----- أدوات مساعدة ----- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function badgeClass(badge) {
    return (badge === "جديد" || badge === "New") ? "job-badge new" : "job-badge";
  }

  function buildMailto(title) {
    return "mailto:info@upknowledgeco.com?subject=" +
      encodeURIComponent("التقديم على وظيفة " + title);
  }

  function applyLabel(lang) {
    return lang === "en" ? "Apply Now" : "قدّم الآن";
  }

  /* ----- بناء بطاقة وظيفة ----- */
  function jobCardHTML(job, lang) {
    lang = lang || currentLang();
    var j = localizeJob(job, lang);
    var icon = j.icon || "fa-briefcase";
    var tags = (j.tags || []).map(function (t) {
      return "<span>" + esc(t) + "</span>";
    }).join("");
    var badge = j.badge
      ? '<span class="' + badgeClass(j.badge) + '">' + esc(j.badge) + "</span>"
      : "";

    return "" +
      '<article class="job-card">' +
      '<div class="job-main">' +
      '<div class="job-icon"><i class="fas ' + esc(icon) + '"></i></div>' +
      '<div class="job-info">' +
      '<h3 class="job-title">' + esc(j.title) + "</h3>" +
      '<div class="job-meta">' +
      '<span><i class="fas fa-location-dot"></i> ' + esc(j.location) + "</span>" +
      '<span><i class="fas fa-clock"></i> ' + esc(j.type) + "</span>" +
      '<span><i class="fas fa-layer-group"></i> ' + esc(j.department) + "</span>" +
      "</div>" +
      '<p class="job-desc">' + esc(j.desc) + "</p>" +
      '<div class="job-tags">' + tags + "</div>" +
      "</div>" +
      "</div>" +
      '<div class="job-action">' + badge +
      '<a href="' + buildMailto(j.title) + '" class="btn btn-primary">' + esc(applyLabel(lang)) + ' <i class="fas fa-arrow-left"></i></a>' +
      "</div>" +
      "</article>";
  }

  /* ----- عرض الوظائف في صفحة الوظائف ----- */
  var lastContainerId = "jobsList";
  function renderJobs(containerId) {
    lastContainerId = containerId || "jobsList";
    var container = global.document.getElementById(lastContainerId);
    if (!container) return;
    var lang = currentLang();
    var jobs = getJobs();

    if (!jobs.length) {
      var emptyMsg = lang === "en"
        ? "No positions available at the moment. Please check back later."
        : "لا توجد وظائف متاحة حالياً. يرجى المتابعة لاحقاً.";
      container.innerHTML =
        '<div class="jobs-empty"><i class="fas fa-folder-open"></i>' +
        "<p>" + emptyMsg + "</p></div>";
      return;
    }

    container.innerHTML = jobs.map(function (job) {
      return jobCardHTML(job, lang);
    }).join("");

    // تحديث عدّاد الوظائف في قسم الإحصائيات إن وُجد
    var counter = global.document.getElementById("jobsCount");
    if (counter) counter.textContent = jobs.length;
  }

  /* ----- الواجهة العامة ----- */
  global.UpKnowledgeJobs = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_JOBS: DEFAULT_JOBS,
    getJobs: getJobs,
    addJob: addJob,
    deleteJob: deleteJob,
    resetJobs: resetJobs,
    renderJobs: renderJobs,
    jobCardHTML: jobCardHTML,
    esc: esc
  };

  // عرض تلقائي عند تحميل صفحة فيها حاوية الوظائف
  if (global.document) {
    global.document.addEventListener("DOMContentLoaded", function () {
      if (global.document.getElementById("jobsList")) {
        renderJobs("jobsList");
      }
    });

    // إعادة العرض عند تغيير اللغة لتترجم الوظائف الافتراضية
    global.document.addEventListener("upk:langchange", function () {
      if (global.document.getElementById(lastContainerId)) {
        renderJobs(lastContainerId);
      }
    });
  }

})(window);

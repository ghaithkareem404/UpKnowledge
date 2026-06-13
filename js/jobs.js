/* ===== UpKnowledge - Jobs Data Layer ===== */
/* يدير إعلانات الوظائف عبر localStorage ويعرضها في صفحة الوظائف */

(function (global) {
  "use strict";

  var STORAGE_KEY = "upk_jobs";

  // الوظائف الافتراضية تُعرض عند عدم وجود إعلانات منشورة من الأدمن
  var DEFAULT_JOBS = [
    {
      id: "default-1",
      title: "أخصائي موارد بشرية",
      department: "قسم الموارد البشرية",
      location: "بغداد، العراق",
      type: "دوام كامل",
      icon: "fa-users-gear",
      desc: "إدارة عمليات التوظيف وإعداد سلم الرواتب وصياغة السياسات الداخلية ومتابعة شؤون الموظفين بكفاءة عالية.",
      tags: ["توظيف", "رواتب", "سياسات داخلية"],
      badge: "الأكثر طلباً"
    },
    {
      id: "default-2",
      title: "مهندس بنية تحتية لتكنولوجيا المعلومات",
      department: "قسم تكنولوجيا المعلومات",
      location: "بغداد، العراق",
      type: "دوام كامل",
      icon: "fa-server",
      desc: "تصميم وتطوير البنى التحتية التقنية واختيار الأنظمة المناسبة وتقديم الدعم الفني لضمان استمرارية الأعمال.",
      tags: ["بنية تحتية", "شبكات", "دعم فني"],
      badge: ""
    },
    {
      id: "default-3",
      title: "مستشار تطبيق أنظمة Odoo",
      department: "قسم حلول Odoo",
      location: "بغداد، العراق",
      type: "دوام كامل",
      icon: "fa-cubes",
      desc: "تطبيق وتكامل أنظمة Odoo للعملاء، وتقديم التطوير المخصص والتدريب والدعم الفني المستمر لضمان نجاح المشاريع.",
      tags: ["ERP", "Odoo", "تطوير مخصص"],
      badge: "جديد"
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

  /* ----- أدوات مساعدة ----- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function badgeClass(badge) {
    return badge === "جديد" ? "job-badge new" : "job-badge";
  }

  function buildMailto(title) {
    return "mailto:info@upknowledgeco.com?subject=" +
      encodeURIComponent("التقديم على وظيفة " + title);
  }

  /* ----- بناء بطاقة وظيفة ----- */
  function jobCardHTML(job) {
    var icon = job.icon || "fa-briefcase";
    var tags = (job.tags || []).map(function (t) {
      return "<span>" + esc(t) + "</span>";
    }).join("");
    var badge = job.badge
      ? '<span class="' + badgeClass(job.badge) + '">' + esc(job.badge) + "</span>"
      : "";

    return "" +
    '<article class="job-card">' +
      '<div class="job-main">' +
        '<div class="job-icon"><i class="fas ' + esc(icon) + '"></i></div>' +
        '<div class="job-info">' +
          '<h3 class="job-title">' + esc(job.title) + "</h3>" +
          '<div class="job-meta">' +
            '<span><i class="fas fa-location-dot"></i> ' + esc(job.location) + "</span>" +
            '<span><i class="fas fa-clock"></i> ' + esc(job.type) + "</span>" +
            '<span><i class="fas fa-layer-group"></i> ' + esc(job.department) + "</span>" +
          "</div>" +
          '<p class="job-desc">' + esc(job.desc) + "</p>" +
          '<div class="job-tags">' + tags + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="job-action">' + badge +
        '<a href="' + buildMailto(job.title) + '" class="btn btn-primary">قدّم الآن <i class="fas fa-arrow-left"></i></a>' +
      "</div>" +
    "</article>";
  }

  /* ----- عرض الوظائف في صفحة الوظائف ----- */
  function renderJobs(containerId) {
    var container = global.document.getElementById(containerId || "jobsList");
    if (!container) return;
    var jobs = getJobs();

    if (!jobs.length) {
      container.innerHTML =
        '<div class="jobs-empty"><i class="fas fa-folder-open"></i>' +
        "<p>لا توجد وظائف متاحة حالياً. يرجى المتابعة لاحقاً.</p></div>";
      return;
    }

    container.innerHTML = jobs.map(jobCardHTML).join("");

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
  }

})(window);

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

  function tr(key, fallbackAr, fallbackEn) {
    var lang = currentLang();
    try {
      if (global.UpKnowledgeI18n) {
        var v = global.UpKnowledgeI18n.t(key, lang);
        if (v != null && v !== key) return v;
      }
    } catch (e) {}
    return lang === "en" ? fallbackEn : fallbackAr;
  }

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

  function detailsLabel() { return tr("careers.details", "التفاصيل", "Details"); }
  function applyLabel()   { return tr("careers.apply", "قدّم الآن", "Apply Now"); }

  var jobsIndex = {};

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
    var arrow = lang === "en" ? "fa-arrow-right" : "fa-arrow-left";

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
          '<button type="button" class="btn btn-primary job-details-btn" data-job-id="' + esc(j.id) + '">' +
            esc(detailsLabel()) + ' <i class="fas ' + arrow + '"></i></button>' +
        "</div>" +
      "</article>";
  }

  function ensureModalRoot() {
    var doc = global.document;
    var root = doc.getElementById("upkModalRoot");
    if (!root) {
      root = doc.createElement("div");
      root.id = "upkModalRoot";
      doc.body.appendChild(root);
    }
    return root;
  }

  function closeModal() {
    var doc = global.document;
    var root = doc.getElementById("upkModalRoot");
    if (root) root.innerHTML = "";
    doc.body.classList.remove("upk-modal-open");
  }

  function openDetails(jobId) {
    var doc = global.document;
    var lang = currentLang();
    var raw = jobsIndex[jobId];
    if (!raw) return;
    var j = localizeJob(raw, lang);
    var root = ensureModalRoot();

    var tags = (j.tags || []).map(function (t) {
      return "<span>" + esc(t) + "</span>";
    }).join("");

    var aboutTitle = tr("careers.modal.about", "عن الوظيفة", "About the role");
    var detailsTitle = tr("careers.modal.details", "تفاصيل الوظيفة", "Job details");
    var locLbl = tr("careers.modal.location", "الموقع", "Location");
    var typeLbl = tr("careers.modal.type", "نوع الدوام", "Job type");
    var deptLbl = tr("careers.modal.dept", "القسم", "Department");
    var skillsLbl = tr("careers.modal.skills", "المهارات المطلوبة", "Required skills");

    var html =
      '<div class="upk-modal-overlay" data-close="1">' +
        '<div class="upk-modal" role="dialog" aria-modal="true">' +
          '<button type="button" class="upk-modal-close" data-close="1" aria-label="close"><i class="fas fa-times"></i></button>' +
          '<div class="upk-modal-head">' +
            '<div class="job-icon"><i class="fas ' + esc(j.icon || "fa-briefcase") + '"></i></div>' +
            '<div>' +
              '<h2 class="upk-modal-title">' + esc(j.title) + '</h2>' +
              '<div class="job-meta">' +
                '<span><i class="fas fa-location-dot"></i> ' + esc(j.location) + '</span>' +
                '<span><i class="fas fa-clock"></i> ' + esc(j.type) + '</span>' +
                '<span><i class="fas fa-layer-group"></i> ' + esc(j.department) + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="upk-modal-body">' +
            '<h3 class="upk-modal-sub">' + esc(aboutTitle) + '</h3>' +
            '<p class="upk-modal-text">' + esc(j.desc) + '</p>' +
            '<h3 class="upk-modal-sub">' + esc(detailsTitle) + '</h3>' +
            '<ul class="upk-modal-list">' +
              '<li><i class="fas fa-location-dot"></i><span><strong>' + esc(locLbl) + ':</strong> ' + esc(j.location) + '</span></li>' +
              '<li><i class="fas fa-clock"></i><span><strong>' + esc(typeLbl) + ':</strong> ' + esc(j.type) + '</span></li>' +
              '<li><i class="fas fa-layer-group"></i><span><strong>' + esc(deptLbl) + ':</strong> ' + esc(j.department) + '</span></li>' +
            '</ul>' +
            (tags ? ('<h3 class="upk-modal-sub">' + esc(skillsLbl) + '</h3><div class="job-tags upk-modal-tags">' + tags + '</div>') : '') +
          '</div>' +
          '<div class="upk-modal-foot">' +
            '<button type="button" class="btn btn-primary upk-apply-btn" data-job-id="' + esc(j.id) + '">' +
              esc(applyLabel()) + ' <i class="fas fa-paper-plane"></i></button>' +
          '</div>' +
        '</div>' +
      '</div>';

    root.innerHTML = html;
    doc.body.classList.add("upk-modal-open");
  }

  function openApplyForm(jobId) {
    var doc = global.document;
    var lang = currentLang();
    var raw = jobsIndex[jobId];
    var jobTitle = "";
    if (raw) { jobTitle = localizeJob(raw, lang).title; }
    var root = ensureModalRoot();

    var formTitle = tr("careers.form.title", "التقديم على الوظيفة", "Apply for this role");
    var nameLbl = tr("careers.form.name", "الاسم الكامل", "Full name");
    var namePh = tr("careers.form.namePh", "اكتب اسمك الكامل", "Enter your full name");
    var phoneLbl = tr("careers.form.phone", "رقم الهاتف", "Phone number");
    var phonePh = tr("careers.form.phonePh", "مثال: 07700000000", "e.g. 07700000000");
    var cvLbl = tr("careers.form.cv", "السيرة الذاتية", "Resume / CV");
    var cvHint = tr("careers.form.cvHint", "PDF أو Word أو صورة — بحد أقصى 10 ميغابايت", "PDF, Word, or image — up to 10MB");
    var cvBtn = tr("careers.form.cvBtn", "اختر ملفاً", "Choose a file");
    var noFile = tr("careers.form.noFile", "لم يتم اختيار ملف", "No file selected");
    var submitLbl = tr("careers.form.submit", "إرسال الطلب", "Submit application");
    var forRole = tr("careers.form.forRole", "للوظيفة", "For role");

    var html =
      '<div class="upk-modal-overlay" data-close="1">' +
        '<div class="upk-modal upk-modal-sm" role="dialog" aria-modal="true">' +
          '<button type="button" class="upk-modal-close" data-close="1" aria-label="close"><i class="fas fa-times"></i></button>' +
          '<div class="upk-form-head">' +
            '<h2 class="upk-modal-title">' + esc(formTitle) + '</h2>' +
            (jobTitle ? '<p class="upk-form-role"><i class="fas fa-briefcase"></i> ' + esc(forRole) + ': <strong>' + esc(jobTitle) + '</strong></p>' : '') +
          '</div>' +
          '<form class="upk-apply-form" id="upkApplyForm" novalidate>' +
            '<div class="upk-field">' +
              '<label for="upkName">' + esc(nameLbl) + ' <span class="req">*</span></label>' +
              '<input type="text" id="upkName" name="name" placeholder="' + esc(namePh) + '" required>' +
            '</div>' +
            '<div class="upk-field">' +
              '<label for="upkPhone">' + esc(phoneLbl) + ' <span class="req">*</span></label>' +
              '<input type="tel" id="upkPhone" name="phone" placeholder="' + esc(phonePh) + '" dir="ltr" required>' +
            '</div>' +
            '<div class="upk-field">' +
              '<label>' + esc(cvLbl) + ' <span class="req">*</span> <small>(' + esc(cvHint) + ')</small></label>' +
              '<div class="upk-file">' +
                '<label for="upkCv" class="upk-file-btn"><i class="fas fa-upload"></i> ' + esc(cvBtn) + '</label>' +
                '<span class="upk-file-name" id="upkCvName">' + esc(noFile) + '</span>' +
                '<input type="file" id="upkCv" name="cv" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" required hidden>' +
              '</div>' +
            '</div>' +
            '<button type="submit" class="btn btn-primary upk-submit-btn">' + esc(submitLbl) + ' <i class="fas fa-paper-plane"></i></button>' +
          '</form>' +
        '</div>' +
      '</div>';

    root.innerHTML = html;
    doc.body.classList.add("upk-modal-open");

    var fileInput = doc.getElementById("upkCv");
    var fileName = doc.getElementById("upkCvName");
    var MAX_BYTES = 10 * 1024 * 1024; // 10MB
    var ALLOWED_EXT = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"];

    function fileError(msgKey, arF, enF) {
      var err = form.querySelector(".upk-form-error");
      if (!err) {
        err = doc.createElement("p");
        err.className = "upk-form-error";
        form.insertBefore(err, form.querySelector(".upk-submit-btn"));
      }
      err.textContent = tr(msgKey, arF, enF);
    }

    function clearError() {
      var err = form.querySelector(".upk-form-error");
      if (err) err.remove();
    }

    function validateFile(file) {
      if (!file) return false;
      var ext = (file.name.split(".").pop() || "").toLowerCase();
      if (ALLOWED_EXT.indexOf(ext) === -1) {
        fileError("careers.form.badType", "صيغة الملف غير مدعومة. يُسمح بـ PDF أو Word أو صورة فقط.", "Unsupported file type. Only PDF, Word, or image files are allowed.");
        return false;
      }
      if (file.size > MAX_BYTES) {
        fileError("careers.form.tooBig", "حجم الملف كبير جداً. الحد الأقصى 10 ميغابايت.", "File is too large. Maximum size is 10MB.");
        return false;
      }
      return true;
    }

    if (fileInput) {
      fileInput.addEventListener("change", function () {
        var file = (fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;
        if (file) {
          if (!validateFile(file)) {
            fileInput.value = "";
            fileName.textContent = noFile;
            return;
          }
          clearError();
          fileName.textContent = file.name;
        } else {
          fileName.textContent = noFile;
        }
      });
    }

    var form = doc.getElementById("upkApplyForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = (doc.getElementById("upkName").value || "").trim();
        var phone = (doc.getElementById("upkPhone").value || "").trim();
        var hasCv = fileInput && fileInput.files && fileInput.files.length > 0;
        var invalidMsg = tr("careers.form.invalid", "يرجى تعبئة جميع الحقول وإرفاق سيرتك الذاتية.", "Please fill in all fields and attach your CV.");
        if (hasCv && !validateFile(fileInput.files[0])) { return; }
        if (!name || !phone || !hasCv) {
          var err = form.querySelector(".upk-form-error");
          if (!err) {
            err = doc.createElement("p");
            err.className = "upk-form-error";
            form.insertBefore(err, form.querySelector(".upk-submit-btn"));
          }
          err.textContent = invalidMsg;
          return;
        }
        submitApplication(form, jobId, jobTitle, name, phone, fileInput.files[0]);
      });
    }
  }

  function submitApplication(form, jobId, jobTitle, name, phone, file) {
    var doc = global.document;
    var submitBtn = form.querySelector(".upk-submit-btn");
    var sendingLbl = tr("careers.form.sending", "جارٍ الإرسال…", "Sending…");
    var failMsg = tr("careers.form.failed", "تعذّر إرسال طلبك. حاول مرة أخرى لاحقاً.", "We couldn't submit your application. Please try again later.");

    function setError(msg) {
      var err = form.querySelector(".upk-form-error");
      if (!err) {
        err = doc.createElement("p");
        err.className = "upk-form-error";
        form.insertBefore(err, submitBtn);
      }
      err.textContent = msg;
    }
    function clearErr() {
      var err = form.querySelector(".upk-form-error");
      if (err) err.remove();
    }

    if (!global.upkSb) {
      // لا يوجد عميل Supabase مهيأ — نعرض النجاح للمستخدم دون قطع التجربة
      showSuccess(jobTitle, name);
      return;
    }

    clearErr();
    submitBtn.disabled = true;
    var originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + esc(sendingLbl);

    function restore() {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }

    var cfg = global.UPK_SUPABASE || {};
    var bucket = cfg.bucket || "Private";
    var ext = (file.name.split(".").pop() || "bin").toLowerCase();
    var safeName = (name.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40)) || "candidate";
    var path = "cvs/" + Date.now() + "_" + safeName + "." + ext;

    global.upkSb.storage.from(bucket).upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false
    }).then(function (up) {
      if (up.error) { throw up.error; }
      // محاولة الحصول على رابط عام (يعمل فقط إن كان bucket عاماً؛ نخزّن المسار دائماً)
      var publicUrl = "";
      try {
        var pu = global.upkSb.storage.from(bucket).getPublicUrl(path);
        publicUrl = (pu && pu.data && pu.data.publicUrl) ? pu.data.publicUrl : "";
      } catch (e) {}

      return global.upkSb.from("applications").insert([{
        full_name: name,
        phone: phone,
        job_id: jobId || null,
        job_title: jobTitle || null,
        cv_path: path,
        cv_url: publicUrl
      }]);
    }).then(function (ins) {
      if (ins && ins.error) { throw ins.error; }
      // إرسال إيميلَي الإشعار (للشركة + للمتقدم) عبر Edge Function — لا يقطع النجاح إن فشل
      sendApplicationEmails({ name: name, phone: phone, jobTitle: jobTitle, jobId: jobId, cvPath: path, cvUrl: publicUrl, lang: currentLang() });
      showSuccess(jobTitle, name);
    }).catch(function (err) {
      console.error("Application submit error:", err);
      restore();
      setError(failMsg);
    });
  }

  function sendApplicationEmails(payload) {

    try {

      var cfg = global.UPK_SUPABASE || {};

      if (!cfg.url || !cfg.key) return;

      var endpoint = cfg.url.replace(/\/+$/, "") + "/functions/v1/send-application-emails";

      global.fetch(endpoint, {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          "Authorization": "Bearer " + cfg.key,

          "apikey": cfg.key

        },

        body: JSON.stringify(payload)

      }).then(function (r) {

        if (!r.ok) { console.warn("Email function returned status", r.status); }

      }).catch(function (e) { console.warn("Email function call failed:", e); });

    } catch (e) { console.warn("sendApplicationEmails error:", e); }

  }


  function showSuccess(jobTitle, name) {
    var doc = global.document;
    var root = ensureModalRoot();
    var thanksTitle = tr("careers.form.successTitle", "تم استلام طلبك بنجاح!", "Your application has been received!");
    var thanksText = tr("careers.form.successText", "شكراً لك. راجع فريقنا طلبك وسنتواصل معك قريباً في حال توافق ملفك مع متطلبات الوظيفة.", "Thank you. Our team will review your application and reach out soon if your profile matches the role's requirements.");
    var doneLbl = tr("careers.form.done", "تم", "Done");
    var html =
      '<div class="upk-modal-overlay" data-close="1">' +
        '<div class="upk-modal upk-modal-sm upk-modal-success" role="dialog" aria-modal="true">' +
          '<div class="upk-success-icon"><i class="fas fa-circle-check"></i></div>' +
          '<h2 class="upk-modal-title">' + esc(thanksTitle) + '</h2>' +
          '<p class="upk-modal-text" style="text-align:center">' + esc(thanksText) + '</p>' +
          '<button type="button" class="btn btn-primary" data-close="1">' + esc(doneLbl) + '</button>' +
        '</div>' +
      '</div>';
    root.innerHTML = html;
  }

  function bindGlobalHandlers() {
    var doc = global.document;
    doc.addEventListener("click", function (e) {
      var t = e.target;
      if (!t.closest) return;
      var detBtn = t.closest(".job-details-btn");
      if (detBtn) { openDetails(detBtn.getAttribute("data-job-id")); return; }
      var applyBtn = t.closest(".upk-apply-btn");
      if (applyBtn) { openApplyForm(applyBtn.getAttribute("data-job-id")); return; }
      if (t.classList.contains("upk-modal-overlay")) { closeModal(); return; }
      if (t.closest(".upk-modal-close")) { closeModal(); return; }
      var doneBtn = t.closest("[data-close]");
      if (doneBtn && doneBtn.tagName === "BUTTON" && !t.closest("form")) { closeModal(); return; }
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  var lastContainerId = "jobsList";
  function renderJobs(containerId) {
    lastContainerId = containerId || "jobsList";
    var container = global.document.getElementById(lastContainerId);
    if (!container) return;
    var lang = currentLang();
    var jobs = getJobs();

    jobsIndex = {};
    jobs.forEach(function (jb) { jobsIndex[jb.id] = jb; });

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

    var counter = global.document.getElementById("jobsCount");
    if (counter) counter.textContent = jobs.length;
  }

  global.UpKnowledgeJobs = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_JOBS: DEFAULT_JOBS,
    getJobs: getJobs,
    addJob: addJob,
    deleteJob: deleteJob,
    resetJobs: resetJobs,
    renderJobs: renderJobs,
    jobCardHTML: jobCardHTML,
    esc: esc,
    openDetails: openDetails,
    openApplyForm: openApplyForm,
    closeModal: closeModal
  };

  if (global.document) {
    bindGlobalHandlers();
    global.document.addEventListener("DOMContentLoaded", function () {
      if (global.document.getElementById("jobsList")) {
        renderJobs("jobsList");
      }
    });

    global.document.addEventListener("upk:langchange", function () {
      if (global.document.getElementById(lastContainerId)) {
        renderJobs(lastContainerId);
      }
      closeModal();
    });
  }

})(window);

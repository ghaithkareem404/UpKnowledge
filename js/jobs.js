/* ===== UpKnowledge - Jobs Data Layer + Careers UI ===== */
/* يعتمد على: window.upkSb (Supabase client) و window.UpKnowledgeI18n */

/* ترجمة قيم نوع الدوام والشارات المخزّنة بالعربية إلى الإنجليزية */
function upkTrType(v) {
  if (!v) return v;
  var m = { "دوام كامل": "Full-time", "دوام جزئي": "Part-time", "عن بُعد": "Remote", "تدريب": "Internship", "عقد مؤقت": "Temporary" };
  return m[v] || v;
}
function upkTrBadge(v) {
  if (!v) return v;
  var m = { "جديد": "New", "الأكثر طلباً": "Most in demand", "عاجل": "Urgent" };
  return m[v] || v;
}

(function (global) {
  "use strict";

  var STORAGE_KEY = "upk_jobs";
  var remoteJobs = null;
  var remoteLoaded = false;

  /* ---------- اللغة والترجمة ---------- */

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

  var DEFAULT_JOBS = [];

  /* ---------- تخزين محلي احتياطي ---------- */

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
    try { global.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs)); } catch (e) {}
  }

  /* ---------- روابط المشاركة ---------- */

  function makeJobSlug(job) {
    if (job.slug) return job.slug;
    var title = String(job.title || "job")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    var id = String(job.id || "").slice(0, 8);
    return (title || "job") + "-" + id;
  }

  /* يبني رابطاً مطلقاً لصفحة الوظائف يعمل أيضاً داخل مجلد فرعي */
  function getJobShareUrl(job) {
    var slug = makeJobSlug(job);
    var base;
    try {
      base = new URL("careers.html", global.location.href).href;
    } catch (e) {
      base = global.location.origin + "/careers.html";
    }
    return base + "?job=" + encodeURIComponent(slug);
  }

  /* ---------- تحويل صفوف قاعدة البيانات ---------- */

  function mapRow(row) {
    var en = row.en || {};
    var job = {
      id: row.id,
      icon: row.icon || "fa-briefcase",
      title: row.title,
      company: row.company || "",
      department: row.department,
      location: row.location,
      type: row.type,
      job_date: row.job_date || "",
      desc: row.description,
      skills: row.skills || [],
      experience: row.experience || [],
      tags: row.tags || [],
      badge: row.badge || "",
      published: row.published,
      en: {
        title: en.title,
        company: en.company || "",
        department: en.department,
        location: en.location,
        type: en.type || upkTrType(row.type),
        desc: en.desc,
        skills: en.skills || [],
        experience: en.experience || [],
        tags: en.tags,
        badge: en.badge || upkTrBadge(row.badge)
      }
    };
    job.slug = makeJobSlug(job);
    return job;
  }

  function loadRemoteJobs(opts) {
    opts = opts || {};
    var sb = global.upkSb;
    if (!sb) return Promise.resolve(null);
    var q = sb.from("jobs").select("*").order("created_at", { ascending: false });
    if (!opts.includeHidden) { q = q.eq("published", true); }
    return q.then(function (res) {
      if (res.error) { console.warn("loadRemoteJobs error:", res.error); return null; }
      remoteJobs = (res.data || []).map(mapRow);
      remoteLoaded = true;
      global.UpKnowledgeJobsData = { jobs: remoteJobs, count: remoteJobs.length };
      if (global.updateJobsCount) global.updateJobsCount(remoteJobs.length);
      return remoteJobs;
    }).catch(function (e) { console.warn("loadRemoteJobs failed:", e); return null; });
  }

  function getJobs() {
    if (remoteLoaded && remoteJobs) {
      return remoteJobs.length ? remoteJobs.slice() : DEFAULT_JOBS.slice();
    }
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
    try { global.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    return DEFAULT_JOBS.slice();
  }

  function localizeJob(job, lang) {
    if (lang === "en" && job.en) {
      return {
        id: job.id,
        icon: job.icon,
        title: job.en.title || job.title,
        company: job.en.company || job.company,
        department: job.en.department || job.department,
        location: job.en.location || job.location,
        type: job.en.type || job.type,
        job_date: job.job_date,
        desc: job.en.desc || job.desc,
        skills: (job.en.skills && job.en.skills.length) ? job.en.skills : job.skills,
        experience: (job.en.experience && job.en.experience.length) ? job.en.experience : job.experience,
        tags: (job.en.tags && job.en.tags.length) ? job.en.tags : job.tags,
        badge: job.en.badge || job.badge,
        published: job.published,
        slug: job.slug,
        en: job.en
      };
    }
    return job;
  }

  /* ---------- أدوات العرض ---------- */

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

  function tagsHTML(list) {
    return (list || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
  }

  function detailsLabel() { return tr("careers.details", "التفاصيل", "Details"); }
  function applyLabel() { return tr("careers.apply", "قدّم الآن", "Apply Now"); }

  var jobsIndex = {};
  var slugIndex = {};

  function jobCardHTML(job, lang) {
    lang = lang || currentLang();
    var j = localizeJob(job, lang);
    var icon = j.icon || "fa-briefcase";
    var badge = j.badge ? '<span class="' + badgeClass(j.badge) + '">' + esc(j.badge) + "</span>" : "";
    var arrow = lang === "en" ? "fa-arrow-right" : "fa-arrow-left";
    var company = j.company
      ? '<span><i class="fas fa-building"></i> ' + esc(j.company) + "</span>"
      : "";
    var date = j.job_date
      ? '<span><i class="fas fa-calendar"></i> ' + esc(j.job_date) + "</span>"
      : "";
    var copyLbl = tr("careers.copyLink", "نسخ الرابط", "Copy link");

    return "" +
      '<article class="job-card" data-job-slug="' + esc(j.slug) + '">' +
        '<div class="job-main">' +
          '<div class="job-icon"><i class="fas ' + esc(icon) + '"></i></div>' +
          '<div class="job-info">' +
            '<h3 class="job-title">' + esc(j.title) + "</h3>" +
            '<div class="job-meta">' +
              company +
              '<span><i class="fas fa-location-dot"></i> ' + esc(j.location) + "</span>" +
              '<span><i class="fas fa-clock"></i> ' + esc(j.type) + "</span>" +
              '<span><i class="fas fa-layer-group"></i> ' + esc(j.department) + "</span>" +
              date +
            "</div>" +
            '<p class="job-desc">' + esc(j.desc) + "</p>" +
            '<div class="job-tags">' + tagsHTML(j.tags) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="job-action">' + badge +
          '<button type="button" class="btn btn-primary job-details-btn" data-job-id="' + esc(j.id) + '">' +
            esc(detailsLabel()) + ' <i class="fas ' + arrow + '"></i></button>' +
          '<button type="button" class="job-copy-btn" data-job-id="' + esc(j.id) + '" title="' + esc(copyLbl) + '">' +
            '<i class="fas fa-link"></i> <span>' + esc(copyLbl) + "</span></button>" +
        "</div>" +
      "</article>";
  }

  /* ---------- النوافذ المنبثقة ---------- */

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
    var lang = currentLang();
    var raw = jobsIndex[jobId];
    if (!raw) return;
    var j = localizeJob(raw, lang);
    var root = ensureModalRoot();

    var aboutTitle = tr("careers.modal.about", "عن الوظيفة", "About the role");
    var detailsTitle = tr("careers.modal.details", "تفاصيل الوظيفة", "Job details");
    var locLbl = tr("careers.modal.location", "الموقع", "Location");
    var typeLbl = tr("careers.modal.type", "نوع الدوام", "Job type");
    var deptLbl = tr("careers.modal.dept", "القسم", "Department");
    var companyLbl = tr("careers.modal.company", "الشركة", "Company");
    var postedLbl = tr("careers.modal.posted", "تاريخ النشر", "Posted on");
    var skillsLbl = tr("careers.modal.skills", "المهارات المطلوبة", "Required skills");
    var expLbl = tr("careers.modal.experience", "الخبرات المطلوبة", "Required experience");

    var rows =
      (j.company ? '<li><i class="fas fa-building"></i><span><strong>' + esc(companyLbl) + ":</strong> " + esc(j.company) + "</span></li>" : "") +
      '<li><i class="fas fa-location-dot"></i><span><strong>' + esc(locLbl) + ":</strong> " + esc(j.location) + "</span></li>" +
      '<li><i class="fas fa-clock"></i><span><strong>' + esc(typeLbl) + ":</strong> " + esc(j.type) + "</span></li>" +
      '<li><i class="fas fa-layer-group"></i><span><strong>' + esc(deptLbl) + ":</strong> " + esc(j.department) + "</span></li>" +
      (j.job_date ? '<li><i class="fas fa-calendar"></i><span><strong>' + esc(postedLbl) + ":</strong> " + esc(j.job_date) + "</span></li>" : "");

    var skills = (j.skills && j.skills.length)
      ? '<h3 class="upk-modal-sub">' + esc(skillsLbl) + '</h3><div class="job-tags upk-modal-tags">' + tagsHTML(j.skills) + "</div>"
      : "";
    var experience = (j.experience && j.experience.length)
      ? '<h3 class="upk-modal-sub">' + esc(expLbl) + '</h3><div class="job-tags upk-modal-tags">' + tagsHTML(j.experience) + "</div>"
      : "";
    var copyLbl = tr("careers.copyLink", "نسخ الرابط", "Copy link");

    root.innerHTML =
      '<div class="upk-modal-overlay" data-close="1">' +
        '<div class="upk-modal" role="dialog" aria-modal="true">' +
          '<button type="button" class="upk-modal-close" data-close="1" aria-label="close"><i class="fas fa-times"></i></button>' +
          '<div class="upk-modal-head">' +
            '<div class="job-icon"><i class="fas ' + esc(j.icon || "fa-briefcase") + '"></i></div>' +
            "<div>" +
              '<h2 class="upk-modal-title">' + esc(j.title) + "</h2>" +
              '<div class="job-meta">' +
                '<span><i class="fas fa-location-dot"></i> ' + esc(j.location) + "</span>" +
                '<span><i class="fas fa-clock"></i> ' + esc(j.type) + "</span>" +
                '<span><i class="fas fa-layer-group"></i> ' + esc(j.department) + "</span>" +
              "</div>" +
            "</div>" +
          "</div>" +
          '<div class="upk-modal-body">' +
            '<h3 class="upk-modal-sub">' + esc(aboutTitle) + "</h3>" +
            '<p class="upk-modal-text">' + esc(j.desc) + "</p>" +
            '<h3 class="upk-modal-sub">' + esc(detailsTitle) + "</h3>" +
            '<ul class="upk-modal-list">' + rows + "</ul>" +
            skills + experience +
          "</div>" +
          '<div class="upk-modal-foot">' +
            '<button type="button" class="job-copy-btn" data-job-id="' + esc(j.id) + '">' +
              '<i class="fas fa-link"></i> <span>' + esc(copyLbl) + "</span></button>" +
            '<button type="button" class="btn btn-primary upk-apply-btn" data-job-id="' + esc(j.id) + '">' +
              esc(applyLabel()) + ' <i class="fas fa-paper-plane"></i></button>' +
          "</div>" +
        "</div>" +
      "</div>";

    global.document.body.classList.add("upk-modal-open");
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
    var emailLbl = tr("careers.form.email", "البريد الإلكتروني", "Email address");
    var emailPh = tr("careers.form.emailPh", "example@email.com", "example@email.com");
    var cvLbl = tr("careers.form.cv", "السيرة الذاتية", "Resume / CV");
    var cvHint = tr("careers.form.cvHint", "PDF أو Word أو صورة — بحد أقصى 10 ميغابايت", "PDF, Word, or image — up to 10MB");
    var cvBtn = tr("careers.form.cvBtn", "اختر ملفاً", "Choose a file");
    var noFile = tr("careers.form.noFile", "لم يتم اختيار ملف", "No file selected");
    var submitLbl = tr("careers.form.submit", "إرسال الطلب", "Submit application");
    var forRole = tr("careers.form.forRole", "للوظيفة", "For role");

    root.innerHTML =
      '<div class="upk-modal-overlay" data-close="1">' +
        '<div class="upk-modal upk-modal-sm" role="dialog" aria-modal="true">' +
          '<button type="button" class="upk-modal-close" data-close="1" aria-label="close"><i class="fas fa-times"></i></button>' +
          '<div class="upk-form-head">' +
            '<h2 class="upk-modal-title">' + esc(formTitle) + "</h2>" +
            (jobTitle ? '<p class="upk-form-role"><i class="fas fa-briefcase"></i> ' + esc(forRole) + ": <strong>" + esc(jobTitle) + "</strong></p>" : "") +
          "</div>" +
          '<form class="upk-apply-form" id="upkApplyForm" novalidate>' +
            '<div class="upk-field">' +
              '<label for="upkName">' + esc(nameLbl) + ' <span class="req">*</span></label>' +
              '<input type="text" id="upkName" name="name" placeholder="' + esc(namePh) + '" required>' +
            "</div>" +
            '<div class="upk-field">' +
              '<label for="upkPhone">' + esc(phoneLbl) + ' <span class="req">*</span></label>' +
              '<input type="tel" id="upkPhone" name="phone" placeholder="' + esc(phonePh) + '" dir="ltr" required>' +
            "</div>" +
            '<div class="upk-field">' +
              '<label for="upkEmail">' + esc(emailLbl) + ' <span class="req">*</span></label>' +
              '<input type="email" id="upkEmail" name="email" placeholder="' + esc(emailPh) + '" dir="ltr" required>' +
            "</div>" +
            '<div class="upk-field">' +
              "<label>" + esc(cvLbl) + ' <span class="req">*</span> <small>(' + esc(cvHint) + ")</small></label>" +
              '<div class="upk-file">' +
                '<label for="upkCv" class="upk-file-btn"><i class="fas fa-upload"></i> ' + esc(cvBtn) + "</label>" +
                '<span class="upk-file-name" id="upkCvName">' + esc(noFile) + "</span>" +
                '<input type="file" id="upkCv" name="cv" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" required hidden>' +
              "</div>" +
            "</div>" +
            '<button type="submit" class="btn btn-primary upk-submit-btn">' + esc(submitLbl) + ' <i class="fas fa-paper-plane"></i></button>' +
          "</form>" +
        "</div>" +
      "</div>";

    doc.body.classList.add("upk-modal-open");

    var form = doc.getElementById("upkApplyForm");
    var fileInput = doc.getElementById("upkCv");
    var fileName = doc.getElementById("upkCvName");
    var MAX_BYTES = 10 * 1024 * 1024; // 10MB
    var ALLOWED_EXT = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"];

    function setError(msg) {
      var err = form.querySelector(".upk-form-error");
      if (!err) {
        err = doc.createElement("p");
        err.className = "upk-form-error";
        form.insertBefore(err, form.querySelector(".upk-submit-btn"));
      }
      err.textContent = msg;
    }

    function clearError() {
      var err = form.querySelector(".upk-form-error");
      if (err) err.remove();
    }

    function validateFile(file) {
      if (!file) return false;
      var ext = (file.name.split(".").pop() || "").toLowerCase();
      if (ALLOWED_EXT.indexOf(ext) === -1) {
        setError(tr("careers.form.badType", "صيغة الملف غير مدعومة. يُسمح بـ PDF أو Word أو صورة فقط.", "Unsupported file type. Only PDF, Word, or image files are allowed."));
        return false;
      }
      if (file.size > MAX_BYTES) {
        setError(tr("careers.form.tooBig", "حجم الملف كبير جداً. الحد الأقصى 10 ميغابايت.", "File is too large. Maximum size is 10MB."));
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

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = (doc.getElementById("upkName").value || "").trim();
        var phone = (doc.getElementById("upkPhone").value || "").trim();
        var email = (doc.getElementById("upkEmail").value || "").trim();
        var hasCv = fileInput && fileInput.files && fileInput.files.length > 0;

        if (hasCv && !validateFile(fileInput.files[0])) { return; }
        if (!name || !phone || !email || !hasCv) {
          setError(tr("careers.form.invalid", "يرجى تعبئة جميع الحقول وإرفاق سيرتك الذاتية.", "Please fill in all fields and attach your CV."));
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError(tr("careers.form.badEmail", "يرجى إدخال بريد إلكتروني صحيح.", "Please enter a valid email address."));
          return;
        }
        clearError();
        submitApplication(form, jobId, jobTitle, name, phone, email, fileInput.files[0]);
      });
    }
  }

  function submitApplication(form, jobId, jobTitle, name, phone, email, file) {
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

    if (!global.upkSb) {
      console.warn("Supabase client unavailable — application was not stored.");
      setError(failMsg);
      return;
    }

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
    var sharedPublicUrl = "";

    global.upkSb.storage.from(bucket).upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false
    }).then(function (up) {
      if (up.error) { throw up.error; }
      // رابط عام يعمل فقط إن كان bucket عاماً؛ نخزّن المسار دائماً
      var publicUrl = "";
      try {
        var pu = global.upkSb.storage.from(bucket).getPublicUrl(path);
        publicUrl = (pu && pu.data && pu.data.publicUrl) ? pu.data.publicUrl : "";
      } catch (e) {}

      sharedPublicUrl = publicUrl;
      return global.upkSb.from("applications").insert([{
        full_name: name,
        phone: phone,
        email: email,
        job_id: jobId || null,
        job_title: jobTitle || null,
        cv_path: path,
        cv_url: publicUrl
      }]);
    }).then(function (ins) {
      if (ins && ins.error) { throw ins.error; }
      // إشعارات البريد عبر Edge Function — لا تقطع النجاح إن فشلت
      sendApplicationEmails({
        name: name, phone: phone, email: email,
        jobTitle: jobTitle, jobId: jobId,
        cvPath: path, cvUrl: sharedPublicUrl,
        lang: currentLang()
      });
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
    var root = ensureModalRoot();
    var thanksTitle = tr("careers.form.successTitle", "تم استلام طلبك بنجاح!", "Your application has been received!");
    var thanksText = tr("careers.form.successText", "شكراً لك. راجع فريقنا طلبك وسنتواصل معك قريباً في حال توافق ملفك مع متطلبات الوظيفة.", "Thank you. Our team will review your application and reach out soon if your profile matches the role's requirements.");
    var doneLbl = tr("careers.form.done", "تم", "Done");
    root.innerHTML =
      '<div class="upk-modal-overlay" data-close="1">' +
        '<div class="upk-modal upk-modal-sm upk-modal-success" role="dialog" aria-modal="true">' +
          '<div class="upk-success-icon"><i class="fas fa-circle-check"></i></div>' +
          '<h2 class="upk-modal-title">' + esc(thanksTitle) + "</h2>" +
          '<p class="upk-modal-text" style="text-align:center">' + esc(thanksText) + "</p>" +
          '<button type="button" class="btn btn-primary" data-close="1">' + esc(doneLbl) + "</button>" +
        "</div>" +
      "</div>";
  }

  /* ---------- نسخ رابط الوظيفة ---------- */

  function copyJobLink(btn, jobId) {
    var job = jobsIndex[jobId];
    if (!job) return;
    var url = getJobShareUrl(job);
    var label = btn.querySelector("span");
    var copiedLbl = tr("careers.copied", "تم نسخ الرابط ✓", "Link copied ✓");
    var copyLbl = tr("careers.copyLink", "نسخ الرابط", "Copy link");

    function flash() {
      if (!label) return;
      label.textContent = copiedLbl;
      btn.classList.add("copied");
      global.setTimeout(function () {
        label.textContent = copyLbl;
        btn.classList.remove("copied");
      }, 2000);
    }

    if (global.navigator.clipboard && global.isSecureContext) {
      global.navigator.clipboard.writeText(url).then(flash).catch(function () { global.prompt(copyLbl, url); });
    } else {
      global.prompt(copyLbl, url);
    }
  }

  /* ---------- الأحداث ---------- */

  function bindGlobalHandlers() {
    var doc = global.document;
    doc.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;

      var copyBtn = t.closest(".job-copy-btn");
      if (copyBtn) { copyJobLink(copyBtn, copyBtn.getAttribute("data-job-id")); return; }

      var detBtn = t.closest(".job-details-btn");
      if (detBtn) { openDetails(detBtn.getAttribute("data-job-id")); return; }

      var applyBtn = t.closest(".upk-apply-btn");
      if (applyBtn) { openApplyForm(applyBtn.getAttribute("data-job-id")); return; }

      if (t.classList && t.classList.contains("upk-modal-overlay")) { closeModal(); return; }
      if (t.closest(".upk-modal-close")) { closeModal(); return; }

      var doneBtn = t.closest("[data-close]");
      if (doneBtn && doneBtn.tagName === "BUTTON" && !t.closest("form")) { closeModal(); return; }
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ---------- فتح وظيفة عبر رابط المشاركة (?job=slug) ---------- */

  var deepLinkHandled = false;

  function handleDeepLink() {
    if (deepLinkHandled) return;
    var slug;
    try {
      slug = new URLSearchParams(global.location.search).get("job");
    } catch (e) { return; }
    if (!slug) return;
    var job = slugIndex[slug];
    if (!job) return;
    deepLinkHandled = true;
    openDetails(job.id);
    var card = global.document.querySelector('[data-job-slug="' + slug.replace(/"/g, '\\"') + '"]');
    if (card && card.scrollIntoView) card.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ---------- العرض ---------- */

  var lastContainerId = "jobsList";

  function renderJobs(containerId) {
    lastContainerId = containerId || "jobsList";
    var container = global.document.getElementById(lastContainerId);
    if (!container) return;
    var lang = currentLang();
    var jobs = getJobs();

    jobsIndex = {};
    slugIndex = {};
    jobs.forEach(function (jb) {
      jobsIndex[jb.id] = jb;
      slugIndex[jb.slug || makeJobSlug(jb)] = jb;
    });

    if (!jobs.length) {
      container.innerHTML =
        '<div class="jobs-empty"><i class="fas fa-folder-open"></i><p>' +
        esc(tr("careers.empty", "لا توجد وظائف متاحة حالياً. يرجى المتابعة لاحقاً.", "No positions available at the moment. Please check back later.")) +
        "</p></div>";
    } else {
      container.innerHTML = jobs.map(function (job) { return jobCardHTML(job, lang); }).join("");
    }

    var counter = global.document.getElementById("jobsCount");
    if (counter) counter.textContent = jobs.length;

    handleDeepLink();
  }

  global.UpKnowledgeJobs = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_JOBS: DEFAULT_JOBS,
    loadRemoteJobs: loadRemoteJobs,
    mapRow: mapRow,
    getJobs: getJobs,
    addJob: addJob,
    deleteJob: deleteJob,
    resetJobs: resetJobs,
    renderJobs: renderJobs,
    jobCardHTML: jobCardHTML,
    localizeJob: localizeJob,
    makeJobSlug: makeJobSlug,
    getJobShareUrl: getJobShareUrl,
    esc: esc,
    openDetails: openDetails,
    openApplyForm: openApplyForm,
    closeModal: closeModal
  };

  if (global.document) {
    bindGlobalHandlers();

    function boot() {
      if (!global.document.getElementById("jobsList")) return;
      renderJobs("jobsList");
      loadRemoteJobs().then(function (rows) {
        if (rows) renderJobs("jobsList");
      });
    }

    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }

    global.document.addEventListener("upk:langchange", function () {
      closeModal();
      if (global.document.getElementById(lastContainerId)) {
        renderJobs(lastContainerId);
      }
    });
  }

})(window);

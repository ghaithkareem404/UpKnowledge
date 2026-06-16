/* ===== UpKnowledge - Admin Dashboard Logic (Supabase + Auth) ===== */
/* يعتمد على js/jobs.js (window.UpKnowledgeJobs) و window.upkSb (Supabase client) */

(function () {
  "use strict";

  var API = window.UpKnowledgeJobs;
  var sb = window.upkSb;

  var authOverlay = document.getElementById("authOverlay");
  var adminApp = document.getElementById("adminApp");
  var loginForm = document.getElementById("loginForm");
  var authMsg = document.getElementById("authMsg");
  var logoutBtn = document.getElementById("logoutBtn");

  var form = document.getElementById("jobForm");
  var listEl = document.getElementById("adminJobsList");
  var countBadge = document.getElementById("countBadge");
  var formMsg = document.getElementById("formMsg");
  var submitBtn = document.getElementById("submitJobBtn");
  var cancelEditBtn = document.getElementById("cancelEditBtn");
  var formHeading = document.getElementById("formHeading");

  function esc(s) { return API ? API.esc(s) : String(s == null ? "" : s); }

  function showMsg(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = "form-msg show " + (type || "success");
    window.setTimeout(function () { el.className = "form-msg"; }, 3500);
  }

  /* ---------- المصادقة ---------- */
  function showApp() {
    if (authOverlay) authOverlay.hidden = true;
    if (adminApp) adminApp.hidden = false;
    renderAdminList();
  }
  function showLogin() {
    if (adminApp) adminApp.hidden = true;
    if (authOverlay) authOverlay.hidden = false;
  }

  function checkSession() {
    if (!sb) { showMsg(authMsg, "تعذّر الاتصال بالخادم.", "error"); showLogin(); return; }
    sb.auth.getSession().then(function (res) {
      if (res && res.data && res.data.session) { showApp(); }
      else { showLogin(); }
    }).catch(function () { showLogin(); });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (document.getElementById("authEmail").value || "").trim();
      var password = document.getElementById("authPassword").value || "";
      if (!email || !password) { showMsg(authMsg, "يرجى إدخال البريد وكلمة المرور.", "error"); return; }
      var btn = document.getElementById("loginBtn");
      if (btn) { btn.disabled = true; }
      sb.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
        if (btn) { btn.disabled = false; }
        if (res.error) { showMsg(authMsg, "بيانات الدخول غير صحيحة.", "error"); return; }
        document.getElementById("authPassword").value = "";
        showApp();
      }).catch(function () {
        if (btn) { btn.disabled = false; }
        showMsg(authMsg, "تعذّر تسجيل الدخول. حاول لاحقاً.", "error");
      });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (!sb) return;
      sb.auth.signOut().then(function () { showLogin(); });
    });
  }

  /* ---------- جلب وعرض الوظائف (بما فيها المخفيّ) ---------- */
  var currentRows = [];

  function renderAdminList() {
    if (!sb || !listEl) return;
    listEl.innerHTML = '<div class="admin-empty"><i class="fas fa-spinner fa-spin"></i><p>جارٍ التحميل…</p></div>';
    sb.from("jobs").select("*").order("created_at", { ascending: false }).then(function (res) {
      if (res.error) {
        listEl.innerHTML = '<div class="admin-empty"><i class="fas fa-triangle-exclamation"></i><p>تعذّر جلب الوظائف.</p></div>';
        return;
      }
      currentRows = res.data || [];
      if (countBadge) countBadge.textContent = currentRows.length;
      if (!currentRows.length) {
        listEl.innerHTML = '<div class="admin-empty"><i class="fas fa-inbox"></i><p>لا توجد إعلانات. أضف وظيفة جديدة من النموذج.</p></div>';
        return;
      }
      listEl.innerHTML = currentRows.map(rowHTML).join("");
    });
  }

  function rowHTML(job) {
    var hidden = job.published === false;
    var badge = job.badge ? '<span class="admin-job-badge">' + esc(job.badge) + "</span>" : "";
    var statusBadge = hidden
      ? '<span class="admin-status hidden"><i class="fas fa-eye-slash"></i> مخفية</span>'
      : '<span class="admin-status live"><i class="fas fa-circle-check"></i> منشورة</span>';
    return "" +
      '<div class="admin-job-item' + (hidden ? " is-hidden" : "") + '" data-id="' + esc(job.id) + '">' +
        '<div class="admin-job-icon"><i class="fas ' + esc(job.icon || "fa-briefcase") + '"></i></div>' +
        '<div class="admin-job-body">' +
          '<div class="admin-job-top"><h3>' + esc(job.title) + "</h3>" + badge + statusBadge + "</div>" +
          '<div class="admin-job-meta">' +
            '<span><i class="fas fa-layer-group"></i> ' + esc(job.department) + "</span>" +
            '<span><i class="fas fa-location-dot"></i> ' + esc(job.location) + "</span>" +
            '<span><i class="fas fa-clock"></i> ' + esc(job.type) + "</span>" +
          "</div>" +
        "</div>" +
        '<div class="admin-job-actions">' +
          '<button class="admin-icon-btn toggle-btn" data-id="' + esc(job.id) + '" title="' + (hidden ? "نشر" : "إخفاء") + '"><i class="fas ' + (hidden ? "fa-eye" : "fa-eye-slash") + '"></i></button>' +
          '<button class="admin-icon-btn edit-btn" data-id="' + esc(job.id) + '" title="تعديل"><i class="fas fa-pen"></i></button>' +
          '<button class="admin-icon-btn admin-del-btn" data-id="' + esc(job.id) + '" title="حذف"><i class="fas fa-trash-can"></i></button>' +
        "</div>" +
      "</div>";
  }

  /* ---------- بناء صف من النموذج ---------- */
  function splitTags(v) {
    return (v || "").split(",").map(function (t) { return t.trim(); }).filter(function (t) { return t.length; });
  }

  function buildPayload() {
    var title = form.title.value.trim();
    var department = form.department.value.trim();
    var location = form.location.value.trim();
    var desc = form.desc.value.trim();
    if (!title || !department || !location || !desc) { return null; }
    var en = {
      title: form.title_en.value.trim() || null,
      department: form.department_en.value.trim() || null,
      location: form.location_en.value.trim() || null,
      desc: form.desc_en.value.trim() || null,
      type: null,
      tags: splitTags(form.tags_en.value),
      badge: null
    };
    return {
      title: title,
      department: department,
      location: location,
      type: form.type.value,
      icon: form.icon.value,
      description: desc,
      tags: splitTags(form.tags.value),
      badge: form.badge.value || null,
      en: en
    };
  }

  function resetForm() {
    form.reset();
    form.jobId.value = "";
    form.location.value = "بغداد، العراق";
    form.location_en.value = "Baghdad, Iraq";
    if (formHeading) formHeading.textContent = "نشر إعلان وظيفي جديد";
    if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> نشر الإعلان';
    if (cancelEditBtn) cancelEditBtn.hidden = true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    var payload = buildPayload();
    if (!payload) { showMsg(formMsg, "يرجى تعبئة جميع الحقول العربية المطلوبة (*).", "error"); return; }
    var editingId = form.jobId.value;
    if (submitBtn) submitBtn.disabled = true;
    var op = editingId
      ? sb.from("jobs").update(payload).eq("id", editingId)
      : sb.from("jobs").insert([payload]);
    op.then(function (res) {
      if (submitBtn) submitBtn.disabled = false;
      if (res.error) { showMsg(formMsg, "تعذّر الحفظ. تأكد من تسجيل الدخول.", "error"); return; }
      resetForm();
      renderAdminList();
      showMsg(formMsg, editingId ? "تم حفظ التعديلات بنجاح." : "تم نشر الإعلان بنجاح!", "success");
    }).catch(function () {
      if (submitBtn) submitBtn.disabled = false;
      showMsg(formMsg, "حدث خطأ غير متوقع.", "error");
    });
  }

  /* ---------- تعديل / حذف / نشر-إخفاء ---------- */
  function fillFormForEdit(job) {
    form.jobId.value = job.id;
    form.title.value = job.title || "";
    form.department.value = job.department || "";
    form.location.value = job.location || "";
    form.type.value = job.type || "دوام كامل";
    form.icon.value = job.icon || "fa-briefcase";
    form.desc.value = job.description || "";
    form.tags.value = (job.tags || []).join(", ");
    form.badge.value = job.badge || "";
    var en = job.en || {};
    form.title_en.value = en.title || "";
    form.department_en.value = en.department || "";
    form.location_en.value = en.location || "";
    form.desc_en.value = en.desc || "";
    form.tags_en.value = (en.tags || []).join(", ");
    if (formHeading) formHeading.textContent = "تعديل الإعلان";
    if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-floppy-disk"></i> حفظ التعديلات';
    if (cancelEditBtn) cancelEditBtn.hidden = false;
    if (form.scrollIntoView) form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleListClick(e) {
    var id = (e.target.closest("[data-id]") || {}).getAttribute ? e.target.closest("[data-id]").getAttribute("data-id") : null;
    if (!id) return;
    var job = currentRows.filter(function (j) { return String(j.id) === String(id); })[0];
    if (e.target.closest(".edit-btn")) { if (job) fillFormForEdit(job); return; }
    if (e.target.closest(".toggle-btn")) {
      if (!job) return;
      var newPublished = (job.published === false);
      sb.from("jobs").update({ published: newPublished }).eq("id", id).then(function (res) {
        if (res.error) { showMsg(formMsg, "تعذّر تغيير الحالة.", "error"); return; }
        renderAdminList();
      });
      return;
    }
    if (e.target.closest(".admin-del-btn")) {
      if (window.confirm("هل أنت متأكد من حذف هذا الإعلان نهائياً؟")) {
        sb.from("jobs").delete().eq("id", id).then(function (res) {
          if (res.error) { showMsg(formMsg, "تعذّر الحذف.", "error"); return; }
          renderAdminList();
          showMsg(formMsg, "تم حذف الإعلان.", "success");
        });
      }
      return;
    }
  }

  /* ---------- التهيئة ---------- */
  if (form) form.addEventListener("submit", handleSubmit);
  if (listEl) listEl.addEventListener("click", handleListClick);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", function () { resetForm(); });
  if (form) form.addEventListener("reset", function () { window.setTimeout(resetForm, 0); });

  checkSession();
})();

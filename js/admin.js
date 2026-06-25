 ===== UpKnowledge - Admin Dashboard Logic (Supabase + Auth) ===== */
/* انظر js/jobs.js (window.UpKnowledgeJobs) و window.upkSb (Supabase client) */

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
var listEl = document.getElementById("jobsList");
var countBadge = document.getElementById("countBadge");
var formMsg = document.getElementById("formMsg");
var submitBtn = document.getElementById("submitBtn");
var cancelEditBtn = document.getElementById("cancelEditBtn");
var formHeading = document.getElementById("formHeading");

var currentRows = [];

/* ---------- Utility ---------- */
function esc(s) { if (!s) return s; var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

function showMsg(el, txt, type) {
  if (!el) return;
  el.textContent = txt;
  el.className = "form-msg " + (type === "error" ? "form-msg-error" : type === "success" ? "form-msg-success" : "");
}

function showApp(show) {
  if (authOverlay) authOverlay.hidden = !show;
  if (adminApp) adminApp.hidden = show;
}

function showLogin() { showApp(true); }

function checkSession() {
  if (!sb) { showLogin(); return; }
  sb.auth.getSession().then(function (res) {
    var session = res.data && res.data.session;
    if (session && session.user) {
      showApp(false);
      renderAdminList();
    } else {
      showLogin();
    }
  }).catch(function () { showLogin(); });
}

/* ---------- Render Admin List ---------- */
function renderAdminList() {
  if (!sb) return;
  sb.from("jobs").select("*").order("created_at", { ascending: false }).then(function (res) {
    if (res.error) { console.warn("renderAdminList error:", res.error); return; }
    currentRows = res.data || [];
    if (listEl) {
      listEl.innerHTML = (currentRows.length ? currentRows.map(rowHTML).join("") : '<p style="padding:1rem">لا توجد وظائف حالياً</p>');
    }
  }).catch(function (e) { console.warn("renderAdminList failed:", e); });
}

function rowHTML(row) {
  var title = esc(row.title);
  var company = esc(row.company);
  var pub = row.published ? '<span style="color:#27ae60"><i class="fas fa-check-circle"></i> منشورة</span>' : '<span style="color:#e74c3c"><i class="fas fa-times-circle"></i> مخفية</span>';
  return '<div class="job-row" data-id="' + esc(String(row.id)) + '">' +
    '<div class="row-title">' + title + ' <span class="row-company">(' + company + ')</span></div>' +
    '<div class="row-actions">' +
    '<button class="edit-btn"><i class="fas fa-edit"></i> تعديل</button>' +
    '<button class="toggle-btn">' + pub + '</button>' +
    '<button class="admin-del-btn"><i class="fas fa-trash"></i> حذف</button>' +
    '</div>' +
    '</div>';
}

/* ---------- Build Form Payload ---------- */
function splitTags(v) {
  return (v || "").split(",").map(function (t) { return t.trim(); }).filter(function (t) { return t.length; });
}

function buildPayload() {
  var title = form.title.value.trim();
  var company = form.company.value.trim();
  var department = form.department.value.trim();
  var location = form.location.value.trim();
  var desc = form.desc.value.trim();
  if (!title || !company || !department || !location || !desc) { return null; }
  var en = {
    title: form.title_en.value.trim() || null,
    company: form.company_en.value.trim() || null,
    department: form.department_en.value.trim() || null,
    location: form.location_en.value.trim() || null,
    desc: form.desc_en.value.trim() || null,
    type: null,
    skills: splitTags(form.skills_en.value),
    experience: splitTags(form.experience_en.value),
    tags: splitTags(form.tags_en.value),
    badge: null
  };
  return {
    title: title,
    company: company,
    department: department,
    location: location,
    type: form.type.value,
    job_date: form.jobDate.value,
    icon: form.icon.value,
    description: desc,
    skills: splitTags(form.skills.value),
    experience: splitTags(form.experience.value),
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
  form.jobDate.valueAsDate = new Date();
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

/* ---------- Edit / Delete / Publish-Hide ---------- */
function fillFormForEdit(job) {
  form.jobId.value = job.id;
  form.title.value = job.title || "";
  form.company.value = job.company || "";
  form.department.value = job.department || "";
  form.location.value = job.location || "";
  form.type.value = job.type || "دوام كامل";
  form.icon.value = job.icon || "fa-briefcase";
  form.desc.value = job.description || "";
  form.skills.value = (job.skills || []).join(", ");
  form.experience.value = (job.experience || []).join(", ");
  form.tags.value = (job.tags || []).join(", ");
  form.badge.value = job.badge || "";
  if (job.job_date) {
    form.jobDate.valueAsDate = new Date(job.job_date);
  }
  var en = job.en || {};
  form.title_en.value = en.title || "";
  form.company_en.value = en.company || "";
  form.department_en.value = en.department || "";
  form.location_en.value = en.location || "";
  form.desc_en.value = en.desc || "";
  form.skills_en.value = (en.skills || []).join(", ");
  form.experience_en.value = (en.experience || []).join(", ");
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

/* ---------- Initialization ---------- */
if (form) form.addEventListener("submit", handleSubmit);
if (listEl) listEl.addEventListener("click", handleListClick);
if (cancelEditBtn) cancelEditBtn.addEventListener("click", function () { resetForm(); });
if (form) form.addEventListener("reset", function () { window.setTimeout(resetForm, 0); });
if (logoutBtn) logoutBtn.addEventListener("click", function () {
  if (sb) sb.auth.signOut().then(function () { showLogin(); }).catch(function () { showLogin(); });
});

checkSession();
})();

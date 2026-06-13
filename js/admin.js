/* ===== UpKnowledge - Admin Dashboard Logic ===== */
/* يعتمد على js/jobs.js (window.UpKnowledgeJobs) */

(function () {
  "use strict";

  var API = window.UpKnowledgeJobs;
  if (!API) {
    console.error("jobs.js غير محمّل");
    return;
  }

  var form = document.getElementById("jobForm");
  var listEl = document.getElementById("adminJobsList");
  var countBadge = document.getElementById("countBadge");
  var formMsg = document.getElementById("formMsg");
  var resetBtn = document.getElementById("resetBtn");

  /* ----- عرض رسالة مؤقتة ----- */
  function showMsg(text, type) {
    formMsg.textContent = text;
    formMsg.className = "form-msg show " + (type || "success");
    window.setTimeout(function () {
      formMsg.className = "form-msg";
    }, 3500);
  }

  /* ----- عرض قائمة الإعلانات في لوحة التحكم ----- */
  function renderAdminList() {
    var jobs = API.getJobs();
    countBadge.textContent = jobs.length;

    if (!jobs.length) {
      listEl.innerHTML =
        '<div class="admin-empty"><i class="fas fa-inbox"></i>' +
        "<p>لا توجد إعلانات منشورة. أضف وظيفة جديدة من النموذج.</p></div>";
      return;
    }

    listEl.innerHTML = jobs.map(function (job) {
      var badge = job.badge
        ? '<span class="admin-job-badge">' + API.esc(job.badge) + "</span>"
        : "";
      return "" +
      '<div class="admin-job-item" data-id="' + API.esc(job.id) + '">' +
        '<div class="admin-job-icon"><i class="fas ' + API.esc(job.icon || "fa-briefcase") + '"></i></div>' +
        '<div class="admin-job-body">' +
          '<div class="admin-job-top"><h3>' + API.esc(job.title) + "</h3>" + badge + "</div>" +
          '<div class="admin-job-meta">' +
            '<span><i class="fas fa-layer-group"></i> ' + API.esc(job.department) + "</span>" +
            '<span><i class="fas fa-location-dot"></i> ' + API.esc(job.location) + "</span>" +
            '<span><i class="fas fa-clock"></i> ' + API.esc(job.type) + "</span>" +
          "</div>" +
        "</div>" +
        '<button class="admin-del-btn" data-id="' + API.esc(job.id) + '" title="حذف الإعلان"><i class="fas fa-trash-can"></i></button>' +
      "</div>";
    }).join("");
  }

  /* ----- إضافة وظيفة عند إرسال النموذج ----- */
  function handleSubmit(e) {
    e.preventDefault();
    var title = form.title.value.trim();
    var department = form.department.value.trim();
    var location = form.location.value.trim();
    var desc = form.desc.value.trim();

    if (!title || !department || !location || !desc) {
      showMsg("يرجى تعبئة جميع الحقول المطلوبة (*).", "error");
      return;
    }

    var tags = form.tags.value
      .split(",")
      .map(function (t) { return t.trim(); })
      .filter(function (t) { return t.length; });

    var job = {
      title: title,
      department: department,
      location: location,
      type: form.type.value,
      icon: form.icon.value,
      desc: desc,
      tags: tags,
      badge: form.badge.value
    };

    API.addJob(job);
    renderAdminList();
    form.reset();
    form.location.value = "بغداد، العراق";
    showMsg("تم نشر الإعلان بنجاح! سيظهر الآن في صفحة الوظائف.", "success");
  }

  /* ----- الحذف والاستعادة ----- */
  function handleListClick(e) {
    var btn = e.target.closest(".admin-del-btn");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    if (window.confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      API.deleteJob(id);
      renderAdminList();
    }
  }

  function handleReset() {
    if (window.confirm("سيتم حذف جميع الإعلانات المخصصة واستعادة الوظائف الافتراضية. هل تريد المتابعة؟")) {
      API.resetJobs();
      renderAdminList();
      showMsg("تمت استعادة الوظائف الافتراضية.", "success");
    }
  }

  /* ----- التهيئة ----- */
  if (form) form.addEventListener("submit", handleSubmit);
  if (listEl) listEl.addEventListener("click", handleListClick);
  if (resetBtn) resetBtn.addEventListener("click", handleReset);

  renderAdminList();
})();

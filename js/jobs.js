/* UPK_TYPEBADGE_TR */
function upkTrType(v){ if(!v) return v; var m={"دوام كامل":"Full-time","دوام جزئي":"Part-time","عن بُعد":"Remote","تدريب":"Internship","عقد مؤقت":"Temporary"}; return m[v]||v; }
function upkTrBadge(v){ if(!v) return v; var m={"جديد":"New","الأكثر طلباً":"Most in demand","عاجل":"Urgent"}; return m[v]||v; }

/* ===== UpKnowledge - Jobs Data Layer ===== */

(function (global) {
"use strict";

var STORAGE_KEY = "upk_jobs";
var remoteJobs = null;
var remoteLoaded = false;

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

function makeJobSlug(job) {
if (job.slug) return job.slug;
var title = (job.title || "job").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
var id = String(job.id || "").slice(0, 8);
return title + "-" + id;
}

function getJobShareUrl(job) {
var slug = makeJobSlug(job);
var baseUrl = window.location.origin + "/careers.html";
return baseUrl + "?job=" + slug;
}

function mapRow(row) {
var en = row.en || {};
return {
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
slug: makeJobSlug(row),
shareUrl: null,
en: {
title: en.title, company: en.company || "", department: en.department, location: en.location,
type: en.type || upkTrType(row.type), desc: en.desc, skills: en.skills || [], experience: en.experience || [], tags: en.tags, badge: en.badge || upkTrBadge(row.badge)
}
};
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
global.localStorage.removeItem(STORAGE_KEY);
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
skills: job.en.skills || job.skills,
experience: job.en.experience || job.experience,
tags: job.en.tags || job.tags,
badge: job.en.badge || job.badge,
published: job.published,
slug: job.slug,
shareUrl: job.shareUrl,
en: job.en
};
}
return job;
}

function esc(s) { if (!s) return ""; var d = document.createElement("div"); d.textContent = String(s); return d.innerHTML; }

function badgeClass(b) { return b ? "job-badge badge-" + b.toLowerCase().replace(/\s+/g, "-") : ""; }

function jobCardHTML(job) {
var lang = currentLang();
var locJob = localizeJob(job, lang);
var badge = locJob.badge ? '<span class="job-badge ' + badgeClass(locJob.badge) + '">' + esc(locJob.badge) + '</span>' : '';
var skillsList = locJob.skills && locJob.skills.length ? '<div class="job-meta-section"><strong>المهارات:</strong> ' + locJob.skills.map(function(s) { return '<span class="skill-tag">' + esc(s) + '</span>'; }).join('') + '</div>' : '';
var expList = locJob.experience && locJob.experience.length ? '<div class="job-meta-section"><strong>الخبرات:</strong> ' + locJob.experience.map(function(e) { return '<span class="exp-tag">' + esc(e) + '</span>'; }).join('') + '</div>' : '';
var dateStr = locJob.job_date ? '<span class="job-date"><i class="fas fa-calendar"></i> ' + esc(locJob.job_date) + '</span>' : '';
var shareUrl = getJobShareUrl(locJob);

return '<div class="job-card" data-job-id="' + esc(locJob.id) + '">' +
'<div class="job-header"><div class="job-title-group"><h3 class="job-title">' + esc(locJob.title) + '</h3><p class="job-company">' + esc(locJob.company) + '</p></div>' + (badge ? '<div class="job-badge-wrapper">' + badge + '</div>' : '') + '</div>' +
'<div class="job-meta"><span class="job-type"><i class="fas fa-briefcase"></i> ' + esc(locJob.type) + '</span><span class="job-location"><i class="fas fa-map-marker-alt"></i> ' + esc(locJob.location) + '</span>' + (dateStr ? dateStr : '') + '</div>' +
'<p class="job-desc">' + esc(locJob.desc) + '</p>' +
(skillsList || expList ? '<div class="job-details">' + skillsList + expList + '</div>' : '') +
'<div class="job-actions"><button class="btn btn-primary job-apply-btn" data-job-id="' + esc(locJob.id) + '"><i class="fas fa-mouse"></i> تقديم</button><button class="btn btn-secondary copy-link-btn" data-url="' + shareUrl + '"><i class="fas fa-link"></i> نسخ الرابط</button></div></div>';
}

function ensureModalRoot() {
if (!document.getElementById("jobDetailsModal")) {
var div = document.createElement("div");
div.id = "jobDetailsModal";
div.className = "job-details-modal";
div.innerHTML = '<div class="modal-overlay"></div><div class="modal-content"></div>';
document.body.appendChild(div);
}
}

function closeModal() {
var m = document.getElementById("jobDetailsModal");
if (m) m.hidden = true;
}

function openDetails(jobId) {
var jobs = getJobs();
var job = jobs.filter(function(j) { return String(j.id) === String(jobId); })[0];
if (!job) return;
ensureModalRoot();
var m = document.getElementById("jobDetailsModal");
m.querySelector(".modal-content").innerHTML = '<button class="modal-close">&times;</button>' + jobCardHTML(job);
m.hidden = false;
}

function openApplyForm(jobId) {
console.log("Apply for job:", jobId);
}

function submitApplication(jobId) {
console.log("Submit application for:", jobId);
}

function sendApplicationEmails(data) {
console.log("Send emails:", data);
}

function showSuccess() {
console.log("Success!");
}

function bindGlobalHandlers() {
document.removeEventListener("click", handleJobsClick);
document.addEventListener("click", handleJobsClick);
}

function handleJobsClick(e) {
if (e.target.closest(".job-apply-btn")) {
var jobId = e.target.closest(".job-apply-btn").getAttribute("data-job-id");
openApplyForm(jobId);
}
if (e.target.closest(".copy-link-btn")) {
var url = e.target.closest(".copy-link-btn").getAttribute("data-url");
if (navigator.clipboard) {
navigator.clipboard.writeText(url).then(function() {
alert("تم نسخ الرابط");
}).catch(function() {
prompt("انسخ الرابط:", url);
});
} else {
prompt("انسخ الرابط:", url);
}
}
if (e.target.closest(".modal-overlay")) {
closeModal();
}
}

function renderJobs() {
var jobs = getJobs();
var jobsList = document.getElementById("jobsList");
if (!jobsList) return;

if (!jobs || jobs.length === 0) {
jobsList.innerHTML = '<div class="no-jobs"><p>لا توجد وظائف متاحة حالياً. يرجى المتابعة لاحقاً.</p></div>';
return;
}

jobsList.innerHTML = jobs.map(jobCardHTML).join("");
bindGlobalHandlers();
}

global.UpKnowledgeJobs = {
getJobs: getJobs,
addJob: addJob,
deleteJob: deleteJob,
resetJobs: resetJobs,
renderJobs: renderJobs,
loadRemoteJobs: loadRemoteJobs,
localizeJob: localizeJob,
getJobShareUrl: getJobShareUrl,
makeJobSlug: makeJobSlug,
mapRow: mapRow
};

// Auto-load and render
loadRemoteJobs().then(function() { renderJobs(); });

if (global.UpKnowledgeI18n && global.UpKnowledgeI18n.onLangChange) {
global.UpKnowledgeI18n.onLangChange(function() { renderJobs(); });
}
})(window);

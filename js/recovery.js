/* ===== UpKnowledge - Secure Password Recovery Handler ===== */
/* Depends on window.upkSb (Supabase client) defined in admin.html */
(function () {
  "use strict";

  var sb = window.upkSb;
  var overlay   = document.getElementById("recoveryOverlay");
  var authOv    = document.getElementById("authOverlay");
  var adminApp  = document.getElementById("adminApp");
  var form      = document.getElementById("recoveryForm");
  var pwEl      = document.getElementById("newPassword");
  var confirmEl = document.getElementById("confirmPassword");
  var msgEl     = document.getElementById("recoveryMsg");
  var btn       = document.getElementById("recoveryBtn");
  var rulesEl   = document.getElementById("pwRules");

  if (!sb || !overlay || !form) return;

  function parseHash() {
    var h = (window.location.hash || "").replace(/^#/, "");
    var p = new URLSearchParams(h);
    return p;
  }

  // اكتشاف خطأ في الرابط (رابط منتهٍ أو غير صالح)
  var hp = parseHash();
  var linkError = hp.get("error") || hp.get("error_code");
  if (linkError) {
    var desc = hp.get("error_description") || "";
    var human = /expired|otp_expired/i.test(linkError + " " + desc)
      ? "انتهت صلاحية رابط إعادة التعيين. اطلب رابطاً جديداً وافتحه فوراً."
      : "رابط إعادة التعيين غير صالح. اطلب رابطاً جديداً.";
    try { history.replaceState(null, document.title, window.location.pathname + window.location.search); } catch (e) {}
    if (authOv && msgEl === null) {}
    if (msgEl) { msgEl.textContent = human; msgEl.className = "form-msg show error"; }
    var am = document.getElementById("authMsg");
    if (am) { am.textContent = human; am.className = "form-msg show error"; }
    return; // لا تُظهر نموذج كلمة السر مع رابط فاسد
  }

  function evaluate(pw, confirm) {
    return {
      len:   pw.length >= 12,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      num:   /[0-9]/.test(pw),
      sym:   /[^A-Za-z0-9]/.test(pw),
      match: pw.length > 0 && pw === confirm
    };
  }
  function allValid(r) {
    return r.len && r.upper && r.lower && r.num && r.sym && r.match;
  }
  function paintRules() {
    var r = evaluate(pwEl.value, confirmEl.value);
    if (rulesEl) {
      Array.prototype.forEach.call(rulesEl.querySelectorAll("li"), function (li) {
        li.classList.toggle("ok", !!r[li.getAttribute("data-rule")]);
      });
    }
    return r;
  }
  pwEl.addEventListener("input", paintRules);
  confirmEl.addEventListener("input", paintRules);

  function showMsg(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = "form-msg show " + (type || "success");
  }

  function showRecoveryUI() {
    if (authOv)   authOv.hidden = true;
    if (adminApp) adminApp.hidden = true;
    overlay.hidden = false;
    try {
      history.replaceState(null, document.title,
        window.location.pathname + window.location.search);
    } catch (e) {}
  }

  sb.auth.onAuthStateChange(function (event) {
    if (event === "PASSWORD_RECOVERY") {
      showRecoveryUI();
    }
  });

  if (/type=recovery/.test(window.location.hash)) {
    showRecoveryUI();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var r = paintRules();
    if (!allValid(r)) {
      showMsg("كلمة المرور لا تستوفي جميع الشروط.", "error");
      return;
    }
    if (btn) btn.disabled = true;
    showMsg("جارٍ الحفظ…", "success");

    sb.auth.updateUser({ password: pwEl.value }).then(function (res) {
      if (res.error) {
        if (btn) btn.disabled = false;
        showMsg("تعذّر تحديث كلمة المرور: " + res.error.message, "error");
        return;
      }
      pwEl.value = ""; confirmEl.value = "";
      showMsg("تم تحديث كلمة المرور بنجاح. سيُعاد توجيهك لتسجيل الدخول…", "success");
      sb.auth.signOut().then(function () {
        window.setTimeout(function () {
          window.location.replace("admin.html");
        }, 1800);
      });
    }).catch(function () {
      if (btn) btn.disabled = false;
      showMsg("حدث خطأ غير متوقع. حاول مرة أخرى.", "error");
    });
  });
})();

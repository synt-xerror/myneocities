"use strict";

// KeepAndroidOpen Banner
//
// Modified by stxerr.dev
// Licensed under GPLv3
// Original code: https://github.com/keepandroidopen/keepandroidopen.github.io/blob/main/public/banner.js

(function () {
  "use strict";

  function getScriptParams() {
    var params = {};
    try {
      var src = document.currentScript && document.currentScript.src;
      if (!src) return params;
      var q = src.indexOf("?");
      if (q === -1) return params;
      var pairs = src.substring(q + 1).split("&");
      for (var i = 0; i < pairs.length; i++) {
        var kv = pairs[i].split("=");
        params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
      }
    } catch (e) {}
    return params;
  }

  var params = getScriptParams();

  // Link
  var linkUrl = "https://keepandroidopen.org";

  // Create banner DOM 
  var banner = document.getElementById("keepandroidopen");

  var messageText = "Android will become a locked-down platform in "

  if (linkUrl) {
    var link = document.createElement("a");
    link.href = linkUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = messageText;
    banner.appendChild(link);
  } else {
    banner.appendChild(document.createTextNode(messageText));
  }

  if (params.size === "minimal") {
    banner.appendChild(document.createTextNode("\u00A0"));
  } else {
    banner.appendChild(document.createElement("br"));
  }

  var countdownSpan = document.createElement("a");
  countdownSpan.textContent = "\u00A0";
  countdownSpan.href = linkUrl;
  banner.appendChild(countdownSpan);

  // Insert into target element (by id) or prepend to <body>
  var targetId = params.id;
  if (targetId) {
    var target = document.getElementById(targetId);
    if (target) {
      target.appendChild(banner);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }
  } else {
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // Countdown logic
  var countDownDate = new Date("Jan 1, 2027 00:00:00").getTime();

  var unitFormatters = {
    day: new Intl.NumberFormat("en", { style: "unit", unit: "day", unitDisplay: "narrow" }),
    hour: new Intl.NumberFormat("en", { style: "unit", unit: "hour", unitDisplay: "narrow" }),
    minute: new Intl.NumberFormat("en", { style: "unit", unit: "minute", unitDisplay: "narrow" }),
    second: new Intl.NumberFormat("en", { style: "unit", unit: "second", unitDisplay: "narrow" })
  };

  function formatUnit(value, unit) {
    return unitFormatters[unit].format(value);
  }

  var remaining = new Array(7);
  var separator = " ";
  var timer = null;

  function updateBanner() {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var parts = 0;
    remaining[0] = days > 0 ? formatUnit(days, "day") : null;
    if (remaining[0]) parts++;
    remaining[1] = parts ? separator : null;
    remaining[2] =
      parts || hours > 0
        ? formatUnit(hours, "hour")
        : null;
    if (remaining[2]) parts++;
    remaining[3] = parts ? separator : null;
    remaining[4] =
      parts || minutes > 0
        ? formatUnit(minutes, "minute")
        : null;
    if (remaining[4]) parts++;
    remaining[5] = parts ? separator : null;
    remaining[6] = formatUnit(seconds, "second");

    countdownSpan.textContent = remaining.join("");

    if (distance < 0) {
      clearInterval(timer);
    }
  }

  timer = setInterval(updateBanner, 1000);
  updateBanner();
})();

// MAILING

const errEl   = document.getElementById("mailing-error");
const showMsg = msg => { if (errEl) { errEl.textContent = msg; errEl.hidden = false; } };
const clearMsg = ()  => { if (errEl) errEl.hidden = true; };

document.getElementById("subButton")?.addEventListener("click", async () => {
  const email = document.getElementById("mailing-email")?.value.trim();
  if (!email) { showMsg("email required."); return; }
  try {
    const s = await fetch(`/status/${encodeURIComponent(email)}`).then(r => r.json());
    if (s.subscribed)              { showMsg("already subscribed."); return; }
    if (s.pending?.type === "sub") { showMsg("confirmation pending. check your inbox."); return; }
    const r = await fetch("/sub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (r.status === 409) { showMsg("already subscribed."); return; }
    if (r.ok) {
      document.getElementById("mailing-form").hidden    = true;
      document.getElementById("mailing-confirm").hidden = false;
      clearMsg();
    }
  } catch { showMsg("request failed."); }
});

document.getElementById("unsubButton")?.addEventListener("click", async () => {
  const email = document.getElementById("mailing-email")?.value.trim();
  if (!email) { showMsg("email required."); return; }
  try {
    const s = await fetch(`/status/${encodeURIComponent(email)}`).then(r => r.json());
    if (!s.subscribed)               { showMsg("not subscribed."); return; }
    if (s.pending?.type === "unsub") { showMsg("cancellation pending. check your inbox."); return; }
    const r = await fetch("/unsub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (r.ok) {
      document.getElementById("mailing-form").hidden    = true;
      document.getElementById("mailing-confirm").hidden = false;
      clearMsg();
    }
  } catch { showMsg("request failed."); }
});

document.getElementById("confirmButton")?.addEventListener("click", async () => {
  const email = document.getElementById("mailing-email")?.value.trim();
  const code  = document.getElementById("mailing-code")?.value.trim();
  if (!code) { showMsg("code required."); return; }
  try {
    const r = await fetch("/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    if (r.ok) { document.getElementById("mailing-confirm").hidden = true; showMsg("done."); }
    else showMsg("invalid code.");
  } catch { showMsg("request failed."); }
});



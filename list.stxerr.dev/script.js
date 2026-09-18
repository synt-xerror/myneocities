const subButton = document.getElementById("subButton");
const unsubButton = document.getElementById("unsubButton");

async function getStatus(email) {
  const res = await fetch(`/status/${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Error while getting status from backend.");
  return res.json(); // { subscribed: bool, pending: { type, expiresAt } | null }
}

function showError(msg) {
  const el = document.getElementById("error");
  el.textContent = msg;
  el.hidden = false;
}

subButton.onclick = async () => {
  const email = document.getElementById("email").value;
  const status = await getStatus(email);

  if (status.subscribed) {
    window.location.href = "/already-subscribed.html";
    return;
  }
  if (status.pending?.type === "sub") {
    showError("There is already a pending confirmation for this email. Please check your inbox.");
    return;
  }

  const response = await fetch("/sub", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (response.status === 409) {
    window.location.href = "/already-subscribed.html";
    return;
  }
  if (response.ok) {
    window.location.href = `/verify.html?email=${encodeURIComponent(email)}`;
  }
};

unsubButton.onclick = async () => {
  const email = document.getElementById("email").value;

  const status = await getStatus(email);

  if (!status.subscribed) {
    alert("This e-mail is not subscribed.");
    return;
  }
  if (status.pending?.type === "unsub") {
    alert("There is already a pending confirmation for the cancelation for this email. Please check your inbox.");
    return;
  }

  const response = await fetch("/unsub", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  console.log("status:", response.status);
  if (response.ok) {
    window.location.href = `/verify.html?email=${encodeURIComponent(email)}`;
  }
};

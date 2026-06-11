const chat = document.getElementById("chat");
const form = document.getElementById("ask-form");
const input = document.getElementById("question");
const submitBtn = document.getElementById("submit-btn");

const BOT_AVATAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
const USER_AVATAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;

function createAvatar(role) {
  const avatar = document.createElement("div");
  const isUser = role === "user";
  avatar.className = `avatar ${isUser ? "avatar-user" : "avatar-bot"}`;
  avatar.innerHTML = isUser ? USER_AVATAR_SVG : BOT_AVATAR_SVG;
  avatar.setAttribute("aria-hidden", "true");
  return avatar;
}

function addMessage(text, role) {
  const row = document.createElement("div");
  row.className = `message-row ${role === "user" ? "user" : "bot"}`;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;
  bubble.textContent = text;

  if (role === "user") {
    row.appendChild(bubble);
    row.appendChild(createAvatar(role));
  } else {
    row.appendChild(createAvatar(role));
    row.appendChild(bubble);
  }

  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
  return row;
}

function addThinkingMessage() {
  const row = document.createElement("div");
  row.className = "message-row bot";
  row.appendChild(createAvatar("bot"));

  const bubble = document.createElement("div");
  bubble.className = "bubble bot thinking";
  bubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  row.appendChild(bubble);

  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
  return row;
}

function addBotAnswer(answer, sources) {
  const row = document.createElement("div");
  row.className = "message-row bot";
  row.appendChild(createAvatar("bot"));

  const bubble = document.createElement("div");
  bubble.className = "bubble bot";

  const answerEl = document.createElement("div");
  answerEl.textContent = answer;
  bubble.appendChild(answerEl);

  if (sources && sources.length > 0) {
    const sourcesEl = document.createElement("div");
    sourcesEl.className = "sources";
    sourcesEl.innerHTML = "<strong>Sources:</strong>";
    const list = document.createElement("ol");
    sources.forEach((source) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = source.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = source.title || source.url;
      li.appendChild(a);
      list.appendChild(li);
    });
    sourcesEl.appendChild(list);
    bubble.appendChild(sourcesEl);
  }

  row.appendChild(bubble);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  addMessage(question, "user");
  input.value = "";
  submitBtn.disabled = true;

  const thinkingEl = addThinkingMessage();

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    thinkingEl.remove();

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      addMessage(errorBody.detail || `Request failed (${response.status})`, "error");
      return;
    }

    const data = await response.json();
    addBotAnswer(data.answer, data.sources);
  } catch (err) {
    thinkingEl.remove();
    addMessage(`Network error: ${err.message}`, "error");
  } finally {
    submitBtn.disabled = false;
    input.focus();
  }
});

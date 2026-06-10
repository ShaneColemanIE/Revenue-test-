const chat = document.getElementById("chat");
const form = document.getElementById("ask-form");
const input = document.getElementById("question");
const submitBtn = document.getElementById("submit-btn");

function addMessage(text, role) {
  const el = document.createElement("div");
  el.className = `message ${role}`;
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
  return el;
}

function addBotAnswer(answer, sources) {
  const el = document.createElement("div");
  el.className = "message bot";

  const answerEl = document.createElement("div");
  answerEl.textContent = answer;
  el.appendChild(answerEl);

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
    el.appendChild(sourcesEl);
  }

  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  addMessage(question, "user");
  input.value = "";
  submitBtn.disabled = true;

  const thinkingEl = addMessage("Thinking...", "bot");

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

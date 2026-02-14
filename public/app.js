// ═══════════════════════════════════════════════════════
//  UrbanRoof Property Assistant — Client Logic
// ═══════════════════════════════════════════════════════

const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chat = document.getElementById("chat");

// Conversation history (sent to backend for context)
let conversationHistory = [];

// ── Set welcome time ──────────────────────────────────
document.getElementById("welcome-time").textContent = formatTime(new Date());

// ── Input handling ────────────────────────────────────
userInput.addEventListener("input", () => {
    // Auto-grow textarea
    userInput.style.height = "auto";
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + "px";

    // Enable/disable send button
    sendBtn.disabled = userInput.value.trim().length === 0;
});

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) sendMessage();
    }
});

sendBtn.addEventListener("click", sendMessage);

// ── Send message ──────────────────────────────────────
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Clear input
    userInput.value = "";
    userInput.style.height = "auto";
    sendBtn.disabled = true;

    // Add user message to UI
    addMessage("user", text);

    // Add to history
    conversationHistory.push({ role: "user", content: text });

    // Show typing indicator
    const typingEl = showTypingIndicator();

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: conversationHistory }),
        });

        // Remove typing indicator
        typingEl.remove();

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Something went wrong. Please try again.");
        }

        const data = await response.json();
        const reply = data.reply;

        // Add assistant reply
        addMessage("assistant", reply);

        // Add to history
        conversationHistory.push({ role: "assistant", content: reply });
    } catch (error) {
        typingEl.remove();
        addMessage("error", error.message || "Connection failed. Please check your internet and try again.");
    }
}

// ── Add message to DOM ────────────────────────────────
function addMessage(role, text) {
    const wrapper = document.createElement("div");
    wrapper.className = `message message--${role}`;

    if (role === "assistant") {
        wrapper.innerHTML = `
      <div class="message__avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <div class="message__content">
        <div class="message__bubble">${formatMarkdown(text)}</div>
        <span class="message__time">${formatTime(new Date())}</span>
      </div>
    `;
    } else if (role === "user") {
        wrapper.innerHTML = `
      <div class="message__content">
        <div class="message__bubble"><p>${escapeHtml(text)}</p></div>
        <span class="message__time">${formatTime(new Date())}</span>
      </div>
    `;
    } else if (role === "error") {
        wrapper.className = "message message--assistant message--error";
        wrapper.innerHTML = `
      <div class="message__avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <div class="message__content">
        <div class="message__bubble"><p>${escapeHtml(text)}</p></div>
        <span class="message__time">${formatTime(new Date())}</span>
      </div>
    `;
    }

    messagesContainer.appendChild(wrapper);
    scrollToBottom();
}

// ── Typing indicator ──────────────────────────────────
function showTypingIndicator() {
    const el = document.createElement("div");
    el.className = "typing-indicator";
    el.innerHTML = `
    <div class="message__avatar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
    <div class="typing-dots">
      <span></span><span></span><span></span>
    </div>
  `;
    messagesContainer.appendChild(el);
    scrollToBottom();
    return el;
}

// ── Scroll to bottom ──────────────────────────────────
function scrollToBottom() {
    requestAnimationFrame(() => {
        chat.scrollTop = chat.scrollHeight;
    });
}

// ── Format time ───────────────────────────────────────
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Escape HTML ───────────────────────────────────────
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ── Simple markdown → HTML ────────────────────────────
function formatMarkdown(text) {
    // Escape HTML first
    let html = escapeHtml(text);

    // Bold: **text**
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Numbered lists: lines starting with "1. ", "2. ", etc.
    html = html.replace(/^(\d+)\.\s+(.+)$/gm, "<li>$2</li>");

    // Bullet lists: lines starting with "- " or "• "
    html = html.replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>");

    // Wrap consecutive <li> items in <ul>
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

    // Split remaining text into paragraphs
    html = html
        .split(/\n\n+/)
        .map((block) => {
            block = block.trim();
            if (!block) return "";
            // Don't wrap <ul> blocks in <p>
            if (block.startsWith("<ul>")) return block;
            // Don't wrap if already has block-level element
            if (block.startsWith("<")) return block;
            // Wrap in <p>, convert single newlines to <br>
            return "<p>" + block.replace(/\n/g, "<br>") + "</p>";
        })
        .join("");

    return html;
}

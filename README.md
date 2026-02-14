#  UrbanRoof — AI Property Enquiry Assistant

An AI-powered customer support chatbot for property-related issues — built with **Groq + Llama 3.3 70B** and a premium glassmorphism chat UI.

Customers describe problems like dampness, leaks, or cracks, and the assistant responds with structured, safe, and professional guidance — no false claims, no cost estimates, no guarantees.

---

## ✨ Features

-  **Powered by Llama 3.3 70B** via Groq — fast, accurate, instruction-following
-  **Smart intent classification** — dampness, leakage, cracks, plumbing, external wall damage, and more
-  **Structured responses** — acknowledgment → clarifying questions → safe steps → professional recommendation
-  **Strict safety rules** — no diagnosis, no cost claims, no guarantees
-  **Premium dark UI** — glassmorphism, smooth animations, responsive design
-  **UrbanRoof contact integration** — shares website & phone when users are ready to proceed

---

##  Quick Start

```bash
# Clone
git clone https://github.com/NihaallX/urbanroof.git
cd urbanroof

# Install dependencies
npm install

# Add your Groq API key
# Edit .env and set GROQ_API_KEY=your_key_here

# Start
npm start
# → http://localhost:3000
```

Get a free Groq API key at [console.groq.com](https://console.groq.com).

---

## 💬 Example Conversations

### Example 1 — Dampness after rain

> **User:** Hi, I am getting damp patches on my bedroom wall after rains. What should I do?

> **Assistant:** I'm so sorry to hear that you're dealing with damp patches on your bedroom wall, especially after rains. That can be really frustrating and worrisome.
>
> To better understand the issue, can you tell me:
> - Where exactly on the wall are you noticing these damp patches — is it near a window, door, or a specific corner?
> - How long have you been noticing this issue, and has it been getting worse over time?
> - Have you recently experienced any plumbing leaks or issues that might be contributing?
>
> In the meantime, you might want to monitor the area closely after it rains, ensure good ventilation in your bedroom, and take some photos to document the issue.
>
> I would recommend having a professional inspect the area to determine the cause of the dampness.

### Example 2 — Ready to proceed

> **User:** This looks like a serious issue, how can I proceed with getting it fixed?

> **Assistant:** I understand your concern. To get a more accurate assessment and guidance, it would be best to have a professional inspect the issue.
>
> You can reach our team at **+91 89288 05805** or visit **[www.urbanroof.in](https://www.urbanroof.in)** to book an inspection.

---

##  Architecture

```
urbanroof/
├── server.js          # Express + Groq SDK + system prompt
├── .env               # GROQ_API_KEY
├── package.json
└── public/
    ├── index.html     # Chat UI
    ├── style.css      # Glassmorphism dark theme
    └── app.js         # Client chat logic
```

| Component | Tech |
|-----------|------|
| Backend | Node.js, Express |
| AI | Groq SDK → Llama 3.3 70B |
| Frontend | Vanilla HTML/CSS/JS |
| Design | Dark theme, glassmorphism, Inter font |

---

##  Safety Rules

The system prompt enforces these rules on every response:

- ❌ No cost estimates
- ❌ No definitive diagnoses ("definitely caused by X")
- ❌ No structural or legal guarantees
- ❌ No claims of property inspection
- ❌ No technical jargon (unless customer uses it)
- ❌ No alarmist language
- ✅ Always suggests professional inspection when appropriate
- ✅ Calm, clear, human tone

---

##  Contact UrbanRoof

- 🌐 [www.urbanroof.in](https://www.urbanroof.in)
- 📞 +91 89288 05805
- 📍 Pune, Maharashtra, India

---

**Built with ❤️ for UrbanRoof**

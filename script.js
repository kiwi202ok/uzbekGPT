const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const languageSelector = document.getElementById("languageSelector");
const darkModeToggle = document.getElementById("darkModeToggle");

// Toggle dark mode, va localStorage ga saqlash
darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "disabled");
  }
});

// Sahifa yuklanganda localStorage dan o'qib dark mode ni tiklash
window.addEventListener("load", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    darkModeToggle.checked = true;
    document.body.classList.add("dark");
  }
});

chatForm.addEventListener("submit", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage(e);
  }
});

async function sendMessage(e) {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("Siz", message);
  userInput.value = "";

  const language = languageSelector.value;
  const prompts = {
    uz: "Javobni o'zbek tilida yozing.",
    en: "Answer in English.",
    ru: "Ответь на русском языке."
  };

  const systemPrompt = prompts[language] || "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Javob olinmadi.";
    appendMessage("uzbekGPT", reply);
  } catch (err) {
    appendMessage("uzbekGPT", "Xatolik yuz berdi: " + err.message);
  }
}

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
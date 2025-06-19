// Quote of the Day
const quotes = [
  "One day at a time. You're doing great.",
  "You are stronger than your addiction.",
  "This struggle is temporary. Recovery is permanent.",
  "Small steps lead to big changes.",
  "Relapse is a part of recovery, not the end."
];
document.getElementById('quoteText').innerText = quotes[Math.floor(Math.random() * quotes.length)];

// Sobriety Tracker
function loadStreak() {
  const savedDate = localStorage.getItem("sobrietyStart");
  if (!savedDate) {
    localStorage.setItem("sobrietyStart", new Date().toISOString());
    return 0;
  }
  const days = Math.floor((new Date() - new Date(savedDate)) / (1000 * 60 * 60 * 24));
  document.getElementById("streakCount").innerText = `${days} Days`;
}
function resetStreak() {
  if (confirm("Are you sure you relapsed? This will reset your streak.")) {
    localStorage.setItem("sobrietyStart", new Date().toISOString());
    loadStreak();
  }
}
loadStreak();

// Emergency SOS Tools
function startBreathing() {
  document.getElementById("sosContent").innerHTML = `<p>Breathe in...<br>Breathe out...</p>`;
  setTimeout(() => document.getElementById("sosContent").innerHTML = '', 5000);
}
function showHotlines() {
  document.getElementById("sosContent").innerHTML = `
    <ul>
      <li>📞 National Helpline: 1800-11-0031</li>
      <li>📞 Nasha Mukti Kendra: 14446</li>
      <li>🌐 <a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank">More Resources</a></li>
    </ul>`;
}
function playMusic() {
  const audio = new Audio("https://www.bensound.com/bensound-music/bensound-goinghigher.mp3");
  audio.play();
  document.getElementById("sosContent").innerHTML = `<p>Motivation music playing... 🎵</p>`;
}

// Anonymous Report
document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const reportText = document.getElementById('reportInput').value;

  const res = await fetch('/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report: reportText })
  });

  const data = await res.json();
  alert(data.message);
  document.getElementById('reportInput').value = '';
});

// Chatbot + quick buttons
document.getElementById('chatForm').addEventListener('submit', handleChat);
document.querySelectorAll('.quickBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('chatInput').value = btn.dataset.msg;
    handleChat(new Event('submit'));
  });
});
async function handleChat(e) {
  e.preventDefault();
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value;
  appendMessage("You", message, "user");

  const res = await fetch('/api/chatbot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  appendMessage("Therapist", data.reply, "bot");
  chatInput.value = '';
}
function appendMessage(sender, msg, type) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${type}`;
  bubble.innerHTML = `<strong>${sender}:</strong> ${msg}`;
  document.getElementById('chatHistory').appendChild(bubble);
}

// Journal
document.getElementById('journalForm').addEventListener('submit', e => {
  e.preventDefault();
  const entry = document.getElementById('journalEntry').value;
  const list = document.getElementById('journalList');
  const item = document.createElement('li');
  const date = new Date().toLocaleDateString();
  item.textContent = `${date}: ${entry}`;
  list.appendChild(item);
  let logs = JSON.parse(localStorage.getItem("journal")) || [];
  logs.push({ date, entry });
  localStorage.setItem("journal", JSON.stringify(logs));
  document.getElementById('journalEntry').value = '';
});
window.addEventListener('load', () => {
  const logs = JSON.parse(localStorage.getItem("journal")) || [];
  const list = document.getElementById('journalList');
  logs.forEach(log => {
    const item = document.createElement('li');
    item.textContent = `${log.date}: ${log.entry}`;
    list.appendChild(item);
  });
});
document.getElementById('darkToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Persist theme
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
});

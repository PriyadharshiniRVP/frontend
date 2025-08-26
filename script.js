const BASE_URL = "https://mlserviceforleet-1.onrender.com";
let chartInstance = null;

async function fetchStats() {
  const username = document.getElementById('username').value.trim();
  if (!username) {
    alert("Please enter a LeetCode username.");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/fetchStats?username=${username}`);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();

    renderProgressChart(data);
    await fetchInsights(username);
    await fetchSuggestions(username);
  } catch (err) {
    console.error("Error fetching stats:", err);
    alert(err.message || "Could not load stats.");
  }
}

function renderProgressChart(data) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [{
        label: 'Problems Solved',
        data: [data.easySolved, data.mediumSolved, data.hardSolved],
        backgroundColor: [
          'rgba(0, 255, 255, 0.6)',
          'rgba(0, 153, 255, 0.6)',
          'rgba(255, 0, 153, 0.6)'
        ],
        borderColor: [
          'rgba(0, 255, 255, 1)',
          'rgba(0, 153, 255, 1)',
          'rgba(255, 0, 153, 1)'
        ],
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Problem Difficulty Breakdown',
          color: '#00ffe7',
          font: { size: 18, weight: 'bold' }
        },
        tooltip: {
          backgroundColor: '#1e1e2f',
          titleColor: '#00ffe7',
          bodyColor: '#e0e0e0',
          borderColor: '#00ffe7',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: { color: '#e0e0e0' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#e0e0e0' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    }
  });
}

async function fetchInsights(username) {
  try {
    const res = await fetch(`${BASE_URL}/api/aiInsights?username=${username}`);
    if (!res.ok) throw new Error(await res.text());
    const insight = await res.text();

    document.getElementById('aiInsights').innerHTML = `
      <p style="color:#00ffe7; font-weight:bold;">💡 AI Insight:</p>
      <p>${insight}</p>
    `;
  } catch (err) {
    console.error("Error fetching insights:", err);
  }
}

async function fetchSuggestions(username) {
  try {
    const res = await fetch(`${BASE_URL}/api/recommendationsByUsername?username=${username}`);
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    const suggestions = data.recommendations || [];

    renderSuggestions(suggestions);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    document.getElementById('suggestionsList').innerHTML = "<li>Error loading suggestions.</li>";
  }
}

function renderSuggestions(suggestions) {
  const list = document.getElementById('suggestionsList');
  list.innerHTML = "";

  if (suggestions.length === 0) {
    list.innerHTML = "<li>No suggestions available yet.</li>";
    return;
  }

  suggestions.forEach(item => {
    const li = document.createElement("li");

    const title = item.title || "Untitled";
    const difficulty = item.difficulty || "Unknown";
    let url = item.url || "";

    // ✅ Ensure full LeetCode link
    if (!url.startsWith("http")) {
      url = `https://leetcode.com/problems/${url}`;
    }

    li.innerHTML = `
      <a href="${url}" target="_blank" style="color:#00ffe7; text-decoration:none;">
        ${title} <span style="color:#999;">[${difficulty}]</span>
      </a>
    `;
    list.appendChild(li);
  });
}

// 👩‍💻 Developer Profile Toggle
function toggleProfile() {
  const profile = document.getElementById("developerProfile");
  profile.style.display = profile.style.display === "none" ? "block" : "none";
}

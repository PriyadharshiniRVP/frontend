const BASE_URL = "http://localhost:8080"; // or your deployed backend URL

let chartInstance = null;

async function fetchStats() {
  const username = document.getElementById('username').value.trim();
  if (!username) {
    alert("Please enter a LeetCode username.");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/fetchStats?username=${username}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch stats");
    }

    const data = await res.json();

    renderProgressChart(data);
    await fetchInsights(username); // ✅ Backend-powered AI insights
  } catch (err) {
    console.error("Error fetching stats:", err);
    alert(err.message || "Could not load stats. Please check the username or try again later.");
  }
}

function renderProgressChart(data) {
  const ctx = document.getElementById('progressChart').getContext('2d');

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [{
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
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#00ffe7',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        title: {
          display: true,
          text: 'Problem Difficulty Breakdown',
          color: '#00ffe7',
          font: {
            size: 18,
            weight: 'bold'
          }
        },
        tooltip: {
          backgroundColor: '#1e1e2f',
          titleColor: '#00ffe7',
          bodyColor: '#e0e0e0',
          borderColor: '#00ffe7',
          borderWidth: 1
        }
      }
    }
  });
}

async function fetchInsights(username) {
  try {
    // Updated endpoint to match backend
    const res = await fetch(`${BASE_URL}/api/aiInsights?username=${username}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch insights");
    }

    const insight = await res.text(); // Backend returns plain text

    const insightsDiv = document.getElementById('aiInsights');
    insightsDiv.innerHTML = `<p style="color:#00ffe7; font-weight:bold;">💡 AI Insight:</p><p>${insight}</p>`;
  } catch (err) {
    console.error("Error fetching insights:", err);
    const insightsDiv = document.getElementById('aiInsights');
    insightsDiv.innerHTML = `<p style="color:#ff4d4d;">Could not load AI insights. Try again later.</p>`;
  }
}
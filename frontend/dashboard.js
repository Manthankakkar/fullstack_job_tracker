const API_BASE = "http://localhost:5000/api"; 
const token = localStorage.getItem("token");

console.log("Token in frontend:", token)

// ================= JOB APPLICATION =================
async function loadApplications() {
  try {
    const res = await axios.get(`${API_BASE}/job-applications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(res.data)
    const apps = res.data.data;
    const tbody = document.getElementById("applicationList");
    tbody.innerHTML = "";
    apps.forEach(app => {
      const row = `
        <tr>
          <td>${app.companyName}</td>
          <td>${app.jobTitle}</td>
          <td>${app.applicationDate}</td>
          <td>${app.status}</td>
          <td>${app.notes || ''}</td>
          <td>${app.attachment ? `<a href='http://localhost:5000/${app.attachment}' target="_blank">View</a>` : ''}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("jobApplicationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    await axios.post(`${API_BASE}/job-applications`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    });
    alert("Application submitted!");
    e.target.reset();
    loadApplications();
  } catch (err) {
    alert("Failed to submit application");
  }
});

// ================= PROFILE =================
document.getElementById("viewProfileBtn").addEventListener("click", async () => {
  try {
    const res = await axios.get(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profile = res.data;
    document.getElementById("profileName").value = profile.name || "";
    document.getElementById("profileEmail").value = profile.email || "";
    document.getElementById("careerGoals").value = profile.careerGoals || "";
    const modal = new bootstrap.Modal(document.getElementById("profileModal"));
    modal.show();
  } catch (err) {
    alert("Failed to load profile");
  }
});

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await axios.put(`${API_BASE}/auth/profile`, {
      name: document.getElementById("profileName").value,
      email: document.getElementById("profileEmail").value,
      careerGoals: document.getElementById("careerGoals").value
    }, { headers: { Authorization: `Bearer ${token}` } });
    alert("Profile updated!");
    bootstrap.Modal.getInstance(document.getElementById("profileModal")).hide();
  } catch (err) {
    alert("Failed to update profile");
  }
});

// ================= REMINDERS =================
async function loadJobApplicationsForReminder() {
  const res = await axios.get(`${API_BASE}/job-applications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const select = document.getElementById("jobAppId");
  select.innerHTML = "";
  res.data.data.forEach(app => {
    select.innerHTML += `<option value="${app.id}">${app.companyName} - ${app.jobTitle}</option>`;
  });
}

document.getElementById("reminderForm").addEventListener("submit", async e => {
  e.preventDefault();
  const data = {
    jobApplicationId: document.getElementById("jobAppId").value,
    reminderDate: document.getElementById("reminderDate").value,
    message: document.getElementById("reminderMessage").value
  };
  try {
    await axios.post(`${API_BASE}/reminders`, data, { headers: { Authorization: `Bearer ${token}` } });
    alert("Reminder set!");
    e.target.reset();
  } catch (err) {
    alert("Failed to set reminder");
  }
});

// ================= COMPANIES =================
async function loadCompanies() {
  try {
    const res = await axios.get(`${API_BASE}/companies`,{headers: { Authorization: `Bearer ${token}` }});
    const companies = res.data.data;
    console.log("companies are",companies)
    const select = document.getElementById("companySelect");
    select.innerHTML = "";
    companies.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });

    // Display in table
    const tbody = document.getElementById("companyList");
    tbody.innerHTML = "";
    companies.forEach(c => {
      tbody.innerHTML += `
        <tr>
          <td>${c.name}</td>
          <td><a href="${c.website}" target="_blank">${c.website || "-"}</a></td>
          <td>${c.industry || "-"}</td>
          <td>${c.description || "-"}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("companyForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById("companyformName").value,
    website: document.getElementById("companyWebsite").value,
    industry: document.getElementById("companyIndustry").value,
    description: document.getElementById("companyDescription").value,
  };
  console.log("data is",data)
  await axios.post(`${API_BASE}/companies`, data,{headers: { Authorization: `Bearer ${token}` }});
  alert("Company added!");
  loadCompanies();
  e.target.reset();
});

// ================= JOB LISTINGS =================
document.getElementById("jobListingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    companyId: document.getElementById("companySelect").value,
    title: document.getElementById("joblistingTitle").value,
    location: document.getElementById("jobLocation").value,
    link: document.getElementById("jobLink").value,
  };
  await axios.post(`${API_BASE}/companies/job-listings`, data,{headers: { Authorization: `Bearer ${token}` }});
  alert("Job listing added!");
  e.target.reset();
  displayJobListings();
});

async function displayJobListings() {
  try {
    const res = await axios.get(`${API_BASE}/companies/job-listings`,{headers: { Authorization: `Bearer ${token}` }});
    const jobs = res.data.data;
    console.log("jobs are" ,jobs)
    const tbody = document.getElementById("jobListingList");
    tbody.innerHTML = "";
    jobs.forEach(job => {
      tbody.innerHTML += `
        <tr>
          <td>${job.Company?.name}</td>
          <td>${job.title}</td>
          <td>${job.location || "-"}</td>
          <td>${job.link ? `<a href="${job.link}" target="_blank">View</a>` : "-"}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}




// Status Chart
async function loadStatusChart() {
  try {
    const res = await axios.get(`${API_BASE}/job-applications/stats`, { headers: { Authorization: `Bearer ${token}` } });
    const data = res.data.data;
    
    const labels = data.map(d => d.status);
    const counts = data.map(d => d.count);

    new Chart(document.getElementById("statusChart"), {
      type: "pie",
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: ["#007bff", "#ffc107", "#28a745", "#dc3545"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Applications by Status' }
        }
      }
    });

  } catch (err) {
    console.error(err);
  }
}

// Timeline Chart
async function loadTimelineChart() {
  try {
    const res = await axios.get(`${API_BASE}/job-applications/timeline`, { headers: { Authorization: `Bearer ${token}` } });
    const data = res.data.data;

    const labels = data.map(d => `Month ${d.month}`);
    const counts = data.map(d => d.count);

    new Chart(document.getElementById("timelineChart"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Applications",
          data: counts,
          fill: false,
          borderColor: "#007bff",
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Applications Over Time' }
        },
        scales: {
          y: { beginAtZero: true, precision:0 }
        }
      }
    });

  } catch (err) {
    console.error(err);
  }
}

// Load charts on page load
loadStatusChart();
loadTimelineChart();


// ================= INITIAL LOAD =================
loadApplications();
loadJobApplicationsForReminder();
loadCompanies();
displayJobListings();



//==search and filter=====
async function searchApplications() {
  const title = document.getElementById("searchTitle").value;
  ;
  const status = document.getElementById("searchStatus").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const params = new URLSearchParams({ title, status, startDate, endDate });
  const res = await axios.get(`${API_BASE}/job-applications/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = res.data;
  console.log("search data",data)
  const container = document.getElementById("searchResults");
  container.innerHTML = data.data.map(app => `
    <div class="card">
      <h3>${app.jobTitle}</h3>
      <p>Company: ${app.companyName || "N/A"}</p>
      <p>Status: ${app.status}</p>
      <p>Date: ${new Date(app.createdAt).toLocaleDateString()}</p>
    </div>
  `).join("");
}

const logout=document.getElementById("logoutbutton")
logout.addEventListener("click",()=>{
    localStorage.removeItem("token")
    window.location.href="login.html"
})

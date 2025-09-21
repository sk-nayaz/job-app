let jobs = [];

async function loadJobs() {
  try {
    const res = await fetch("https://jsonfakery.com/jobs");
    const data = await res.json();

    jobs = data.map(item => ({
      id: item.id,
      title: item.job_title || item.title,
      company: item.company_name || item.company,
      location: item.job_location || item.location,
      type: item.job_type || item.type,
      salary: item.salary || "N/A",
      description: item.description || "No description available"
    }));

    renderJobs(jobs);
    populateTypeFilter(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}

function renderJobs(list) {
  const container = document.getElementById("jobs-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  list.forEach(job => {
    const div = document.createElement("div");
    div.className = "job-card";
    div.innerHTML = `
      <h3>${job.title}</h3>
      <p><b>Company:</b> ${job.company}</p>
      <p><b>Location:</b> ${job.location}</p>
      <p><b>Type:</b> ${job.type || "Undefined"}</p>
      <p><b>Salary:</b> ${job.salary}</p>
      <button class="apply-btn" data-id="${job.id}">Apply</button>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".apply-btn").forEach(btn => {
    btn.addEventListener("click", () => openApplyForm(btn.dataset.id));
  });
}

document.getElementById("search-name").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  const filtered = jobs.filter(j => j.title.toLowerCase().includes(val));
  renderJobs(filtered);
});

function populateTypeFilter(jobs) {
  const typeSelect = document.getElementById("job-type");
  const types = [...new Set(jobs.map(j => j.type || "Undefined"))];

  typeSelect.innerHTML = '<option value="">All Types</option>';

  types.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    typeSelect.appendChild(opt);
  });
}

document.getElementById("job-type").addEventListener("change", e => {
  const val = e.target.value;
  const filtered = val ? jobs.filter(j => (j.type || "Undefined") === val) : jobs;
  renderJobs(filtered);
});

// MODAL HANDLING
const modal = document.getElementById("apply-modal");
const closeBtn = document.querySelector(".close-btn");
const applyForm = document.getElementById("apply-form");

function openApplyForm(jobId) {
  modal.style.display = "flex";
  document.getElementById("apply-job-id").value = jobId;
}

function closeApplyForm() {
  modal.style.display = "none";
}

closeBtn.addEventListener("click", closeApplyForm);
window.addEventListener("click", e => {
  if (e.target === modal) closeApplyForm();
});

applyForm.addEventListener("submit", e => {
  e.preventDefault();

  const application = {
    jobId: document.getElementById("apply-job-id").value,
    name: document.getElementById("applicant-name").value,
    email: document.getElementById("applicant-email").value,
    message: document.getElementById("applicant-message").value,
    appliedAt: new Date().toISOString()
  };

  const saved = JSON.parse(localStorage.getItem("applications")) || [];
  saved.push(application);
  localStorage.setItem("applications", JSON.stringify(saved));

  alert("Application submitted successfully!");
  closeApplyForm();
  applyForm.reset();
});

document.addEventListener("DOMContentLoaded", loadJobs);

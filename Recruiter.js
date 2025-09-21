let jobs = []

async function loadJobs() {
  try {
    let res = await fetch("https://jsonfakery.com/jobs");
    let data = await res.json()
    jobs = data.map(item => ({
      id: item.id,
      title: item.job_title || item.title,
      company: item.company_name || item.company,
      location: item.job_location || item.location,
      type: item.job_type || item.type,
      salary: item.salary || "N/A",
      description: item.description || "",
      date: item.posted_date || new Date().toISOString()
    }))
    let saved = JSON.parse(localStorage.getItem("myJobs")) || []
    jobs = [...jobs, ...saved]
    renderJobs(jobs)
  } catch (e) {
    console.log("Error loading jobs", e)
  }
}

function renderJobs(list) {
  let container = document.getElementById("jobs-list")
  container.innerHTML = ""
  list.forEach(job => {
    let div = document.createElement("div")
    div.className = "job-card"
    div.innerHTML = `
      <h3>${job.title}</h3>
      <p><b>Company:</b> ${job.company}</p>
      <p><b>Location:</b> ${job.location}</p>
      <p><b>Type:</b> ${job.type}</p>
      <p><b>Salary:</b> ${job.salary}</p>
      <p>${job.description}</p>
      <button onclick="editJob('${job.id}')">Edit</button>
      <button onclick="deleteJob('${job.id}')">Delete</button>
    `
    container.appendChild(div)
  })
}

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault()
  let id = document.getElementById("job-id").value
  let job = {
    id: id || Date.now().toString(),
    title: document.getElementById("title").value,
    company: document.getElementById("company").value,
    location: document.getElementById("location").value,
    type: document.getElementById("type").value,
    salary: document.getElementById("salary").value,
    description: document.getElementById("description").value,
    date: new Date().toISOString()
  }
  if (id) {
    let idx = jobs.findIndex(j => j.id == id)
    jobs[idx] = job
  } else {
    jobs.push(job)
  }
  localStorage.setItem("myJobs", JSON.stringify(jobs.filter(j => !String(j.id).includes("-"))))
  renderJobs(jobs)
  document.getElementById("form").reset()
  document.getElementById("job-id").value = ""
  document.getElementById("submit-btn").textContent = "Add Job"
  document.getElementById("cancel-btn").style.display = "none"
})

function editJob(id) {
  let job = jobs.find(j => j.id == id)
  document.getElementById("job-id").value = job.id
  document.getElementById("title").value = job.title
  document.getElementById("company").value = job.company
  document.getElementById("location").value = job.location
  document.getElementById("type").value = job.type
  document.getElementById("salary").value = job.salary
  document.getElementById("description").value = job.description
  document.getElementById("submit-btn").textContent = "Update Job"
  document.getElementById("cancel-btn").style.display = "inline"
}

function deleteJob(id) {
  jobs = jobs.filter(j => j.id != id)
  localStorage.setItem("myJobs", JSON.stringify(jobs.filter(j => !String(j.id).includes("-"))))
  renderJobs(jobs)
}

document.getElementById("cancel-btn").addEventListener("click", function () {
  document.getElementById("form").reset()
  document.getElementById("job-id").value = ""
  document.getElementById("submit-btn").textContent = "Add Job"
  this.style.display = "none"
})

document.getElementById("sort-select").addEventListener("change", function () {
  let val = this.value
  let sorted = [...jobs]
  if (val === "date_desc") sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
  if (val === "date_asc") sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
  if (val === "title_asc") sorted.sort((a, b) => a.title.localeCompare(b.title))
  if (val === "title_desc") sorted.sort((a, b) => b.title.localeCompare(a.title))
  if (val === "salary_asc") sorted.sort((a, b) => (parseInt(a.salary) || 0) - (parseInt(b.salary) || 0))
  if (val === "salary_desc") sorted.sort((a, b) => (parseInt(b.salary) || 0) - (parseInt(a.salary) || 0))
  renderJobs(sorted)
})

document.addEventListener("DOMContentLoaded", loadJobs)

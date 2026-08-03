
  // ==========================================
// CareerFlow Job Application Tracker
// ==========================================

// Load applications from localStorage
let applications = JSON.parse(localStorage.getItem("applications")) || [];

// Track the application currently being edited
let editingId = null;

// ==========================================
// Save Applications
// ==========================================
function saveApplications() {
    localStorage.setItem("applications", JSON.stringify(applications));
}

// ==========================================
// Get Form Values
// ==========================================
function getFormValues() {
    return {
        company: document.getElementById("company").value.trim(),
        jobTitle: document.getElementById("jobTitle").value.trim(),
        location: document.getElementById("location").value.trim(),
        salary: document.getElementById("salary").value.trim(),
        date: document.getElementById("date").value,
        deadline: document.getElementById("deadline").value,
        interviewDate: document.getElementById("interviewDate").value,
        website: document.getElementById("website").value.trim(),
        jobLink: document.getElementById("jobLink").value.trim(),
        recruiter: document.getElementById("recruiter").value.trim(),
        recruiterEmail: document.getElementById("recruiterEmail").value.trim(),
        priority: document.getElementById("priority").value,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value.trim()
    };
}

// ==========================================
// Form Validation
// ==========================================
function validateApplication(data) {

    if (
        data.company === "" ||
        data.jobTitle === "" ||
        data.location === "" ||
        data.date === ""
    ) {
        return false;
    }

    return true;
}

// ==========================================
// Add / Update Application
// ==========================================
const form = document.getElementById("applicationForm");

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const message = document.getElementById("message");

        const data = getFormValues();

        if (!validateApplication(data)) {

            message.style.color = "red";
            message.textContent =
                "Please complete all required fields.";

            return;
        }

        if (editingId === null) {

            data.id = Date.now();

            applications.push(data);

            message.style.color = "green";
            message.textContent =
                "Application saved successfully.";

        } else {

            const index = applications.findIndex(
                app => app.id === editingId
            );

            if (index !== -1) {

                data.id = editingId;

                applications[index] = data;

                message.style.color = "green";
                message.textContent =
                    "Application updated successfully.";
            }

            editingId = null;
        }

        saveApplications();

        displayApplications();

        updateStatistics();

        form.reset();

    });

}
// ==========================================
// Display Applications
// ==========================================

function displayApplications() {

    const container = document.getElementById("applicationsContainer");

    if (!container) return;

    container.innerHTML = "";

    const search =
        document.getElementById("searchInput")?.value.toLowerCase() || "";

    const filter =
        document.getElementById("filterStatus")?.value || "All";

    const filtered = applications.filter(app => {

        const matchesSearch =
            app.company.toLowerCase().includes(search) ||
            app.jobTitle.toLowerCase().includes(search);

        const matchesStatus =
            filter === "All" || app.status === filter;

        return matchesSearch && matchesStatus;

    });

    if (filtered.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No applications found.
            </p>
        `;

        return;
    }

    filtered.forEach(application => {

        const today = new Date().toISOString().split("T")[0];

        let deadline = "Not specified";

        if (application.deadline) {

            if (application.deadline < today) {

                deadline = `
                    <span style="color:red;font-weight:bold;">
                        ${application.deadline} (Expired)
                    </span>
                `;

            } else {

                deadline = application.deadline;

            }

        }

        const card = document.createElement("div");

        card.className = "application-card";

        card.innerHTML = `

        <h2>${application.company}</h2>

        <p><strong>Job Title:</strong> ${application.jobTitle}</p>

        <p><strong>Location:</strong> ${application.location}</p>

        <p><strong>Salary:</strong> ${application.salary || "Not specified"}</p>

        <p><strong>Date Applied:</strong> ${application.date}</p>

        <p><strong>Application Deadline:</strong> ${deadline}</p>

        <p><strong>Interview Date:</strong> ${application.interviewDate || "Not scheduled"}</p>

        <p><strong>Status:</strong> ${application.status}</p>

        <p><strong>Priority:</strong> ${application.priority}</p>

        <p><strong>Recruiter:</strong> ${application.recruiter || "Not provided"}</p>

        <p><strong>Email:</strong> ${application.recruiterEmail || "Not provided"}</p>

        <p><strong>Website:</strong>
        ${
            application.website
            ? `<a href="${application.website}" target="_blank">Visit Website</a>`
            : "Not provided"
        }
        </p>

        <p><strong>Job Link:</strong>
        ${
            application.jobLink
            ? `<a href="${application.jobLink}" target="_blank">Open Job</a>`
            : "Not provided"
        }
        </p>

        <p><strong>Notes:</strong></p>

        <p>${application.notes || "No notes added."}</p>

        <div class="card-buttons">

            <button
                class="edit-btn"
                onclick="editApplication(${application.id})">
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteApplication(${application.id})">
                Delete
            </button>

        </div>

        `;

        container.appendChild(card);

    });

}

// ==========================================
// Edit Application
// ==========================================

function editApplication(id) {

    const app = applications.find(item => item.id === id);

    if (!app) return;

    editingId = id;

    document.getElementById("company").value = app.company;
    document.getElementById("jobTitle").value = app.jobTitle;
    document.getElementById("location").value = app.location;
    document.getElementById("salary").value = app.salary;
    document.getElementById("date").value = app.date;
    document.getElementById("deadline").value = app.deadline;
    document.getElementById("interviewDate").value = app.interviewDate;
    document.getElementById("website").value = app.website;
    document.getElementById("jobLink").value = app.jobLink;
    document.getElementById("recruiter").value = app.recruiter;
    document.getElementById("recruiterEmail").value = app.recruiterEmail;
    document.getElementById("priority").value = app.priority;
    document.getElementById("status").value = app.status;
    document.getElementById("notes").value = app.notes;

    window.location.href = "add.html";

}

// ==========================================
// Delete Application
// ==========================================

function deleteApplication(id) {

    if (!confirm("Delete this application?")) return;

    applications = applications.filter(app => app.id !== id);

    saveApplications();

    displayApplications();

    updateStatistics();

}

// ==========================================
// Search & Filter
// ==========================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", displayApplications);
}

const filterStatus = document.getElementById("filterStatus");

if (filterStatus) {
    filterStatus.addEventListener("change", displayApplications);
}
// ==========================================
// Dashboard Statistics
// ==========================================

function updateStatistics() {

    const total = document.getElementById("totalApplications");
    const interviews = document.getElementById("interviewCount");
    const offers = document.getElementById("offerCount");

    if (total) {
        total.textContent = applications.length;
    }

    if (interviews) {

        const interviewCount = applications.filter(app =>
            app.status === "Interview"
        ).length;

        interviews.textContent = interviewCount;
    }

    if (offers) {

        const offerCount = applications.filter(app =>
            app.status === "Offer"
        ).length;

        offers.textContent = offerCount;
    }

}

// ==========================================
// Clear All Applications
// ==========================================

function clearApplications() {

    if (!confirm("Delete ALL applications?")) {
        return;
    }

    applications = [];

    saveApplications();

    displayApplications();

    updateStatistics();

    alert("All applications have been deleted.");

}

// ==========================================
// Initialize Pages
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    displayApplications();

    updateStatistics();

});
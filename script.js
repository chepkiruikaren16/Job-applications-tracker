/* ==========================================
   JOB APPLICATIONS TRACKER
   SCRIPT.JS - PART 1
========================================== */

// =======================
// Local Storage
// =======================

let applications = JSON.parse(localStorage.getItem("applications")) || [];

function saveApplications() {
    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );
}

// =======================
// Form
// =======================

const form = document.getElementById("applicationForm");

if (form) {

    let editId = localStorage.getItem("editId");

    if (editId) {

        const app = applications.find(
            item => item.id == editId
        );

        if (app) {

            document.getElementById("company").value = app.company || "";
            document.getElementById("position").value = app.position || "";
            document.getElementById("location").value = app.location || "";
            document.getElementById("salary").value = app.salary || "";
            document.getElementById("applicationDate").value = app.applicationDate || "";
            document.getElementById("applicationDeadline").value = app.applicationDeadline || "";
            document.getElementById("interviewDate").value = app.interviewDate || "";
            document.getElementById("status").value = app.status || "";
            document.getElementById("notes").value = app.notes || "";

        }

    }

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const application = {

            id: editId ? Number(editId) : Date.now(),

            company: document.getElementById("company").value.trim(),

            position: document.getElementById("position").value.trim(),

            location: document.getElementById("location").value.trim(),

            salary: document.getElementById("salary").value.trim(),

            applicationDate: document.getElementById("applicationDate").value,

            applicationDeadline: document.getElementById("applicationDeadline").value,

            interviewDate: document.getElementById("interviewDate").value,

            status: document.getElementById("status").value,

            notes: document.getElementById("notes").value.trim()

        };

        // Required fields

        if (
            application.company === "" ||
            application.position === "" ||
            application.applicationDate === "" ||
            application.applicationDeadline === "" ||
            application.status === ""
        ) {

            alert("Please fill in all required fields.");
            return;

        }

        // Date validation

        const appDate = new Date(application.applicationDate);
        const deadline = new Date(application.applicationDeadline);

        const minYear = 2020;
        const maxYear = 2035;

        if (
            appDate.getFullYear() < minYear ||
            appDate.getFullYear() > maxYear
        ) {

            alert("Application date must be between 2020 and 2035.");
            return;

        }

        if (
            deadline.getFullYear() < minYear ||
            deadline.getFullYear() > maxYear
        ) {

            alert("Application deadline must be between 2020 and 2035.");
            return;

        }

        if (deadline < appDate) {

            alert("Application deadline cannot be before the application date.");
            return;

        }

        if (application.interviewDate !== "") {

            const interview = new Date(application.interviewDate);

            if (
                interview.getFullYear() < minYear ||
                interview.getFullYear() > maxYear
            ) {

                alert("Interview date must be between 2020 and 2035.");
                return;

            }

            if (interview < appDate) {

                alert("Interview date cannot be before the application date.");
                return;

            }

        }
               // Save or update application

        if (editId) {

            applications = applications.map(item =>
                item.id == editId ? application : item
            );

        } else {

            applications.push(application);

        }

        saveApplications();

        localStorage.removeItem("editId");

        alert("Application saved successfully!");

        form.reset();

        window.location.href = "applications.html";

    });

}

// ==========================================
// Applications List
// ==========================================

const applicationList = document.getElementById("applicationList");

function displayApplications() {

    if (!applicationList) {
        return;
    }

    applicationList.innerHTML = "";

    if (applications.length === 0) {

        applicationList.innerHTML =
            "<h3 class='empty-message'>No applications added yet.</h3>";

        return;
    }

    applications.forEach(app => {

        const card = document.createElement("div");

        card.className = "application-card";

        card.innerHTML = `

            <h3>${app.position}</h3>

            <p><strong>Company:</strong> ${app.company}</p>

            <p><strong>Location:</strong> ${app.location || "Not provided"}</p>

            <p><strong>Salary:</strong> ${app.salary || "Not provided"}</p>

            <p><strong>Application Date:</strong> ${app.applicationDate}</p>

            <p><strong>Deadline:</strong> ${app.applicationDeadline}</p>

            <p><strong>Interview:</strong> ${app.interviewDate || "Not scheduled"}</p>

            <p><strong>Status:</strong> ${app.status}</p>

            <p><strong>Notes:</strong> ${app.notes || "No notes"}</p>

            <div class="card-buttons">

                <button
                    class="edit-btn"
                    onclick="editApplication(${app.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteApplication(${app.id})">
                    Delete
                </button>

            </div>

        `;

        applicationList.appendChild(card);

    });

}
// ==========================================
// Edit Application
// ==========================================

function editApplication(id) {

    localStorage.setItem("editId", id);

    // Make sure this matches your actual filename
    window.location.href = "add-application.html";
}

// ==========================================
// Delete Application
// ==========================================

function deleteApplication(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) {
        return;
    }

    applications = applications.filter(app => app.id !== id);

    saveApplications();

    displayApplications();

    updateDashboard();

}

// ==========================================
// Dashboard
// ==========================================

function updateDashboard() {

    const total = document.getElementById("totalApplications");
    const interviews = document.getElementById("interviews");
    const offers = document.getElementById("offers");
    const rejected = document.getElementById("rejections");

    if (total) {
        total.textContent = applications.length;
    }

    if (interviews) {

        interviews.textContent = applications.filter(
            app => app.status === "Interview Scheduled"
        ).length;

    }

    if (offers) {

        offers.textContent = applications.filter(
            app => app.status === "Offer Received"
        ).length;

    }

    if (rejected) {

        rejected.textContent = applications.filter(
            app => app.status === "Rejected"
        ).length;

    }

}

// ==========================================
// Search
// ==========================================

const search = document.getElementById("search");

if (search) {

    search.addEventListener("input", function () {

        const value = search.value.toLowerCase();

        const filtered = applications.filter(app =>

            app.company.toLowerCase().includes(value) ||

            app.position.toLowerCase().includes(value) ||

            app.status.toLowerCase().includes(value)

        );

        applicationList.innerHTML = "";

        if (filtered.length === 0) {

            applicationList.innerHTML =
                "<h3 class='empty-message'>No matching applications found.</h3>";

            return;
        }

        filtered.forEach(app => {

            const card = document.createElement("div");

            card.className = "application-card";

            card.innerHTML = `

                <h3>${app.position}</h3>

                <p><strong>Company:</strong> ${app.company}</p>

                <p><strong>Status:</strong> ${app.status}</p>

                <p><strong>Application Date:</strong> ${app.applicationDate}</p>

                <button
                    class="edit-btn"
                    onclick="editApplication(${app.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteApplication(${app.id})">
                    Delete
                </button>

            `;

            applicationList.appendChild(card);

        });

    });

}

// ==========================================
// Load Page
// ==========================================

displayApplications();

updateDashboard();

console.log("Job Applications Tracker Loaded Successfully"); 
// Default Notices Data
const initialNotices = [
    {
        id: 1,
        title: "End Semester Examination Schedule",
        category: "Exam",
        department: "Examination Cell",
        priority: "Urgent",
        date: "2026-03-25",
        content: "The final timetable for Spring 2026 End Semester Examinations has been published. All students are advised to check their respective student portals."
    },
    {
        id: 2,
        title: "Annual Sports Meet Registration",
        category: "Sports",
        department: "Physical Education",
        priority: "Normal",
        date: "2026-03-22",
        content: "Registrations for track and field events are open. Submit your names to your department sports coordinator by April 5th."
    },
    {
        id: 3,
        title: "Campus Wi-Fi Upgrade Maintenance",
        category: "General",
        department: "IT Infrastructure",
        priority: "Info",
        date: "2026-03-20",
        content: "Internet services will be temporarily unavailable on Sunday from 2:00 AM to 6:00 AM due to scheduled maintenance."
    },
    {
        id: 4,
        title: "AI & Future Tech Workshop",
        category: "Events",
        department: "Computer Science",
        priority: "Normal",
        date: "2026-03-18",
        content: "A 2-day hands-on workshop on Applied Machine Learning will be hosted in Seminar Hall B next week. Open to all branches."
    },
    {
        id: 5,
        title: "Tuition Fee Extension Notice",
        category: "Academic",
        department: "Accounts Office",
        priority: "Urgent",
        date: "2026-03-15",
        content: " The last date to pay the term tuition fees without a late fine has been extended to April 10th, 2026."
    },
    {
        id: 6,
        title: "Central Library Holiday Timings",
        category: "General",
        department: "Library Administration",
        priority: "Info",
        date: "2026-03-10",
        content: "The Central Library will remain open 24/7 starting next Monday to support students preparing for upcoming mid-term tests."
    }
];

function getNotices() {
    const data = localStorage.getItem("campus_notices");
    if (!data) {
        localStorage.setItem("campus_notices", JSON.stringify(initialNotices));
        return initialNotices;
    }
    return JSON.parse(data);
}

function saveNotices(notices) {
    localStorage.setItem("campus_notices", JSON.stringify(notices));
}

let currentCategory = "All";
let currentSearch = "";

function getBadge(priority) {
    const p = priority.toLowerCase();
    return `<span class="badge badge-${p}">${priority}</span>`;
}

function renderNoticesUI() {
    const container = document.getElementById("noticesContainer");
    if (!container) return;

    const notices = getNotices();
    const filtered = notices.filter(n => {
        const matchesCategory = currentCategory === "All" || n.category === currentCategory;
        const matchesSearch = n.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
            n.content.toLowerCase().includes(currentSearch.toLowerCase()) ||
            n.department.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No notices found matching your criteria.</p>`;
        return;
    }

    container.innerHTML = filtered.map(notice => `
    <div class="card">
      <div>
        <div class="card-header">
          ${getBadge(notice.priority)}
          <small style="color:var(--text-muted);">${notice.date}</small>
        </div>
        <div class="card-title">${notice.title}</div>
        <div class="card-meta"><i class="fa-solid fa-building"></i> ${notice.department} | <strong>${notice.category}</strong></div>
        <div class="card-content">${notice.content.substring(0, 110)}${notice.content.length > 110 ? '...' : ''}</div>
      </div>
      <button class="btn-secondary" style="width:100%; margin-top:0.5rem;" onclick="openNoticeModal(${notice.id})">Read Notice</button>
    </div>
  `).join('');
}

function openNoticeModal(id) {
    const notices = getNotices();
    const notice = notices.find(n => n.id === id);
    if (!notice) return;

    const modal = document.getElementById("noticeModal");
    if (!modal) return;

    document.getElementById("modalTitle").innerText = notice.title;
    document.getElementById("modalMeta").innerText = `${notice.department} • Posted on ${notice.date} • ${notice.category}`;
    document.getElementById("modalContent").innerText = notice.content;
    document.getElementById("modalBadge").innerHTML = getBadge(notice.priority);

    modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("noticeModal");
    if (modal) modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    const activeCountEl = document.getElementById("statActiveNotices");
    if (activeCountEl) {
        const notices = getNotices();
        activeCountEl.innerText = notices.length;

        const container = document.getElementById("noticesContainer");
        if (container && currentPath === "index.html") {
            const topNotices = notices.slice(0, 3);
            container.innerHTML = topNotices.map(notice => `
        <div class="card">
          <div class="card-header">
            ${getBadge(notice.priority)}
            <small style="color:var(--text-muted);">${notice.date}</small>
          </div>
          <div class="card-title">${notice.title}</div>
          <div class="card-meta">${notice.department}</div>
          <div class="card-content">${notice.content.substring(0, 90)}...</div>
          <button class="btn-secondary" onclick="openNoticeModal(${notice.id})">Read More</button>
        </div>
      `).join('');
        }
    }

    if (currentPath === "notices.html") {
        renderNoticesUI();

        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                currentSearch = e.target.value;
                renderNoticesUI();
            });
        }

        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentCategory = btn.getAttribute("data-category");
                renderNoticesUI();
            });
        });
    }

    const adminTableBody = document.getElementById("adminTableBody");
    if (adminTableBody) {
        if (sessionStorage.getItem("isAdmin") !== "true") {
            window.location.href = "admin-login.html";
            return;
        }
        renderAdminTable();
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const u = document.getElementById("username").value;
            const p = document.getElementById("password").value;

            if (u === "admin" && p === "admin123") {
                sessionStorage.setItem("isAdmin", "true");
                window.location.href = "admin-dashboard.html";
            } else {
                document.getElementById("loginError").innerText = "Invalid credentials. Use admin / admin123";
            }
        });
    }
});

function renderAdminTable() {
    const tableBody = document.getElementById("adminTableBody");
    if (!tableBody) return;

    const notices = getNotices();
    tableBody.innerHTML = notices.map(n => `
    <tr>
      <td><strong>${n.title}</strong></td>
      <td>${n.category}</td>
      <td>${n.department}</td>
      <td>${getBadge(n.priority)}</td>
      <td>${n.date}</td>
      <td>
        <button class="btn-danger" onclick="deleteNotice(${n.id})"><i class="fa-solid fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

function createNotice(e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const department = document.getElementById("department").value;
    const priority = document.getElementById("priority").value;
    const content = document.getElementById("content").value;
    const date = new Date().toISOString().split('T')[0];

    const notices = getNotices();
    const newNotice = {
        id: Date.now(),
        title,
        category,
        department,
        priority,
        date,
        content
    };

    notices.unshift(newNotice);
    saveNotices(notices);
    document.getElementById("addNoticeForm").reset();
    renderAdminTable();
}

function deleteNotice(id) {
    if (confirm("Are you sure you want to delete this notice?")) {
        let notices = getNotices();
        notices = notices.filter(n => n.id !== id);
        saveNotices(notices);
        renderAdminTable();
    }
}

function logoutAdmin() {
    sessionStorage.removeItem("isAdmin");
    window.location.href = "admin-login.html";
}
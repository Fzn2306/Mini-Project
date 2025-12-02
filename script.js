
const USERS_KEY = "lf_users";
const ITEMS_KEY = "lf_items";
const CURRENT_USER_KEY = "lf_currentUserId";


function loadUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function loadItems() {
    return JSON.parse(localStorage.getItem(ITEMS_KEY)) || [];
}

function getCurrentUser() {
    const id = localStorage.getItem(CURRENT_USER_KEY);
    return loadUsers().find(u => u.id === id);
}

function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "login.html";
}

function safe(text) {
    return String(text || "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    })[c]);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatTime(time) {
    return time || "Approx.";
}


document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    // ✅ PROTECT ONLY BOARD PAGE
    if (page === "board" && !getCurrentUser()) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("logoutBtn")?.addEventListener("click", logout);
    document.getElementById("typeFilter")?.addEventListener("change", applyFilters);
    document.getElementById("searchBox")?.addEventListener("input", applyFilters);

    applyFilters();
});


function applyFilters() {
    const type = document.getElementById("typeFilter").value;
    const search = document.getElementById("searchBox").value.toLowerCase();

    const items = loadItems();
    const users = loadUsers();

    let result = items.filter(item => {
        if (type !== "all" && item.type !== type) return false;

        const searchText = `${item.title} ${item.location} ${item.description}`.toLowerCase();
        return searchText.includes(search);
    });

    renderItems(result, users);
    updateStats(items);
}

function renderItems(items, users) {
    const container = document.getElementById("itemsList");
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = `<div class="empty-state">No matching items found.</div>`;
        return;
    }

    items.forEach(item => {
        const owner = users.find(u => u.id === item.userId);
        const badge = item.type === "lost" ? "lost" : "found";

        const div = document.createElement("div");
        div.className = "item-card";

        div.innerHTML = `
            <div>
                <div class="item-main-title">${safe(item.title)}</div>
                <div class="item-meta">
                    <span class="meta-tag">${safe(item.location)}</span>
                    <span>${formatDate(item.date)} · ${formatTime(item.time)}</span>
                </div>
                <p style="font-size:12px;margin-top:6px;">
                    ${safe(item.description)}
                </p>
            </div>
            <div style="text-align:right">
                <div class="badge ${badge}">${item.type.toUpperCase()}</div>
                <div class="timestamp">${owner ? safe(owner.name) : "Unknown"}</div>
                <div class="timestamp">Contact: ${safe(item.contact)}</div>
            </div>
        `;

        container.appendChild(div);
    });
}


function updateStats(items) {
    document.getElementById("totalCount").innerText = items.length;
    document.getElementById("lostCount").innerText =
        items.filter(i => i.type === "lost").length;
    document.getElementById("foundCount").innerText =
        items.filter(i => i.type === "found").length;
}

const navLinks = document.querySelectorAll('.nav-link');
const tabPanels = document.querySelectorAll('.tab-panel');
const postTabBtn = document.getElementById('goPost');

function activateTab(tabId) {
    tabPanels.forEach(tab => tab.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        activateTab(link.dataset.tab);
    });
});

postTabBtn.addEventListener('click', () => activateTab('tab-post'));

// IMAGE PREVIEW
const imageInput = document.getElementById("itemImage");
const previewBox = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        previewImg.src = e.target.result;
        previewBox.style.display = "block";
    };
    reader.readAsDataURL(file);
});

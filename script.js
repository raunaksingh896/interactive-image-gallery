
const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const photoCount = document.getElementById("photoCount");
const emptyMessage = document.getElementById("emptyMessage");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const imageCount = document.getElementById("imageCount");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const downloadBtn = document.getElementById("downloadBtn");

let currentFilter = "all";
let currentIndex = 0;
let visibleItems = [];

const savedItems = Array.from(galleryItems);

// Update the gallery when a filter or search is used
function filterGallery() {
    const searchText = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    galleryItems.forEach(function (item) {
        const title = item.querySelector("h3").textContent.toLowerCase();
        const description = item.querySelector(".photo-info p")
            .textContent.toLowerCase();
        const altText = item.querySelector("img").alt.toLowerCase();

        const matchesCategory =
            currentFilter === "all" ||
            item.dataset.category === currentFilter;

        const matchesSearch =
            title.includes(searchText) ||
            description.includes(searchText) ||
            altText.includes(searchText);

        const shouldShow = matchesCategory && matchesSearch;

        item.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount++;
        }
    });

    photoCount.textContent =
        visibleCount + (visibleCount === 1 ? " photo" : " photos");

    emptyMessage.hidden = visibleCount !== 0;
}

// Category filter buttons
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        currentFilter = button.dataset.filter;

        filterGallery();
    });
});

// Search photos by name
searchInput.addEventListener("input", filterGallery);

// Add or remove favorites
galleryItems.forEach(function (item) {
    const favoriteBtn = item.querySelector(".favorite-btn");

    favoriteBtn.addEventListener("click", function () {
        favoriteBtn.classList.toggle("favorited");

        const isFavorite = favoriteBtn.classList.contains("favorited");

        favoriteBtn.textContent = isFavorite ? "♥" : "♡";

        favoriteBtn.setAttribute(
            "aria-pressed",
            String(isFavorite)
        );
    });
});

// Open an image in the lightbox
function openLightbox(index) {
    currentIndex = index;
    showImage();

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeBtn.focus();
}

// Display the selected image
function showImage() {
    const item = visibleItems[currentIndex];
    const image = item.querySelector("img");
    const title = item.querySelector("h3").textContent;

    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    lightboxTitle.textContent = title;

    imageCount.textContent =
        (currentIndex + 1) + " / " + visibleItems.length;

    downloadBtn.href = image.src;
}

// Open images when their cards are clicked
galleryItems.forEach(function (item) {
    const photoButton = item.querySelector(".photo-button");

    photoButton.addEventListener("click", function () {
        visibleItems = savedItems.filter(function (photo) {
            return !photo.hidden;
        });

        const index = visibleItems.indexOf(item);

        if (index !== -1) {
            openLightbox(index);
        }
    });
});

// Move to the next image
function nextImage() {
    currentIndex++;

    if (currentIndex >= visibleItems.length) {
        currentIndex = 0;
    }

    showImage();
}

// Move to the previous image
function previousImage() {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = visibleItems.length - 1;
    }

    showImage();
}

// Close the lightbox
function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    lightboxImg.src = "";
    document.body.style.overflow = "";
}

nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", previousImage);
closeBtn.addEventListener("click", closeLightbox);

// Close when the dark background is clicked
lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard controls
document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    } else if (event.key === "ArrowRight") {
        nextImage();
    } else if (event.key === "ArrowLeft") {
        previousImage();
    }
});

// Set the initial photo count
filterGallery();

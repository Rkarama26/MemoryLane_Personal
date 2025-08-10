
function isUserLoggedIn() {
    const user = localStorage.getItem("user")
    if (!user) {
        window.location.href = 'login.html';

    }
}
isUserLoggedIn()

function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Function to display the profile icon with user's initial
window.addEventListener('DOMContentLoaded', () => {
    const profileIcon = document.getElementById("profileDropdown");
    const userData = localStorage.getItem("user");

    if (userData) {
        const user = JSON.parse(userData);
        const name = user?.name?.trim();
        const initial = name ? name.charAt(0).toUpperCase() : "?";
        profileIcon.textContent = initial;
    } else {
        profileIcon.textContent = "?";
        profileIcon.title = "Guest";
    }

    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html"; // Redirect to login
    });
});


// Overlay modal logic for upload form with animation
const uploadOverlay = document.getElementById('uploadOverlay');
const uploadModal = document.querySelector('.upload-modal');
document.getElementById('uploadIconButton').addEventListener('click', () => {
    uploadOverlay.classList.remove('d-none');
    // Force reflow to enable transition
    void uploadOverlay.offsetWidth;
    uploadOverlay.classList.add('active');
});
document.getElementById('closeUploadModal').addEventListener('click', () => {
    uploadOverlay.classList.remove('active');
    setTimeout(() => uploadOverlay.classList.add('d-none'), 350);
});
// Optional: close modal on overlay click (not on modal itself)
uploadOverlay.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        uploadOverlay.classList.remove('active');
        setTimeout(() => uploadOverlay.classList.add('d-none'), 350);
    }
});

// get location from browser
const locationInput = document.getElementById('location');
const Access_Token = "pk.6cf09d7bcc531813969719bec6356c22";
const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.id : null;
console.log("User ID:", userId);

//reverse gecoding to get location name
/*
document.getElementById('uploadIconButton').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async position => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);

                document.getElementById('latitude').value = lat;
                document.getElementById('longitude').value = lng;

                // Reverse geocoding to get location name
                const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${Access_Token}&lat=${lat}&lon=${lng}&format=json&`);
                const data = await response.json();

                const displayLocation = data.display_name || 'Unknown location';
                locationInput.value = displayLocation;

            },
            error => {
                console.log('Error getting location:', error);
                locationInput.placeholder = 'Enter location manually';
            });
    }
    else {
        locationInput.placeholder = 'Geolocation not supported';
    }
})
*/

document.getElementById('uploadIconButton').addEventListener('click', () => {
    const imagePath = getRandomPicsumUrl();
    document.getElementById('ImageUrl').value = imagePath;
});

function getRandomPicsumUrl() {
    const seed = Math.floor(Math.random() * 10000); // or use `Date.now()` for uniqueness
    const width = Math.floor(Math.random() * 401) + 200;
    const height = Math.floor(Math.random() * 401) + 200;
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}


// Base URL for Firebase Realtime Database
const baseUrl = "https://memory-lane-9e674-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Event listener for the upload form submission
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    let timestampValue = document.getElementById('timestampField').value;
    const timestamp = timestampValue ? new Date(timestampValue).getTime() : Date.now();
    const imageUrl = document.getElementById('ImageUrl').value;

    const memories = {
        userId: userId,
        imageUrl: imageUrl,
        tags: tags,
        location: locationInput.value,
        timestamp: timestamp
    };

    console.log("Memory Data:", memories);

    try {
        const response = await fetch(`${baseUrl}memories.json`, {
            method: 'POST',
            body: JSON.stringify(memories),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Upload successful:', result);
        alert('Memory uploaded successfully!');
        // Optionally, reset the form or redirect
        e.target.reset();
    } catch (error) {
        console.error('Error uploading memory:', error);
        alert('Failed to upload memory. Please try again.');
    }
})

// all memory objects in array
let memories = [];

// Function to fetch memories from the database
async function fetchMemories() {

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    try {
        let res = await fetch(`${baseUrl}memories.json`);
        let data = await res.json();
        //console.log(data);

        if (!data) {
            console.log("No memories found.");
            return;
        }

        const userMemories = Object.entries(data)
            .filter(([key, memory]) => memory.userId === userId)
            .map(([key, memory]) => ({ id: key, ...memory }));

        memories = userMemories;
        console.log("Memories:", memories);
        //  displayMemories(memories)
        memories.forEach(memory => {
            //  addImageToGallery(memory.imageUrl);
            renderMemories(memories);
        });

    } catch (error) {
        console.error('Error fetching memories:', error);
        return [];
    }
}

/*
function displayMemories(memories) {
    const timelineContainer = document.getElementById("timelineContainer");
    timelineContainer.innerHTML = ""; // Clear previous content

    if (memories.length === 0) {
        timelineContainer.innerHTML = "<p>No memories found.</p>";
        return;
    }

    memories.forEach(memory => {
        const memoryDiv = document.createElement("div");
        memoryDiv.classList.add("memory-card");

        memoryDiv.innerHTML = `
      <img src="${memory.imageUrl}" alt="Memory Image" style="width:100%; max-height:300px; object-fit:cover;">

    `;

        timelineContainer.appendChild(memoryDiv);
    });
}
*/

//image gallery ---------------------------
/*
function addImageToGallery(imageUrl) {
    const gallery = document.getElementById('gallery');

    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const content = document.createElement('div');
    content.className = 'content';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = "memory image";

    content.appendChild(img);
    galleryItem.appendChild(content);
    gallery.appendChild(galleryItem);

    // When image loads, adjust grid layout
    img.addEventListener('load', () => {
        const altura = getVal(gallery, 'grid-auto-rows');
        const gap = getVal(gallery, 'grid-row-gap');
        galleryItem.style.gridRowEnd = "span " + Math.ceil((getHeight(galleryItem) + gap) / (altura + gap));
        img.classList.remove('byebye');
    });
}
 */

// format timestamp
function formatMonthYear(timestamp) {
    const date = new Date(timestamp);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${monthName} ${year}`;
}

// Update tags in Firebase Patch request
async function updateTagsInDB(memoryId, newTags) {

    console.log("Updating tags for memory ID:", memoryId);
    if (!memoryId) throw new Error('No memory ID provided');
    const updateUrl = `${baseUrl}memories/${memoryId}.json`;
    const response = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tags: newTags })
    });
    if (!response.ok) {
        throw new Error('Failed to update tags in database');
    }
    return await response.json();
}

// render images and update tags
function renderMemories(memories) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing content

    // Sort memories by timestamp descending (newest first)
    memories.sort((a, b) => b.timestamp - a.timestamp);

    // Group by month of year
    const grouped = {};
    memories.forEach(memory => {
        const monthyear = formatMonthYear(memory.timestamp);
        if (!grouped[monthyear]) grouped[monthyear] = [];
        grouped[monthyear].push(memory);
    });

    // Sort month-year keys by actual date
    const sortedMonthYears = Object.keys(grouped).sort((a, b) => {
        return new Date(a) - new Date(b); // Ascending; swap for descending
    });

    // Render each month in sorted order
    sortedMonthYears.forEach(monthYear => {
        const section = document.createElement('div');
        section.className = 'month-section';
        section.setAttribute('data-monthyear', monthYear);

        // Header
        const header = document.createElement('h2');
        header.textContent = monthYear;
        section.appendChild(header);

        // Image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'month-images';
        section.appendChild(imageContainer);

        // Images
        grouped[monthYear].forEach(memory => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const content = document.createElement('div');
            content.className = 'content';

            const img = document.createElement('img');
            img.src = memory.imageUrl;
            img.alt = "memory image";
            const tagOverlay = document.createElement('div');
            tagOverlay.className = 'tag-overlay';

            // Create span to show tags text
            const tagText = document.createElement('span');
            tagText.textContent = memory.tags ? memory.tags.join(', ') : 'No Tags';

            // Create edit icon
            const editIcon = document.createElement('span');
            editIcon.className = 'edit-icon';
            editIcon.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg"  width="14" height="14" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
</svg>`;
            editIcon.title = 'Edit tags';

            // Add click event for editing tags
            editIcon.addEventListener('click', () => {
                if (content.querySelector('input.edit-input')) return;

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'edit-input';
                input.value = memory.tags ? memory.tags.join(', ') : '';
                input.style.width = '100%';

                tagOverlay.style.display = 'none';
                content.appendChild(input);
                input.focus();

                // Handler for blur (just remove input, don't save)
                const blurHandler = () => {
                    tagOverlay.style.display = 'block';
                    if (input.parentNode) input.parentNode.removeChild(input);
                };
                input.addEventListener('blur', blurHandler);

                input.addEventListener('keydown', async (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        input.removeEventListener('blur', blurHandler); // Prevent double remove
                        const newTags = input.value.split(',').map(t => t.trim()).filter(t => t);
                        tagText.textContent = newTags.join(', ') || 'No Tags';
                        tagOverlay.style.display = 'block';
                        if (input.parentNode) input.parentNode.removeChild(input);
                        try {
                            await updateTagsInDB(memory.id, newTags);
                            memory.tags = newTags;
                            console.log('Tags updated successfully!');
                        } catch (error) {
                            console.error("Error updating tags. Please try again.", error);
                        }
                    }
                });
            });

            // Append text and icon to overlay
            tagOverlay.appendChild(tagText);
            tagOverlay.appendChild(editIcon);
            content.appendChild(img);
            content.appendChild(tagOverlay);
            galleryItem.appendChild(content);
            imageContainer.appendChild(galleryItem);

            img.addEventListener('load', () => {
                const altura = getVal(imageContainer, 'grid-auto-rows');
                const gap = getVal(imageContainer, 'grid-row-gap');
                galleryItem.style.gridRowEnd = "span " +
                    Math.ceil((getHeight(galleryItem) + gap) / (altura + gap));
                img.classList.remove('byebye');
            });
        });
        gallery.appendChild(section);
    });
}




function openLightbox(img) {
    document.getElementById("lightbox").style.display = "block";
    document.getElementById("lightbox-img").src = img.src;
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

// Utility functions
var gallery = document.querySelector('#gallery');

var getVal = function (elem, style) {
    return parseInt(window.getComputedStyle(elem).getPropertyValue(style));
};

var getHeight = function (item) {
    return item.querySelector('.content').getBoundingClientRect().height;
};

var resizeAll = function () {
    var altura = getVal(gallery, 'grid-auto-rows');
    var gap = getVal(gallery, 'grid-row-gap');
    gallery.querySelectorAll('.gallery-item').forEach(function (item) {
        var el = item;
        el.style.gridRowEnd = "span " + Math.ceil((getHeight(item) + gap) / (altura + gap));
    });
};

// Handle image loading and initial grid layout
gallery.querySelectorAll('img').forEach(function (item) {
    item.classList.add('byebye');

    if (item.complete) {
        item.classList.remove('byebye');
    } else {
        item.addEventListener('load', function () {
            var altura = getVal(gallery, 'grid-auto-rows');
            var gap = getVal(gallery, 'grid-row-gap');
            var gitem = item.closest('.gallery-item');
            gitem.style.gridRowEnd = "span " + Math.ceil((getHeight(gitem) + gap) / (altura + gap));
            item.classList.remove('byebye');
        });
    }
});

// Resize handler
window.addEventListener('resize', resizeAll);

// Lightbox click handler
// Lightbox click handler using event delegation
gallery.addEventListener('click', function (e) {
    const galleryItem = e.target.closest('.gallery-item');
    if (!galleryItem) return;

    galleryItem.classList.toggle('full');

    if (galleryItem.classList.contains('full')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});


// ESC key to close fullscreen
document.addEventListener('keydown', function (e) {
    if (e.key === "Escape") {
        const fullItem = document.querySelector('.gallery-item.full');
        if (fullItem) {
            fullItem.classList.remove('full');
            document.body.style.overflow = '';
        }
    }
});


fetchMemories()

//toggle bt sections 
function switchSection(sectionId) {
    console.log(sectionId)
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

window.addEventListener('DOMContentLoaded', () => {
    switchSection('gallery');
});

// Filter and display images by tags from search input
function filterMemoriesByTag(searchTerm) {
    if (!Array.isArray(memories)) return;
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
        renderMemories(memories);
        return;
    }
    const filtered = memories.filter(memory =>
        Array.isArray(memory.tags) && memory.tags.some(tag => tag.toLowerCase().includes(term))
    );
    renderMemories(filtered);
}

// event listener to search bar
window.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterMemoriesByTag(e.target.value);
        });
    }
});
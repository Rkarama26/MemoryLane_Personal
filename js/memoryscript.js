
function isUserLoggedIn() {
    const user = localStorage.getItem("user")
    if (!user) {
        window.location.href = 'login.html';

    }
}
isUserLoggedIn()

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

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

document.getElementById('uploadIconButton').addEventListener('click', toggleUploadForm);

function toggleUploadForm() {
    const form = document.getElementById('uploadFormContainer');
    form.classList.toggle('d-none');
}

// get location from browser
const locationInput = document.getElementById('location');
const Access_Token = "pk.6cf09d7bcc531813969719bec6356c22";
const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.id : null;
console.log("User ID:", userId);

//reverse gecoding to get location name
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


// Base URL for Firebase Realtime Database
const baseUrl = "https://memory-lane-9e674-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Event listener for the upload form submission
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const imageUrl = document.getElementById('ImageUrl').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const dateInput = document.getElementById('timestampField').value;
    const timestamp = dateInput ? new Date(dateInput).getTime() : Date.now();

    const memories = {
        userId: userId,
        imageUrl: imageUrl,
        tags: tags,
        location: locationInput.value,
        timestamp: Date.now()
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
    } catch (error) {
        console.error('Error fetching memories:', error);
        return [];
    }
}


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

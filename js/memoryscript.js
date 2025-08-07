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
/*
window.addEventListener('DOMContentLoaded', () => {
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
const baseUrl = "https://memory-lane-9e674-default-rtdb.asia-southeast1.firebasedatabase.app/"
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append('userId', userId);
    console.log("Form Data:", formData);

    // Get the voice note file
    const voiceNoteInput = document.getElementById('voiceNote');
    if (voiceNoteInput.files.length > 0) {
        formData.append('voiceNote', voiceNoteInput.files[0]);
    }

    try {
        const response = await fetch(`${baseUrl}memories.json`, {
            method: 'POST',
            body: formData
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
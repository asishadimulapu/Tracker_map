// Ensure this script is loaded after the necessary libraries (Leaflet and Socket.IO) and HTML elements are ready

// Initialize Socket.IO
const socket = io();

// Initialize the Leaflet map and set initial view
const map = L.map('map').setView([0, 0], 15);

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create a marker to represent the user's live location
let liveMarker = L.marker([0, 0]).addTo(map);

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Emit the location data to the server
            socket.emit('send', { latitude, longitude });

            // Update the live marker's position and map view
            liveMarker.setLatLng([latitude, longitude]);
            map.setView([latitude, longitude], 10);
        },
        (error) => {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location. Please try again.');
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Object to store markers for other users
const markers = {};

// Handle receiving location updates from the server
socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

    // Optionally, adjust the map view to include new marker
    // map.setView([latitude, longitude], 10);
});

/**
 * Birthday Greeting Page Script
 * Handles message display, animations, and dynamic content loading.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements Cache
    const elements = {
        birthdayText: document.getElementById('birthday-text'),
        friendName: document.getElementById('friend-name'),
        photoPlaceholder: document.getElementById('photo-placeholder'),
        dateDisplay: document.getElementById('date-display'),
        revealButton: document.getElementById('reveal-button'),
        messageModal: document.getElementById('message-modal'),
        birthdayMessage: document.getElementById('birthday-message'),
        closeButton: document.querySelector('.modal .close'), // More specific selector
        modalImage: document.querySelector('.modal .card-left img') // Added for dynamic image
    };

    // --- Configuration Loading ---

    /**
     * Loads configuration from URL parameters or uses defaults.
     * URL parameters: ?name=...&message=...&photo=...&date=...
     */
    function loadConfig() {
        const urlParams = new URLSearchParams(window.location.search);

        const name = urlParams.get('name') || "My Dearest Friend"; // Default name
        const message = urlParams.get('message') || "Wishing you a fantastic birthday filled with joy, laughter, and unforgettable moments! May this year bring you everything you wish for."; // Default message
        const photoUrl = urlParams.get('photo'); // No default photo, use placeholder
        const dateStr = urlParams.get('date'); // Expected format: YYYY-MM-DD

        // Update DOM elements
        if (elements.friendName) {
            elements.friendName.textContent = name;
        }
        if (elements.birthdayMessage) {
            elements.birthdayMessage.textContent = message;
        }
        if (elements.photoPlaceholder && photoUrl) {
            elements.photoPlaceholder.src = photoUrl;
            elements.photoPlaceholder.alt = `${name}'s Photo`;
        }
        // Also update the modal image if a photo is provided
        if (elements.modalImage && photoUrl) {
            elements.modalImage.src = photoUrl;
            elements.modalImage.alt = `Celebration for ${name}`;
        } else if (elements.modalImage) {
             // Use a default celebration image if no photo provided
             elements.modalImage.src = 'https://via.placeholder.com/150/FFC0CB/808080?text=Celebrate!';
             elements.modalImage.alt = 'Celebration Image';
        }


        // Display the date
        if (elements.dateDisplay) {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            elements.dateDisplay.textContent = `Today is ${formattedDate}`;

            // Optional: Highlight if today is the specified birthday
            if (dateStr) {
                try {
                    const birthDate = new Date(dateStr + 'T00:00:00'); // Ensure correct date parsing
                    if (today.getFullYear() === birthDate.getFullYear() &&
                        today.getMonth() === birthDate.getMonth() &&
                        today.getDate() === birthDate.getDate()) {
                        elements.dateDisplay.textContent += " - It's your special day!";
                        elements.dateDisplay.style.fontWeight = 'bold';
                        elements.dateDisplay.style.color = '#ff4081';
                    }
                } catch (e) {
                    console.error("Error parsing date:", dateStr, e);
                    // Don't display date if invalid
                     elements.dateDisplay.textContent = '';
                }
            } else {
                 elements.dateDisplay.textContent = ''; // Hide if no date provided
            }
        }
    }

    // --- Modal Functionality ---

    /**
     * Opens the message modal.
     */
    function openModal() {
        if (elements.messageModal) {
            elements.messageModal.style.display = 'block';
        }
    }

    /**
     * Closes the message modal.
     */
    function closeModal() {
        if (elements.messageModal) {
            elements.messageModal.style.display = 'none';
        }
    }

    // --- Event Listeners ---

    // Reveal button click
    if (elements.revealButton) {
        elements.revealButton.addEventListener('click', openModal);
    }

    // Close button click
    if (elements.closeButton) {
        elements.closeButton.addEventListener('click', closeModal);
    }

    // Close modal if clicked outside the content area
    window.addEventListener('click', (event) => {
        if (event.target === elements.messageModal) {
            closeModal();
        }
    });

    // Close modal on 'Escape' key press
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && elements.messageModal && elements.messageModal.style.display === 'block') {
            closeModal();
        }
    });

    // --- Initialization ---
    loadConfig(); // Load name, message, photo, date on page load

    // Add a small animation to the title on load
    if (elements.birthdayText) {
        elements.birthdayText.style.animation = 'pulse 1.5s ease-in-out';
    }

}); // End DOMContentLoaded

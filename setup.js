/**
 * Birthday Greeting Setup Script
 * Handles form input, preview generation, and link creation.
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements Cache
    const elements = {
        friendNameInput: document.getElementById('friend-name-input'),
        messageInput: document.getElementById('birthday-message-input'),
        photoUpload: document.getElementById('photo-upload'),
        photoPreview: document.getElementById('photo-preview'),
        dateInput: document.getElementById('birthday-date-input'),
        previewBtn: document.getElementById('preview-btn'),
        generateBtn: document.getElementById('generate-btn'),
        previewContainer: document.getElementById('greeting-preview'),
        previewFrame: document.getElementById('preview-frame'),
        linkContainer: document.querySelector('.link-container'),
        shareLink: document.getElementById('share-link'),
        copyBtn: document.getElementById('copy-btn')
    };

    let photoDataUrl = null; // To store the base64 photo data

    // --- Event Listeners ---

    // Photo Upload Handling
    if (elements.photoUpload) {
        elements.photoUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoDataUrl = e.target.result; // Store base64 data
                    if (elements.photoPreview) {
                        elements.photoPreview.src = photoDataUrl;
                        elements.photoPreview.style.display = 'block'; // Show preview
                    }
                }
                reader.readAsDataURL(file); // Read file as Data URL
            } else {
                // Reset if invalid file or no file selected
                photoDataUrl = null;
                if (elements.photoPreview) {
                    elements.photoPreview.src = '#';
                    elements.photoPreview.style.display = 'none';
                }
                // Optionally clear the input value if needed
                // elements.photoUpload.value = '';
                alert('Please select a valid image file.');
            }
        });
    }

    // Preview Button Click
    if (elements.previewBtn) {
        elements.previewBtn.addEventListener('click', function() {
            updatePreview();
            if (elements.previewContainer) {
                elements.previewContainer.style.display = 'block'; // Show preview area
            }
             // Hide link container when previewing
            if (elements.linkContainer) {
                elements.linkContainer.style.display = 'none';
            }
        });
    }

    // Generate Link Button Click
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', function() {
            generateShareLink();
            if (elements.linkContainer) {
                elements.linkContainer.style.display = 'block'; // Show link area
            }
            // Hide preview container when generating link
             if (elements.previewContainer) {
                elements.previewContainer.style.display = 'none';
            }
        });
    }

    // Copy Button Click
    if (elements.copyBtn) {
        elements.copyBtn.addEventListener('click', function() {
            copyLinkToClipboard();
        });
    }

    // --- Core Functions ---

    /**
     * Constructs the URL with parameters for the greeting page.
     * @returns {string} The URL for the birthday greeting page with parameters.
     */
    function buildGreetingUrl() {
        const baseUrl = 'birthday.html'; // Relative path to the greeting page
        const params = new URLSearchParams();

        const name = elements.friendNameInput?.value.trim() || '';
        const message = elements.messageInput?.value.trim() || '';
        const date = elements.dateInput?.value || '';

        if (name) params.set('name', name);
        if (message) params.set('message', message);
        if (date) params.set('date', date);
        if (photoDataUrl) params.set('photo', photoDataUrl); // Add photo data URL

        return `${baseUrl}?${params.toString()}`;
    }

    /**
     * Updates the iframe source to show the preview.
     */
    function updatePreview() {
        const previewUrl = buildGreetingUrl();
        if (elements.previewFrame) {
            elements.previewFrame.src = previewUrl;
        }
    }

    /**
     * Generates the full shareable link and displays it.
     */
    function generateShareLink() {
        const greetingUrlParams = buildGreetingUrl();
        // Construct the full URL based on the current page's location
        const fullUrl = new URL(greetingUrlParams, window.location.href).href;

        if (elements.shareLink) {
            elements.shareLink.value = fullUrl;
        }

        // Add a warning for potentially long URLs (e.g., > 2000 characters)
        // Base64 encoding increases size, making URLs long quickly with images.
        if (fullUrl.length > 2000) {
             // Using alert for simplicity, could integrate into the UI later.
             alert("Warning: The generated link is very long, likely due to the image size.\n\nIt might not work correctly in all browsers or when shared.\n\nConsider using a much smaller image file (e.g., under 50-100KB) or removing the image for guaranteed sharing.");
        }
    }

    /**
     * Copies the generated link to the clipboard.
     */
    function copyLinkToClipboard() {
        if (!elements.shareLink || !navigator.clipboard) {
            alert('Clipboard API not available in this browser.');
            return;
        }

        elements.shareLink.select(); // Select the text
        elements.shareLink.setSelectionRange(0, 99999); // For mobile devices

        navigator.clipboard.writeText(elements.shareLink.value)
            .then(() => {
                // Success feedback (optional)
                if (elements.copyBtn) {
                    const originalText = elements.copyBtn.textContent;
                    elements.copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        elements.copyBtn.textContent = originalText;
                    }, 1500); // Reset after 1.5 seconds
                }
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
                alert('Failed to copy link. Please copy it manually.');
            });
    }

}); // End DOMContentLoaded

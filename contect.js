document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const messageContainer = document.getElementById('messageContainer');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Create FormData object
        const formData = new FormData(contactForm);
        
        // Send form data via fetch
        fetch(contactForm.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showMessage(data.message || 'Error sending message', 'error');
            }
        })
        .catch(error => {
            showMessage('Network error. Please try again.', 'error');
        })
        .finally(() => {
            btnText.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
    
    function showMessage(text, type) {
        messageContainer.textContent = text;
        messageContainer.className = type + '-message show';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 5000);
    }
});

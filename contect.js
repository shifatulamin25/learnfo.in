document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const attachment = document.getElementById('attachment').files[0];
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create mailto link
        let mailtoLink = `mailto:learnfo25@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${message}`
        )}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Note: Attachments cannot be added via mailto links
        // The user will need to manually attach files in their email client
    });
});
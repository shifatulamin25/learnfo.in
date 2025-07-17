document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarNav = document.querySelector('.navbar-nav');
    
    navbarToggler.addEventListener('click', function() {
        navbarNav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navbarNav.classList.remove('active');
            }
        });
    });
    
    // Email button functionality
    const emailButton = document.getElementById('email-button');
    emailButton.addEventListener('click', function() {
        window.location.href = 'mailto:learnfo25@gmail.com?subject=Contact%20from%20Website';
    });
    
    // Call button functionality
    const callButton = document.getElementById('call-button');
    callButton.addEventListener('click', function() {
        // In a real implementation, this would initiate a phone call on mobile
        alert('This would initiate a call to +1 (555) 123-4567 on a mobile device');
    });
    
    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to elements when they come into view
    const animatedElements = document.querySelectorAll('.contact-card, .info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Social media links functionality
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real implementation, these would link to actual social media profiles
            const platform = this.getAttribute('aria-label');
            alert(`This would link to the developer's ${platform} profile in a real implementation.`);
        });
    });
});

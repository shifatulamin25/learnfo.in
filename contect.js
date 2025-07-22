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
    
    // Email button functionality - directly opens default email app
    const emailButton = document.getElementById('email-button');
    emailButton.addEventListener('click', function() {
        const subject = encodeURIComponent('Contact from Learnfo Website');
        const body = encodeURIComponent('Hello Shifatul,\n\nI would like to get in touch regarding...');
        window.location.href = `mailto:learnfo25@gmail.com?subject=${subject}&body=${body}`;
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
    
});

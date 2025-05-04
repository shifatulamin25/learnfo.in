document.addEventListener('DOMContentLoaded', function() {
   

    // Add hover effect to grid items
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        // Add hover effect
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Add click effect
        item.addEventListener('click', function(e) {
            // Prevent default only if it's not a link
            if (!e.target.classList.contains('grid-link')) {
                e.preventDefault();
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Here you can add functionality for what happens when a semester is clicked
                console.log('Semester clicked:', this.querySelector('h2').textContent);
                
                // For demonstration, let's show an alert
                // alert(`You clicked ${this.querySelector('h2').textContent}`);
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Responsive adjustments
    function handleResponsive() {
        const screenWidth = window.innerWidth;
        
        // Show/hide hamburger menu based on screen size
        if (screenWidth <= 768) {
            if (hamburger) hamburger.style.display = 'flex';
            if (navLinks) navLinks.style.display = 'none';
        } else {
            if (hamburger) hamburger.style.display = 'none';
            if (navLinks) navLinks.style.display = 'flex';
        }
    }

    // Initial call and event listener for resize
    handleResponsive();
    window.addEventListener('resize', handleResponsive);

    // Animation for page load
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 300);
    }
});
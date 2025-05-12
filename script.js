document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbarSearch = document.querySelector('.navbar-search');
    
    navbarToggle.addEventListener('click', function() {
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        navbarSearch.classList.toggle('active');
    });
    
    // Close menu when clicking on a link (for mobile)
    const navbarLinks = document.querySelectorAll('.navbar-link');
    navbarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 600) {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
                navbarSearch.classList.remove('active');
            }
        });
    });
    
    // Optional: Add search functionality
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    
    searchButton.addEventListener('click', function() {
        if (searchInput.value.trim() !== '') {
            alert('Searching for: ' + searchInput.value);
            // In a real application, you would redirect or fetch results here
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            alert('Searching for: ' + searchInput.value);
            // In a real application, you would redirect or fetch results here
        }
    });
});

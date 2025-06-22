document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.navbar-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar-container')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});








// File mapping - update these paths to match your actual file locations
const fileMap = {
    "resume": "files/resume.pdf",
    "project": "files/project-report.pdf",
    "certificate": "files/certificate.pdf",
    "about": "about.html",
    "contact": "contact.html",
    "dashboard": "dashboard.html"
};

// Toggle suggestions dropdown visibility
function toggleSuggestions() {
    const input = document.getElementById("Search");
    const suggestionsContainer = document.getElementById("suggestions");
    
    if (suggestionsContainer.style.display === 'block') {
        suggestionsContainer.style.display = 'none';
    } else {
        // Show all suggestions when dropdown is clicked with empty input
        if (input.value.trim() === '') {
            showAllSuggestions();
        } else {
            showSuggestions(); // Show filtered suggestions
        }
    }
}

// Show all available suggestions
function showAllSuggestions() {
    const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';
    
    Object.keys(fileMap).forEach(key => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.textContent = key;
        div.onclick = () => {
            document.getElementById("Search").value = key;
            suggestionsContainer.innerHTML = '';
            openpage(); // Auto-open on click
        };
        suggestionsContainer.appendChild(div);
    });
    
    suggestionsContainer.style.display = 'block';
}

// Show filtered suggestions based on input
function showSuggestions() {
    const input = document.getElementById("Search").value.trim().toLowerCase();
    const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';

    if (input === '') {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const matches = Object.keys(fileMap).filter(key => 
        key.toLowerCase().includes(input)
    );

    if (matches.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    matches.forEach(match => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.textContent = match;
        div.onclick = () => {
            document.getElementById("Search").value = match;
            suggestionsContainer.innerHTML = '';
            openpage(); // Auto-open on click
        };
        suggestionsContainer.appendChild(div);
    });
    
    suggestionsContainer.style.display = 'block';
}

// Open the selected page or file
function openpage() {
    const query = document.getElementById("Search").value.trim().toLowerCase();
    const suggestionsContainer = document.getElementById("suggestions");
    const link = fileMap[query];

    // Hide suggestions when searching
    suggestionsContainer.style.display = 'none';

    if (link) {
        // Handle PDF files differently (open in new tab)
        if (link.endsWith('.pdf')) {
            window.open(link, '_blank');
        } else {
            window.location.href = link;
        }
    } else {
        alert("No matching file or page found for: " + query);
    }
}

// Close suggestions when clicking outside
document.addEventListener('click', function(event) {
    const suggestionsContainer = document.getElementById("suggestions");
    const searchContainer = document.querySelector('.navbar-search');
    const dropdownArrow = document.querySelector('.dropdown-arrow');
    
    if (!searchContainer.contains(event.target) && event.target !== dropdownArrow) {
        suggestionsContainer.style.display = 'none';
    }
});

// Add keyboard navigation
document.getElementById("Search").addEventListener('keydown', function(e) {
    const suggestionsContainer = document.getElementById("suggestions");
    const items = suggestionsContainer.querySelectorAll('.suggestion-item');
    
    if (items.length > 0) {
        let currentIndex = -1;
        
        // Find currently selected item
        items.forEach((item, index) => {
            if (item.classList.contains('selected')) {
                currentIndex = index;
                item.classList.remove('selected');
            }
        });
        
        // Handle arrow keys
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % items.length;
            items[nextIndex].classList.add('selected');
            items[nextIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            items[prevIndex].classList.add('selected');
            items[prevIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            items[currentIndex].click();
        }
    }
});


// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href !== '#') {  // Add check for valid selector
            const element = document.querySelector(href);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Auto-scrolling functionality for events
function setupEventSlider() {
    const eventGrid = document.querySelector('.event-grid');
    const cards = document.querySelectorAll('.event-card:not(.no-events)');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let autoScrollInterval;

    // Add check for empty events
    function checkEvents() {
        if (cards.length === 0) {
            // Show the no-events card and hide navigation
            const noEventsCard = document.querySelector('.event-card.no-events');
            if (noEventsCard) {
                noEventsCard.style.display = 'flex';
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
            return false;
        }
        return true;
    }

    function scrollToNext() {
        if (!checkEvents()) return;
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    }

    function scrollToPrev() {
        if (!checkEvents()) return;
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
    }

    function updateSlider() {
        // Update transform for smooth sliding
        eventGrid.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update visibility and z-index of cards
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.style.zIndex = '1';
                card.style.opacity = '1';
                card.style.visibility = 'visible';
            } else {
                card.style.zIndex = '0';
                card.style.opacity = '0';
                card.style.visibility = 'hidden';
            }
        });
    }

    function resetAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
        autoScrollInterval = setInterval(scrollToNext, 8000);
    }

    // Initialize the slider
    updateSlider();
    resetAutoScroll();
    
    // Manual navigation
    nextBtn.addEventListener('click', () => {
        scrollToNext();
        resetAutoScroll();
    });

    prevBtn.addEventListener('click', () => {
        scrollToPrev();
        resetAutoScroll();
    });

    document.addEventListener('DOMContentLoaded', function() {
        const eventCards = document.querySelectorAll('.event-card');
        const eventOverlay = document.querySelector('.event-overlay');
        const overlayImage = eventOverlay.querySelector('.overlay-image img');
        const closeButton = eventOverlay.querySelector('.close-overlay');
    
        // Add click event to each event card
        eventCards.forEach(card => {
            card.addEventListener('click', function() {
                const cardImage = this.querySelector('.event-image img');
                overlayImage.src = cardImage.src;
                eventOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when overlay is open
            });
        });
    
        // Close overlay when clicking the close button
        closeButton.addEventListener('click', function() {
            eventOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    
        // Close overlay when clicking outside the content
        eventOverlay.addEventListener('click', function(e) {
            if (e.target === eventOverlay) {
                eventOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    
        // Close overlay when pressing ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && eventOverlay.classList.contains('active')) {
                eventOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    const overlay = document.querySelector('.event-overlay');
    const overlayImage = overlay.querySelector('.overlay-image img');

    // Add click event listeners to each card
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const eventData = JSON.parse(this.dataset.eventDetails);
            
            // Update image and basic info
            overlayImage.src = this.querySelector('.event-image img').src;
            overlay.querySelector('.image-overlay-text h2').textContent = eventData.title;
            overlay.querySelector('.image-overlay-text p').textContent = eventData.description;
            
            // Update schedule
            const scheduleList = overlay.querySelector('.schedule-timeline');
            scheduleList.innerHTML = eventData.schedule.map(item => `
                <li>
                    <span class="time">${item.time}</span>
                    <span class="activity">${item.activity}</span>
                </li>
            `).join('');
            
            // Update speakers
            const speakersList = overlay.querySelector('.speakers-list');
            speakersList.innerHTML = eventData.speakers.map(speaker => `
                <div class="speaker">
                    <img src="${speaker.image}" alt="${speaker.name}">
                    <span>${speaker.name}</span>
                </div>
            `).join('');
            
            // Show overlay
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close overlay
    overlay.querySelector('.close-overlay').addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        resetAutoScroll();
    });

    // Close on click outside content
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            resetAutoScroll();
        }
    });
    
    // Initialize auto-scroll
    resetAutoScroll();
    if (checkEvents()) {
        updateSlider();
        resetAutoScroll();
    }
}

// Add click event listener for gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const gallery = document.querySelector('.gallery-grid');
        const itemRect = item.getBoundingClientRect();
        const galleryRect = gallery.getBoundingClientRect();
        
        // Calculate the center position of the gallery
        const centerX = galleryRect.left + (galleryRect.width / 2);
        const centerY = galleryRect.top + (galleryRect.height / 2);
        
        // Animate the movement
        item.style.transition = 'transform 0.5s ease';
        item.style.transform = `translate(${centerX - itemRect.left}px, ${centerY - itemRect.top}px)`;
        
        // Reset the position after the animation
        setTimeout(() => {
            item.style.transform = '';
        }, 500); // Match duration of the animation
    });
});

document.addEventListener('DOMContentLoaded', setupEventSlider);

// Scroll animation control
// Scrollable biowave functionality
document.addEventListener('DOMContentLoaded', () => {
    const biowave = document.querySelector('.biowave');
    let isDragging = false;
    let startY;
    let scrollStartY;

    // Update biowave position based on scroll
    function updateBiowavePosition() {
        const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const maxTranslateY = window.innerHeight - biowave.offsetHeight;
        const newPosition = maxTranslateY * scrollPercentage;
        biowave.style.top = `${newPosition}px`;
    }

    // Initial position
    updateBiowavePosition();

    // Update on scroll
    window.addEventListener('scroll', updateBiowavePosition);

    biowave.addEventListener('mousedown', (e) => {
        isDragging = true;
        biowave.classList.add('dragging');
        startY = e.pageY;
        scrollStartY = window.scrollY;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        e.preventDefault();
        const delta = e.pageY - startY;
        const scrollAmount = (delta / window.innerHeight) * document.documentElement.scrollHeight;
        window.scrollTo(0, scrollStartY + scrollAmount);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        biowave.classList.remove('dragging');
    });

    document.addEventListener('mouseleave', () => {
        isDragging = false;
        biowave.classList.remove('dragging');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const whoWeAreText = document.querySelector('.who-we-are-text');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                whoWeAreText.classList.add('animate');
            }
        });
    }, { threshold: 0.3 });

    observer.observe(whoWeAreText);
});

// Gallery functionality
// Gallery functionality
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const overlay = document.querySelector('.gallery-overlay');
        const popup = document.querySelector('.gallery-popup');
        const imageContainer = document.querySelector('.gallery-image-container');
        
        // Get the clicked item's position and dimensions
        const itemRect = item.getBoundingClientRect();
        const targetRect = popup.getBoundingClientRect();
        
        // Store original position for animation back
        item.style.transformOrigin = 'top left';
        item.dataset.originalPosition = JSON.stringify({
            x: itemRect.left,
            y: itemRect.top,
            width: itemRect.width,
            height: itemRect.height
        });

        // Calculate the transform values
        const scaleX = targetRect.width / itemRect.width;
        const scaleY = targetRect.height / itemRect.height;
        const translateX = targetRect.left - itemRect.left;
        const translateY = targetRect.top - itemRect.top;

        // Apply the animation
        item.style.position = 'fixed';
        item.style.zIndex = '1001';
        item.style.transition = 'transform 0.5s ease-in-out';
        item.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;

        // Show overlay after slight delay
        setTimeout(() => {
            overlay.classList.add('active');
            // Get image and text content for overlay
            const img = item.querySelector('img');
            const title = item.querySelector('.item-text h3').textContent;
            const description = item.querySelector('.item-text p').textContent;
            
            // Set content in overlay
            imageContainer.innerHTML = `
                <img src="${img.src}" alt="${img.alt}">
                <div class="gallery-text-overlay">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            `;
        }, 500);
    });
});

// Close gallery overlay with animation
function closeGalleryOverlay() {
    const overlay = document.querySelector('.gallery-overlay');
    const activeItem = document.querySelector('.gallery-item[style*="position: fixed"]');
    
    if (activeItem) {
        const originalPosition = JSON.parse(activeItem.dataset.originalPosition);
        overlay.classList.remove('active');
        
        // Animate back to original position
        activeItem.style.transform = 'translate(0, 0) scale(1)';
        
        // Reset after animation
        setTimeout(() => {
            activeItem.style.position = '';
            activeItem.style.zIndex = '';
            activeItem.style.transition = '';
            activeItem.style.transform = '';
            activeItem.style.transformOrigin = '';
        }, 500);
    }
}

// Add event listeners for closing
document.querySelector('.close-gallery').addEventListener('click', closeGalleryOverlay);
document.querySelector('.gallery-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeGalleryOverlay();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.logo-track');
    const logos = track.querySelectorAll('.logo-slide');
    
    // Set CSS variable for total logos
    track.style.setProperty('--logo-count', logos.length);
    
    // Clone logos for seamless scroll
    logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        track.appendChild(clone);
    });
});
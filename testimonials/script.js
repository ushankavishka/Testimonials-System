document.addEventListener('DOMContentLoaded', () => {
    const testimonialForm = document.getElementById('testimonialForm');
    const stars = document.querySelectorAll('.stars i');
    const ratingInput = document.getElementById('rating');
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    const carouselDots = document.getElementById('carouselDots');
    let currentPage = 0;
    let testimonialsList = [];
    let itemsPerPage = getItemsPerPage();
    let autoSlideInterval;
    let isUserInteracting = false;
    const autoSlideDelay = 5000; 

    // Function to determine items per page based on screen size
    function getItemsPerPage() {
        if (window.innerWidth <= 768) {
            return 1; 
        } else if (window.innerWidth <= 1024) {
            return 2; 
        }
        return 3; 
    }

    // Update itemsPerPage on window resize
    window.addEventListener('resize', () => {
        const newItemsPerPage = getItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            currentPage = 0; 
            updateCarousel();
        }
    });

    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const rating = star.dataset.rating;
            highlightStars(rating);
        });

        star.addEventListener('click', () => {
            const rating = star.dataset.rating;
            ratingInput.value = rating;
            highlightStars(rating);
        });
    });

    document.querySelector('.stars').addEventListener('mouseleave', () => {
        highlightStars(ratingInput.value);
    });

    function highlightStars(rating) {
        stars.forEach(star => {
            star.classList.toggle('active', star.dataset.rating <= rating);
        });
    }

    // Auto-slide functionality
    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        
        autoSlideInterval = setInterval(() => {
            if (!isUserInteracting && testimonialsList.length > itemsPerPage) {
                const totalPages = Math.ceil(testimonialsList.length / itemsPerPage);
                currentPage = (currentPage + 1) % totalPages;
                updateCarousel();
            }
        }, autoSlideDelay);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    function handleUserInteractionStart() {
        isUserInteracting = true;
        stopAutoSlide();
    }

    function handleUserInteractionEnd() {
        isUserInteracting = false;
        startAutoSlide();
    }

    // Carousel Navigation
    function updateCarousel() {
        const totalPages = Math.ceil(testimonialsList.length / itemsPerPage);
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;

        // Update testimonials display with fade effect
        const newTestimonials = testimonialsList
            .slice(start, end)
            .map(testimonial => {
                const date = new Date(testimonial.created_at).toLocaleDateString();
                const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
                const initials = testimonial.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase();
                
                return `
                    <div class="testimonial-card active">
                        <div class="testimonial-header">
                            <div class="user-icon">${initials}</div>
                            <div class="testimonial-info">
                                <div class="testimonial-name">${escapeHtml(testimonial.name)}</div>
                                <div class="testimonial-rating">${stars}</div>
                            </div>
                        </div>
                        <div class="testimonial-content">${escapeHtml(testimonial.review)}</div>
                        <div class="testimonial-date">${date}</div>
                    </div>
                `;
            })
            .join('');

        testimonialsContainer.innerHTML = newTestimonials;

        // Update dots
        carouselDots.innerHTML = Array(totalPages)
            .fill()
            .map((_, i) => `
                <div class="dot ${i === currentPage ? 'active' : ''}" 
                     data-page="${i}" 
                     aria-label="Go to page ${i + 1}">
                </div>
            `)
            .join('');

        // Update button states
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (totalPages <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            carouselDots.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            carouselDots.style.display = 'flex';
            prevBtn.disabled = currentPage === 0;
            nextBtn.disabled = currentPage === totalPages - 1;
        }
    }

    // Enhanced Carousel Controls Event Listeners
    document.querySelector('.prev-btn').addEventListener('click', () => {
        handleUserInteractionStart();
        if (currentPage > 0) {
            currentPage--;
            updateCarousel();
        }
        setTimeout(handleUserInteractionEnd, 3000); 
    });

    document.querySelector('.next-btn').addEventListener('click', () => {
        handleUserInteractionStart();
        const totalPages = Math.ceil(testimonialsList.length / itemsPerPage);
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateCarousel();
        }
        setTimeout(handleUserInteractionEnd, 3000); 
    });

    carouselDots.addEventListener('click', (e) => {
        const dot = e.target.closest('.dot');
        if (dot) {
            handleUserInteractionStart();
            currentPage = parseInt(dot.dataset.page);
            updateCarousel();
            setTimeout(handleUserInteractionEnd, 3000); 
        }
    });

    // Mouse hover pause functionality
    testimonialsContainer.addEventListener('mouseenter', handleUserInteractionStart);
    testimonialsContainer.addEventListener('mouseleave', handleUserInteractionEnd);

    // Load testimonials
    async function loadTestimonials() {
        try {
            const response = await fetch('handle_testimonial.php');
            const data = await response.json();

            if (data.success) {
                testimonialsList = data.testimonials;
                currentPage = 0;
                updateCarousel();
                if (testimonialsList.length > itemsPerPage) {
                    startAutoSlide(); 
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Form submission
    testimonialForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            rating: parseInt(ratingInput.value),
            review: document.getElementById('review').value
        };

        try {
            const response = await fetch('handle_testimonial.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                testimonialForm.reset();
                ratingInput.value = '0';
                highlightStars(0);
                loadTestimonials();
                alert('Thank you for your review!');
            } else {
                alert('Error submitting review. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting review. Please try again.');
        }
    });

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Initial load
    loadTestimonials();
}); 
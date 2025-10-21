// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Get form data
        const formData = {
            name: contactForm.querySelector('input[name="name"]').value,
            email: contactForm.querySelector('input[name="email"]').value,
            phone: contactForm.querySelector('input[name="phone"]').value,
            message: contactForm.querySelector('textarea[name="message"]').value
        };

        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'שולח...';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                showMessage('success', result.message || 'ההודעה נשלחה בהצלחה!');

                // Reset form
                contactForm.reset();
            } else {
                // Show error message
                showMessage('error', result.message || 'אירעה שגיאה בשליחת הטופס');
            }

        } catch (error) {
            console.error('Error:', error);
            showMessage('error', 'אירעה שגיאה בשליחת הטופס. נסה שוב מאוחר יותר');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// Function to show messages
function showMessage(type, message) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Style the message
    messageDiv.style.cssText = `
        padding: 15px;
        margin-top: 20px;
        border-radius: 12px;
        text-align: center;
        font-size: 16px;
        background: ${type === 'success' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
        color: ${type === 'success' ? '#6366f1' : '#ef4444'};
        border: 1px solid ${type === 'success' ? '#6366f1' : '#ef4444'};
    `;

    // Insert message after form
    if (contactForm) {
        contactForm.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Add scroll effect to navbar (only if nav exists)
const nav = document.querySelector('.nav');

if (nav) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
        }
    });
}

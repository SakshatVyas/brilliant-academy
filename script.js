document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('fa-times');
            hamburger.classList.toggle('fa-bars');
        });
    }

    // Sticky Navbar shadow on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load
});

// ==== Chatbot Logic ====
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const closeChat = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');
const chatMessages = document.getElementById('chatMessages');

if (chatbotToggle && chatbotContainer) {
    const toggleChat = () => chatbotContainer.classList.toggle('active');
    chatbotToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);

    const handleSendMessage = () => {
        const text = chatInput.value.trim();
        if (text) {
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'message user-message';
            userMsg.textContent = text;
            chatMessages.appendChild(userMsg);
            chatInput.value = '';
            
            // Auto scroll
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Simulate bot typing and responding
            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'message bot-message';
                
                // Simple mock logic
                if (text.toLowerCase().includes('ssc') || text.toLowerCase().includes('bank')) {
                    botMsg.textContent = "Great choice! We have dedicated batches starting next week. Would you like me to book a free demo class for you to experience our teaching methodology?";
                } else if (text.toLowerCase().includes('demo') || text.toLowerCase().includes('yes')) {
                    botMsg.textContent = "Awesome! Please click the 'Book Demo' button at the top of the page, or leave your phone number here and our counselor will call you within 15 minutes.";
                } else if (!isNaN(text.replace(/[^0-9]/g, '')) && text.replace(/[^0-9]/g, '').length >= 10) {
                     botMsg.textContent = "Thank you! I've noted your number. Our senior counselor will call you shortly to assist with the admission process.";
                } else {
                    botMsg.textContent = "Thanks for the message! Our admission counselor will be happy to help. You can call us directly at 096465 98579 or book a free demo to get started.";
                }
                
                chatMessages.appendChild(botMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    };

    sendMessage.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
}

// ==== Modal Logic (Lead Capture) ====
const demoModal = document.getElementById('demoModal');
const openDemoBtns = document.querySelectorAll('.open-demo-btn');
const closeDemoBtn = document.querySelector('.close-modal');

if (demoModal) {
    const openModal = (e) => {
        e.preventDefault();
        demoModal.classList.add('active');
    };
    
    const closeModal = () => {
        demoModal.classList.remove('active');
    };

    openDemoBtns.forEach(btn => btn.addEventListener('click', openModal));
    closeDemoBtn.addEventListener('click', closeModal);

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === demoModal) {
            closeModal();
        }
    });

    // Form submit simulation
    document.getElementById('demoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Submitting...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.textContent = 'Application Received!';
            btn.style.backgroundColor = '#2ecc71';
            
            setTimeout(() => {
                closeModal();
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
                e.target.reset(); // Reset form fields
            }, 2000);
        }, 1500);
    });
}

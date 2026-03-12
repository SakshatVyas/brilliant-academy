document.addEventListener('DOMContentLoaded', () => {
    // ==== Mobile Menu & Navbar ====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('fa-times');
            hamburger.classList.toggle('fa-bars');
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==== GSAP Parallax & Scroll Story Animations ====
    const initGSAP = () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Initial load Hero Animation
            const heroTl = gsap.timeline();
            heroTl.fromTo('.hero h1', {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 1, ease: 'power3.out'})
                  .fromTo('.hero p', {y: 30, opacity: 0}, {y: 0, opacity: 1, duration: 0.8, ease: 'power3.out'}, "-=0.6")
                  .fromTo('.trust-badges .badge', {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)'}, "-=0.4")
                  .fromTo('.hero-ctas .btn', {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out'}, "-=0.2");

            // Scroll Story Reveals for standard sections
            gsap.utils.toArray('.reveal').forEach(element => {
                // Prevent double animating the hero on load
                if(!element.closest('.hero')) {
                    gsap.fromTo(element, 
                        { y: 50, opacity: 0 },
                        {
                            y: 0, 
                            opacity: 1, 
                            duration: 1, 
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: element,
                                start: "top 85%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                }
            });

            // Staggered Cards Animation (Courses)
            gsap.fromTo('.course-card',
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "back.out(1)",
                    scrollTrigger: {
                        trigger: '.courses-grid',
                        start: "top 80%"
                    }
                }
            );

            // Staggered Icons Animation (Why Choose Us)
            gsap.fromTo('.why-feature',
                { scale: 0.5, opacity: 0, rotation: -15 },
                {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "back.out(1.5)",
                    scrollTrigger: {
                        trigger: '.why-grid',
                        start: "top 85%"
                    }
                }
            );

            // Slide in Reviews
            gsap.fromTo('.review-card',
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.reviews-grid',
                        start: "top 85%"
                    }
                }
            );

            // Ensure ScrollTrigger recalculates after images and fonts load
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        } else {
            console.warn("GSAP or ScrollTrigger not loaded. Animations disabled.");
            // Retry once after 500ms if loaded weirdly async
            setTimeout(initGSAP, 500);
        }
    };

    // Run GSAP initialisation
    if (document.readyState === 'complete') {
        initGSAP();
    } else {
        window.addEventListener('load', initGSAP);
    }

    // ==== AI Student Counsellor State Machine ====
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    let chatState = 0; // 0=Greeting, 1=Course Selected, 2=Demo Accepted, 3=Name Given
    let leadData = { course: '', name: '', phone: '' };

    if (chatbotToggle && chatbotContainer) {
        const toggleChat = () => chatbotContainer.classList.toggle('active');
        chatbotToggle.addEventListener('click', toggleChat);
        closeChat.addEventListener('click', toggleChat);

        // Helper to add bot message
        const addBotMessage = (text, options = []) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'flex-start';
            
            const msgObj = document.createElement('div');
            msgObj.className = 'message bot-message';
            msgObj.innerHTML = text; // Allow HTML formatting safely here
            wrapper.appendChild(msgObj);

            if (options.length > 0) {
                const optionsContainer = document.createElement('div');
                optionsContainer.className = 'chat-options';
                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'chat-option-btn';
                    btn.textContent = opt;
                    btn.onclick = () => handleUserInput(opt);
                    optionsContainer.appendChild(btn);
                });
                wrapper.appendChild(optionsContainer);
            }

            chatMessages.appendChild(wrapper);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        // Helper to add user message
        const addUserMessage = (text) => {
            const msgObj = document.createElement('div');
            msgObj.className = 'message user-message';
            msgObj.textContent = text;
            chatMessages.appendChild(msgObj);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            chatInput.value = '';
        };

        // State Machine Logic
        const handleUserInput = (rawText) => {
            const text = rawText.trim();
            if (!text) return;
            
            addUserMessage(text);
            
            // Remove previous options buttons
            const optionBtns = chatMessages.querySelectorAll('.chat-options');
            optionBtns.forEach(el => el.remove());

            setTimeout(() => {
                switch(chatState) {
                    case 0: // Asking for Course
                        leadData.course = text === 'Other' ? 'Competitive Exams' : text;
                        addBotMessage(`Great choice! Our <strong>${leadData.course}</strong> preparation program includes concept-based lectures, regular mock tests, and expert faculty guidance.<br><br>Would you like to join a free demo class?`, ['Yes, book a demo', 'Maybe later']);
                        chatState = 1;
                        break;
                    case 1: // Asking for Demo
                        if (text.toLowerCase().includes('yes')) {
                            addBotMessage("Awesome! I just need a few details to book it for you. What is your <strong>Full Name</strong>?");
                            chatState = 2;
                        } else {
                            addBotMessage("No problem! Feel free to explore our courses or call us at 096465 98579. How else can I help?");
                            chatState = 0; // Reset
                        }
                        break;
                    case 2: // Got Name, Asking for Phone
                        leadData.name = text;
                        addBotMessage(`Nice to meet you, ${leadData.name}! What is an active <strong>Phone Number</strong> our counselor can call you at?`);
                        chatState = 3;
                        break;
                    case 3: // Got Phone, Finalize
                        leadData.phone = text;
                        addBotMessage(`Thank you! 🎉<br><br>Your request for a free demo in ${leadData.course} has been captured. I am redirecting you to our counselor on WhatsApp now to continue the conversation.`, ['Start Over']);
                        chatState = 0; // Reset for next interaction
                        
                        // Send data to WhatsApp
                        setTimeout(() => {
                            const waMessage = `Hi Brilliant Academy! I am interacting with your website AI Counsellor and would like to book a free demo class.\n\n*Name:* ${leadData.name}\n*Phone:* ${leadData.phone}\n*Course:* ${leadData.course}`;
                            const waUrl = `https://wa.me/919646598579?text=${encodeURIComponent(waMessage)}`;
                            window.open(waUrl, '_blank');
                        }, 1500);
                        break;
                    default:
                        addBotMessage("I'm sorry, I encountered an error. Let's start over. What exam are you preparing for?", ['SSC', 'Banking', 'Police', 'Army', 'Other']);
                        chatState = 0;
                }
            }, 800);
        };

        // Initialize Chatbot exactly once
        chatMessages.innerHTML = '';
        setTimeout(() => {
            addBotMessage("Hi! 👋 I'm your AI admission advisor. Which exam are you preparing for?", ['SSC', 'Banking', 'Police', 'Army', 'Other']);
        }, 500);

        sendMessage.addEventListener('click', () => handleUserInput(chatInput.value));
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserInput(chatInput.value);
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

        window.addEventListener('click', (e) => {
            if (e.target === demoModal) {
                closeModal();
            }
        });

      // Form submit logic -> WhatsApp Redirection
    document.getElementById('demoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get Form Data
        const inputs = e.target.querySelectorAll('input, select');
        const demoData = {
            name: inputs[0].value,
            phone: inputs[1].value,
            course: inputs[2].options[inputs[2].selectedIndex].text,
            city: inputs[3].value
        };

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Submitting...';
        btn.disabled = true;
        
        // Send data directly to WhatsApp
        setTimeout(() => {
            btn.textContent = 'Application Received!';
            btn.style.backgroundColor = '#2ecc71';
            
            const waMessage = `Hi Brilliant Academy! I just filled out the Book Demo form on your website.\n\n*Name:* ${demoData.name}\n*Phone:* ${demoData.phone}\n*Exam:* ${demoData.course}\n*City:* ${demoData.city}`;
            const waUrl = `https://wa.me/919646598579?text=${encodeURIComponent(waMessage)}`;
            window.open(waUrl, '_blank');
            
            setTimeout(() => {
                closeModal();
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
                e.target.reset(); // Reset form fields
            }, 1000);
        }, 800);
    });
}

    // ==== Dark / Light Mode Toggle ====
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    const applyTheme = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        if (themeIcon) {
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    };

    // Load saved preference
    const savedTheme = localStorage.getItem('ba-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('dark-mode');
            applyTheme(isDark);
            localStorage.setItem('ba-theme', isDark ? 'dark' : 'light');
        });
    }

    // ==== Back to Top Button ====
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==== Cookie Consent Banner ====
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookies = document.getElementById('acceptCookies');
    const dismissCookies = document.getElementById('dismissCookies');

    if (cookieBanner && !localStorage.getItem('ba-cookie-consent')) {
        // Show after small delay for better UX
        setTimeout(() => cookieBanner.classList.add('visible'), 1500);
    }

    const hideCookieBanner = (accepted) => {
        if (cookieBanner) {
            cookieBanner.classList.remove('visible');
            localStorage.setItem('ba-cookie-consent', accepted ? 'accepted' : 'dismissed');
        }
    };

    if (acceptCookies) acceptCookies.addEventListener('click', () => hideCookieBanner(true));
    if (dismissCookies) dismissCookies.addEventListener('click', () => hideCookieBanner(false));

});

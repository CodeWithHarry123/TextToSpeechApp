document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    themeSwitcher.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLightMode = body.classList.contains('light-mode');
        themeSwitcher.innerHTML = isLightMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    const speakButton = document.getElementById('speak-button');
    const textInput = document.getElementById('text-input');
    const languageSelect = document.getElementById('language-select');
    const downloadButtons = document.querySelectorAll('.download-button');
    let voices = [];

    function populateVoiceList() {
        voices = speechSynthesis.getVoices();
    }

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    speakButton.addEventListener('click', () => {
        // Add a small delay to ensure voices are loaded
        setTimeout(() => {
            const text = textInput.value;
            const lang = languageSelect.value;
            if (text) {
                const utterance = new SpeechSynthesisUtterance(text);
                
                // --- Improved Voice Selection Logic ---
                // Prioritize non-local, high-quality voices (often from Google or Microsoft)
                const highQualityVoice = voices.find(voice => 
                    voice.lang === lang && 
                    !voice.localService && 
                    (voice.name.includes('Google') || voice.name.includes('Microsoft'))
                );

                const anyNonLocalVoice = voices.find(voice => voice.lang === lang && !voice.localService);
                
                const anyGoogleVoice = voices.find(voice => voice.lang === lang && voice.name.includes('Google'));

                const anyVoiceForLang = voices.find(voice => voice.lang === lang);

                // Select the best available voice in order of preference
                utterance.voice = highQualityVoice || anyNonLocalVoice || anyGoogleVoice || anyVoiceForLang;
                
                utterance.lang = lang;
                utterance.pitch = 1; // Can be adjusted (0 to 2)
                utterance.rate = 1; // Can be adjusted (0.1 to 10)
                speechSynthesis.speak(utterance);
            }
        }, 100);
    });

    downloadButtons.forEach(button => {
        if (button.dataset.platform) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`We apologize, but AurelioX is not yet available for ${button.dataset.platform}.`);
            });
        }
    });

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
    });

    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 150}ms`;
    });
});
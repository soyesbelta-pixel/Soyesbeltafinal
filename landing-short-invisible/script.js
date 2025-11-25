// ================================
// LANDING PAGE SHORT INVISIBLE
// JavaScript para interactividad
// ================================

// ================================
// DATA - Testimonios y FAQs
// ================================

const clientTestimonials = [
    { name: 'Carolina M.', city: 'Barranquilla', size: 'M', comment: 'Increíble cómo realza sin ser incómodo, perfecto para usar todo el día', rating: 5, video: 'videos/testimonio-carolina.mp4' },
    { name: 'Valentina S.', city: 'Cartagena', size: 'S', comment: 'Me encanta que no se marca bajo la ropa, se siente super natural', rating: 5 },
    { name: 'Daniela P.', city: 'Pereira', size: 'L', comment: 'El kit completo es maravilloso, mi piel quedó suavecita y el short me queda perfecto', rating: 5 },
    { name: 'Sofía L.', city: 'Bucaramanga', size: 'M', comment: 'Compré el negro y ya quiero en todos los colores, súper cómodo', rating: 5 },
    { name: 'Isabella G.', city: 'Cúcuta', size: 'XL', comment: 'Finalmente encontré un short que realza sin aplanar, me siento segura', rating: 5 },
    { name: 'Camila R.', city: 'Santa Marta', size: 'S', comment: 'El exfoliante es mi parte favorita del ritual, mi piel nunca se había sentido tan suave', rating: 5 },
    { name: 'Lucía H.', city: 'Manizales', size: 'M', comment: 'Lo uso bajo vestidos y se ve increíble, nadie sabe que llevo short', rating: 4 },
    { name: 'Mariana V.', city: 'Pasto', size: 'L', comment: 'El aceite de fenogreco huele delicioso y el masaje se siente muy bien', rating: 5 },
    { name: 'Andrea C.', city: 'Villavicencio', size: 'M', comment: 'Calidad premium, se nota en cada detalle. Totalmente vale la pena', rating: 5 },
    { name: 'Paula A.', city: 'Ibagué', size: 'S', comment: 'El envío fue rapidísimo y el producto superó mis expectativas', rating: 5 }
];

const faqs = [
    { q: '¿Se marca bajo ropa?', a: 'Diseñado para ser invisible; elige tu talla correcta para mejores resultados.' },
    { q: '¿Pica el exfoliante?', a: 'Fórmula suave; evita usar en piel irritada/lastimada.' },
    { q: '¿Fenogreco aumenta músculo?', a: 'Ayuda como parte de masaje + entrenamiento y nutrición adecuados; no es un medicamento. Resultados pueden variar.' },
    { q: '¿Cómo lavo el short?', a: 'A mano, agua fría, secado a la sombra para mantener la calidad.' },
    { q: '¿Cuánto tarda el envío?', a: 'Envío gratis a toda Colombia. Tiempo estimado: 3-5 días hábiles en ciudades principales.' }
];

// ================================
// TESTIMONIAL CAROUSEL
// ================================

function loadTestimonialCarousel() {
    const carousel = document.getElementById('testimonial-carousel');
    const duplicatedTestimonials = [...clientTestimonials, ...clientTestimonials];

    carousel.innerHTML = duplicatedTestimonials.map(testimonial => `
        <div class="carousel-card flex-shrink-0 w-[350px] bg-white rounded-2xl p-6 shadow-lg">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading text-xl gradient-chocolate-beige">
                    ${testimonial.name.charAt(0)}
                </div>
                <div>
                    <h4 class="font-body font-bold text-base" style="color: #2C1E1E;">${testimonial.name}</h4>
                    <p class="text-sm font-body" style="color: #2C1E1E88;">${testimonial.city} · Talla ${testimonial.size}</p>
                </div>
            </div>
            <div class="flex gap-1 mb-3">
                ${'<i data-lucide="star" class="w-4 h-4 fill-current" style="color: #F88379;"></i>'.repeat(testimonial.rating)}
            </div>
            <p class="font-body text-sm leading-relaxed" style="color: #2C1E1E;">"${testimonial.comment}"</p>
            ${testimonial.video ? `
                <div class="mt-4 rounded-xl overflow-hidden relative group cursor-pointer testimonial-video-container">
                    <video
                        class="w-full h-auto testimonial-video"
                        src="${testimonial.video}"
                        loop
                        muted
                        playsinline
                    ></video>
                    <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all">
                        <div class="w-12 h-12 rounded-full bg-white bg-opacity-90 flex items-center justify-center play-button">
                            <i data-lucide="play" class="w-6 h-6 ml-1" style="color: #2C1E1E;"></i>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `).join('');

    lucide.createIcons();

    // Añadir funcionalidad de play/pause a los videos de testimonios
    document.querySelectorAll('.testimonial-video-container').forEach(container => {
        const video = container.querySelector('.testimonial-video');
        const playButton = container.querySelector('.play-button');

        container.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playButton.style.opacity = '0';
            } else {
                video.pause();
                playButton.style.opacity = '1';
            }
        });

        // Mostrar botón cuando el video termina
        video.addEventListener('ended', () => {
            playButton.style.opacity = '1';
        });
    });
}

// ================================
// FAQ ACCORDION
// ================================

function loadFAQs() {
    const faqContainer = document.getElementById('faq-container');

    faqContainer.innerHTML = faqs.map((faq, index) => `
        <div class="bg-white rounded-2xl border-2 overflow-hidden fade-in-on-scroll" style="border-color: #D7BFA3;">
            <button onclick="toggleFAQ(${index})" class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors">
                <span class="font-body font-bold text-lg" style="color: #2C1E1E;">${faq.q}</span>
                <i data-lucide="chevron-down" id="faq-icon-${index}" class="w-6 h-6 transition-transform" style="color: #2C1E1E;"></i>
            </button>
            <div id="faq-answer-${index}" class="overflow-hidden max-h-0 transition-all duration-300">
                <div class="px-6 pb-6 font-body" style="color: #2C1E1E;">${faq.a}</div>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

// Toggle FAQ
let currentOpenFAQ = null;
function toggleFAQ(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);

    if (currentOpenFAQ === index) {
        answer.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
        currentOpenFAQ = null;
    } else {
        if (currentOpenFAQ !== null) {
            document.getElementById(`faq-answer-${currentOpenFAQ}`).style.maxHeight = '0';
            document.getElementById(`faq-icon-${currentOpenFAQ}`).style.transform = 'rotate(0deg)';
        }
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
        currentOpenFAQ = index;
    }
}

// ================================
// COUNTDOWN TIMER
// ================================

let countdown = { hours: 48, minutes: 0, seconds: 0 };

function updateCountdown() {
    if (countdown.seconds > 0) {
        countdown.seconds--;
    } else if (countdown.minutes > 0) {
        countdown.minutes--;
        countdown.seconds = 59;
    } else if (countdown.hours > 0) {
        countdown.hours--;
        countdown.minutes = 59;
        countdown.seconds = 59;
    }

    document.getElementById('countdown-hours').textContent = String(countdown.hours).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(countdown.minutes).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(countdown.seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);

// ================================
// SIZE CALCULATOR
// ================================

function toggleSizeGuide() {
    const calculator = document.getElementById('size-calculator');
    const toggle = document.getElementById('size-calculator-toggle');

    if (calculator.classList.contains('hidden')) {
        calculator.classList.remove('hidden');
        toggle.classList.add('hidden');
    } else {
        calculator.classList.add('hidden');
        toggle.classList.remove('hidden');
    }
}

function calculateSize() {
    const waist = parseInt(document.getElementById('waist-input').value);
    const hips = parseInt(document.getElementById('hips-input').value);

    if (waist && hips) {
        let size = '2XL';
        if (waist <= 70 && hips <= 95) size = 'XS';
        else if (waist <= 75 && hips <= 100) size = 'S';
        else if (waist <= 80 && hips <= 105) size = 'M';
        else if (waist <= 85 && hips <= 110) size = 'L';
        else if (waist <= 90 && hips <= 115) size = 'XL';

        document.getElementById('size-result-text').textContent = size;
        document.getElementById('size-result').classList.remove('hidden');
    }
}

// ================================
// ADD TO CART FUNCTION
// ================================

function agregarAlCarrito() {
    // En producción, aquí integrarías con tu sistema de e-commerce
    // Por ejemplo: Shopify, WooCommerce, MercadoPago, etc.

    // Mostrar confirmación
    alert('¡Kit agregado al carrito! 🛍️\n\nEn la versión final, esto se integrará con tu sistema de pagos.');

    // Ejemplo de integración con WhatsApp (alternativa)
    // window.open('https://wa.me/573147404023?text=Hola! Quiero comprar el Kit Esbelta Short Invisible', '_blank');

    // Ejemplo de tracking con Google Analytics (si lo tienes configurado)
    // gtag('event', 'add_to_cart', {
    //     items: [{
    //         id: 'kit-short-invisible',
    //         name: 'Kit Esbelta Short Invisible',
    //         price: 89990
    //     }]
    // });
}

// ================================
// SCROLL ANIMATIONS
// ================================

function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => observer.observe(element));
}

// ================================
// WORD ANIMATION FOR SIZE ADVICE
// ================================

function animateSizeAdvice() {
    const sizeAdvice = document.getElementById('size-advice');
    if (!sizeAdvice) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const paragraphs = entry.target.querySelectorAll('p');

                paragraphs.forEach((p, pIndex) => {
                    const words = p.textContent.trim().split(' ');
                    p.innerHTML = words.map((word, i) =>
                        `<span class="word-animate" style="animation-delay: ${(pIndex * 0.6 + i * 0.08)}s">${word}</span>`
                    ).join(' ');
                });
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(sizeAdvice);
}

// ================================
// INITIALIZE ON PAGE LOAD
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Load dynamic content
    loadTestimonialCarousel();
    loadFAQs();

    // Initialize animations
    handleScrollAnimations();
    animateSizeAdvice();

    // Console log para debugging
    console.log('🎉 Landing Page Short Invisible cargada correctamente');
    console.log('📦 Kit Esbelta - Fajas Colombianas Premium');
});

// ================================
// OPTIONAL: ANALYTICS TRACKING
// ================================

// Tracking de eventos importantes
function trackEvent(eventName, eventData) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }

    console.log('Event tracked:', eventName, eventData);
}

// Ejemplos de tracking
// trackEvent('page_view', { page_title: 'Landing Short Invisible' });
// trackEvent('view_item', { item_id: 'kit-short-invisible', item_name: 'Kit Esbelta' });

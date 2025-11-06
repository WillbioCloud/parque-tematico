/* ==========================================================
   SCRIPT PRINCIPAL - SETLAND PARQUE TEMÁTICO
   ========================================================== */

// Aguarda o DOM (a página) carregar completamente
document.addEventListener('DOMContentLoaded', function() {

    // 🔸 INICIALIZAÇÃO DO CARROSSEL SWIPER
    const showcaseSwiper = new Swiper('.showcase-carousel', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        spaceBetween: 24, // Espaço entre os slides
        slidesPerView: 1, // Padrão para mobile
        breakpoints: {
            768: { slidesPerView: 2 }, // 2 slides para tablet
            1024: { slidesPerView: 3 }, // 3 slides para desktop
        },
        centeredSlides: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // --- (Seu código existente) ---

    // 🔸 Função de rolagem suave para os botões "Saiba mais"
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const href = btn.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 🔸 Detecta horário e aplica tema automático
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 18) {
        document.body.classList.add('tema-claro');
    } else {
        document.body.classList.remove('tema-claro');
    }

    // 🔸 Estrutura futura de login / perfil lateral
    const user = JSON.parse(localStorage.getItem('usuarioSetland')) || null;
    carregarPerfil(); // Chamei a função

    function carregarPerfil() {
        if (!user) {
            console.log("Usuário não logado. Exibir opção de login.");
        } else {
            console.log(`Bem-vindo novamente, ${user.nome}`);
        }
    }

    // 🔸 Sistema base para futuras notificações e interações
    window.showAlert = function(msg, tipo = 'info') {
        const alerta = document.createElement('div');
        alerta.className = `alerta ${tipo}`;
        alerta.textContent = msg;
        document.body.appendChild(alerta);
        setTimeout(() => alerta.remove(), 4000);
    }
    
    console.log("🌟 Script Setland carregado com sucesso!");

}); // Fim do DOMContentLoaded
/* ==========================================================
   SCRIPT PRINCIPAL - SETLAND PARQUE TEMÁTICO
   ========================================================== */

// Aguarda o DOM (a página) carregar completamente
document.addEventListener('DOMContentLoaded', function() {

    // 🔸 INICIALIZAÇÃO DO CARROSSEL SWIPER (NA INDEX)
    // Verifica se estamos na página certa para rodar o Swiper
    if (document.querySelector('.showcase-carousel')) {
        const showcaseSwiper = new Swiper('.showcase-carousel', {
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            spaceBetween: 24,
            slidesPerView: 1,
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
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
    }

    // --- (Seu código existente) ---

    // 🔸 Função de rolagem suave
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const href = btn.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
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

    // 🔸 Estrutura de login / perfil
    const user = JSON.parse(localStorage.getItem('usuarioSetland')) || null;
    carregarPerfil();

    function carregarPerfil() {
        if (!user) {
            console.log("Usuário não logado. Exibir opção de login.");
        } else {
            console.log(`Bem-vindo novamente, ${user.nome}`);
            // Futuramente: alterar o botão "Login" para "Meu Perfil"
        }
    }

    // 🔸 Sistema base para futuras notificações e interações
    // Tornando a função global para ser acessada por outros scripts se necessário
    window.showAlert = function(msg, tipo = 'info', container = document.body) {
        // Remove alertas antigos
        const alertaAntigo = document.querySelector('.alerta');
        if (alertaAntigo) {
            alertaAntigo.remove();
        }

        const alerta = document.createElement('div');
        alerta.className = `alerta ${tipo}`;
        alerta.textContent = msg;

        if (container === document.body) {
            document.body.prepend(alerta); // Adiciona no topo do body
        } else {
            container.prepend(alerta); // Adiciona no topo do container (ex: formulário)
        }
        
        setTimeout(() => alerta.remove(), 4000);
    }

    // ==================================================
    // 🚀 NOVA LÓGICA DE AUTENTICAÇÃO (LOGIN E CADASTRO)
    // ==================================================

    const authContainer = document.querySelector('.auth-container');

    // --- LÓGICA DE CADASTRO (cadastro.html) ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const senha = document.getElementById('signupPassword').value;

            // Simples verificação se o usuário já existe
            const usuariosSalvos = JSON.parse(localStorage.getItem('usuariosSetland')) || [];
            const usuarioExistente = usuariosSalvos.find(user => user.email === email);

            if (usuarioExistente) {
                showAlert('Este e-mail já está cadastrado.', 'erro', authContainer);
            } else {
                // Adiciona o novo usuário
                const novoUsuario = { nome, email, senha }; // NOTA: Em um projeto real, a senha NUNCA é salva assim.
                usuariosSalvos.push(novoUsuario);
                localStorage.setItem('usuariosSetland', JSON.stringify(usuariosSalvos));

                showAlert('Cadastro realizado com sucesso!', 'sucesso', authContainer);

                // Redireciona para o login após 2 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        });
    }

    // --- LÓGICA DE LOGIN (login.html) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginPassword').value;

            const usuariosSalvos = JSON.parse(localStorage.getItem('usuariosSetland')) || [];
            
            // Procura o usuário no "banco de dados"
            const usuarioEncontrado = usuariosSalvos.find(user => user.email === email && user.senha === senha);

            if (usuarioEncontrado) {
                // Login bem-sucedido!
                // Salva o usuário logado na sessão (localStorage)
                localStorage.setItem('usuarioSetland', JSON.stringify(usuarioEncontrado));

                showAlert('Login efetuado! Redirecionando...', 'sucesso', authContainer);

                // Redireciona para a página inicial
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redireciona para a home
                }, 2000);

            } else {
                // Credenciais erradas
                showAlert('E-mail ou senha incorretos.', 'erro', authContainer);
            }
        });
    }
    
    console.log("🌟 Script Setland carregado com sucesso!");

}); // Fim do DOMContentLoaded
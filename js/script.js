/* ==========================================================
   SCRIPT PRINCIPAL - SETLAND PARQUE TEMÁTICO
   ========================================================== */

// Aguarda o DOM (a página) carregar completamente
document.addEventListener('DOMContentLoaded', function() {

    // 🔸 INICIALIZAÇÃO DO CARROSSEL SWIPER (NA INDEX)
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

    // ==================================================
    // 🚀 NOVA LÓGICA DE MODO CLARO/ESCURO (TOGGLE)
    // ==================================================
    
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Função para aplicar o tema salvo
    function aplicarTemaSalvo() {
        const temaSalvo = localStorage.getItem('theme');
        if (temaSalvo === 'light') {
            body.classList.add('light-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
        } else {
            body.classList.remove('light-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
        }
    }

    // Aplica o tema salvo assim que a página carrega
    aplicarTemaSalvo();

    // Lógica de clique no botão (se ele existir na página)
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            
            // Salva a preferência no localStorage
            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                themeToggleBtn.textContent = '☀️';
            } else {
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.textContent = '🌙';
            }
        });
    }

    // ==================================================
    // 🚀 NOVA LÓGICA DE MENU MOBILE (HAMBÚRGUER)
    // ==================================================
    
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenuList = document.getElementById('nav-menu-list');

    if (menuToggle && navMenuList) {
        menuToggle.addEventListener('click', () => {
            // Adiciona/remove a classe 'active' no <ul>
            navMenuList.classList.toggle('active');
            
            // Adiciona/remove a classe 'active' no botão (para o X)
            menuToggle.classList.toggle('active');
        });
    }

    // 🔸 Detecta horário e aplica tema automático
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 18) {
        document.body.classList.add('tema-claro');
    } else {
        document.body.classList.remove('tema-claro');
    }

    // 🔸 Estrutura de login / perfil (Apenas pega o usuário, a lógica de mudar o botão vem no final)
    const user = JSON.parse(localStorage.getItem('usuarioSetland')) || null;
    if (user) {
        console.log(`Bem-vindo novamente, ${user.nome}`);
    } else {
        console.log("Usuário não logado. Exibir opção de login.");
    }


    // 🔸 Sistema base para futuras notificações e interações
    window.showAlert = function(msg, tipo = 'info', container = document.body) {
        const alertaAntigo = document.querySelector('.alerta');
        if (alertaAntigo) {
            alertaAntigo.remove();
        }

        const alerta = document.createElement('div');
        alerta.className = `alerta ${tipo}`;
        alerta.textContent = msg;

        if (container === document.body) {
            document.body.prepend(alerta);
        } else {
            container.prepend(alerta);
        }
        
        setTimeout(() => alerta.remove(), 4000);
    }

    // ==================================================
    // 🚀 LÓGICA DE AUTENTICAÇÃO (LOGIN E CADASTRO)
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

            const usuariosSalvos = JSON.parse(localStorage.getItem('usuariosSetland')) || [];
            const usuarioExistente = usuariosSalvos.find(user => user.email === email);

            if (usuarioExistente) {
                showAlert('Este e-mail já está cadastrado.', 'erro', authContainer);
            } else {
                const novoUsuario = { nome, email, senha };
                usuariosSalvos.push(novoUsuario);
                localStorage.setItem('usuariosSetland', JSON.stringify(usuariosSalvos));

                showAlert('Cadastro realizado com sucesso!', 'sucesso', authContainer);

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
            const usuarioEncontrado = usuariosSalvos.find(user => user.email === email && user.senha === senha);

            if (usuarioEncontrado) {
                localStorage.setItem('usuarioSetland', JSON.stringify(usuarioEncontrado));
                showAlert('Login efetuado! Redirecionando...', 'sucesso', authContainer);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                showAlert('E-mail ou senha incorretos.', 'erro', authContainer);
            }
        });
    }

    // ==================================================
    // 🚀 LÓGICA DE INGRESSOS (ingressos.html)
    // ==================================================

    const ticketsPage = document.querySelector('.tickets-page');
    
    if (ticketsPage) {
        const ticketCards = ticketsPage.querySelectorAll('.ticket-card');
        const totalValueEl = document.getElementById('totalValue');
        const finalizarCompraBtn = document.getElementById('finalizarCompra');
        
        let carrinho = [];

        ticketCards.forEach(card => {
            const plusBtn = card.querySelector('.plus');
            const minusBtn = card.querySelector('.minus');
            const valueEl = card.querySelector('.counter-value');
            
            let quantidade = 0;

            plusBtn.addEventListener('click', () => {
                quantidade++;
                valueEl.textContent = quantidade;
                atualizarTotal();
            });

            minusBtn.addEventListener('click', () => {
                if (quantidade > 0) {
                    quantidade--;
                    valueEl.textContent = quantidade;
                    atualizarTotal();
                }
            });
        });

        function atualizarTotal() {
            let totalGeral = 0;
            carrinho = []; 

            ticketCards.forEach(card => {
                const quantidade = parseInt(card.querySelector('.counter-value').textContent);
                const preco = parseFloat(card.dataset.price);
                const tipo = card.dataset.type;
                
                totalGeral += quantidade * preco;
                
                if (quantidade > 0) {
                    carrinho.push({
                        tipo: tipo,
                        quantidade: quantidade,
                        precoUnitario: preco,
                        precoTotal: quantidade * preco
                    });
                }
            });

            totalValueEl.textContent = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        finalizarCompraBtn.addEventListener('click', () => {
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioSetland'));
            
            if (!usuarioLogado) {
                showAlert('Você precisa estar logado para comprar ingressos.', 'erro');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
                return;
            }

            if (carrinho.length === 0) {
                showAlert('Adicione pelo menos um ingresso ao carrinho.', 'erro', ticketsPage.querySelector('.tickets-container'));
                return;
            }

            localStorage.setItem('meusIngressos', JSON.stringify(carrinho));
            showAlert('Compra realizada com sucesso! Redirecionando...', 'sucesso', ticketsPage.querySelector('.tickets-container'));
            
            setTimeout(() => {
                window.location.href = 'meus-ingressos.html';
            }, 2000);
        });
    } // <-- Fim do "if (ticketsPage)"

    // (AQUELE COLCHETE EXTRA ESTAVA AQUI, EU O REMOVI)

    // ==================================================
    // 🚀 LÓGICA DE MEUS INGRESSOS (meus-ingressos.html)
    // ==================================================
    
    const meusIngressosPage = document.querySelector('.meus-ingressos-page');
    
    if (meusIngressosPage) {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioSetland'));
        const container = document.getElementById('ingressoCardsContainer');
        const logoutButton = document.getElementById('logoutButton');

        if (!usuarioLogado) {
            showAlert('Você precisa estar logado para ver esta página.', 'erro');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
            return;
        }

        const ingressosComprados = JSON.parse(localStorage.getItem('meusIngressos')) || [];

        if (ingressosComprados.length === 0) {
            container.innerHTML = `
                <div class="ingresso-none">
                    <p>Você ainda não comprou nenhum ingresso.</p>
                    <a href="ingressos.html">Clique aqui para comprar!</a>
                </div>
            `;
        } else {
            ingressosComprados.forEach(ingresso => {
                const precoFormatado = ingresso.precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                
                const cardHTML = `
                    <div class="ingresso-card">
                        <span class="ingresso-tipo">${ingresso.tipo}</span>
                        <span class="ingresso-qtd">x ${ingresso.quantidade}</span>
                        <span class="ingresso-preco-total">${precoFormatado}</span>
                    </div>
                `;
                container.innerHTML += cardHTML;
            });
        }
        
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('usuarioSetland');
            localStorage.removeItem('meusIngressos');
            showAlert('Deslogado com sucesso! Redirecionando...', 'sucesso');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    } // <-- Fim do "if (meusIngressosPage)"


    // ==================================================
    // 🚀 LÓGICA GLOBAL (Roda em todas as páginas)
    // ==================================================

    // Atualiza o botão de Login/Meu Perfil em TODAS as páginas
    const navLoginButton = document.getElementById('nav-login-button');
    if (navLoginButton && user) {
        navLoginButton.textContent = 'Meu Perfil';
        navLoginButton.href = 'meus-ingressos.html';
    }
    
    console.log("🌟 Script Setland carregado com sucesso!");

}); // Fim do DOMContentLoaded
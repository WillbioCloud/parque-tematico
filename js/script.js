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

    // ==================================================
    // 🚀 NOVA LÓGICA DE INGRESSOS (ingressos.html)
    // ==================================================

    const ticketsPage = document.querySelector('.tickets-page');
    
    if (ticketsPage) {
        const ticketCards = ticketsPage.querySelectorAll('.ticket-card');
        const totalValueEl = document.getElementById('totalValue');
        const finalizarCompraBtn = document.getElementById('finalizarCompra');
        
        let carrinho = []; // Array para guardar os ingressos

        ticketCards.forEach(card => {
            const plusBtn = card.querySelector('.plus');
            const minusBtn = card.querySelector('.minus');
            const valueEl = card.querySelector('.counter-value');
            
            let quantidade = 0;
            const preco = parseFloat(card.dataset.price);
            const tipo = card.dataset.type;

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
            carrinho = []; // Limpa o carrinho para recalcular

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

            // Formata como moeda (R$ 130,00)
            totalValueEl.textContent = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        // --- Finalizar Compra ---
        finalizarCompraBtn.addEventListener('click', () => {
            // 1. Verifica se está logado
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioSetland'));
            
            if (!usuarioLogado) {
                // Se não estiver logado, avisa e redireciona para o login
                showAlert('Você precisa estar logado para comprar ingressos.', 'erro');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
                return; // Para a execução
            }

            // 2. Verifica se adicionou ingressos
            if (carrinho.length === 0) {
                showAlert('Adicione pelo menos um ingresso ao carrinho.', 'erro', ticketsPage.querySelector('.tickets-container'));
                return;
            }

            // 3. Salva no localStorage e redireciona
            // (Vamos salvar como 'meusIngressos')
            localStorage.setItem('meusIngressos', JSON.stringify(carrinho));
            
            showAlert('Compra realizada com sucesso! Redirecionando...', 'sucesso', ticketsPage.querySelector('.tickets-container'));
            
            setTimeout(() => {
                window.location.href = 'meus-ingressos.html';
            }, 2000);
        });
    }

    // Também vamos atualizar o botão de Login na navbar se o usuário estiver logado
    const navLoginButton = document.getElementById('nav-login-button');
    if (navLoginButton && user) {
        navLoginButton.textContent = 'Meu Perfil';
        navLoginButton.href = 'meus-ingressos.html'; // Manda para a pág. de ingressos
    // ... (Aqui termina o bloco do ticketsPage)
    }

    // ==================================================
    // 🚀 NOVA LÓGICA DE MEUS INGRESSOS (meus-ingressos.html)
    // ==================================================
    
    const meusIngressosPage = document.querySelector('.meus-ingressos-page');
    
    if (meusIngressosPage) {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioSetland'));
        const container = document.getElementById('ingressoCardsContainer');
        const logoutButton = document.getElementById('logoutButton');

        // 1. Proteger a página: verificar se está logado
        if (!usuarioLogado) {
            // Se não estiver logado, chuta para a página de login
            showAlert('Você precisa estar logado para ver esta página.', 'erro');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
            return; // Para a execução
        }

        // 2. Carregar os ingressos
        const ingressosComprados = JSON.parse(localStorage.getItem('meusIngressos')) || [];

        if (ingressosComprados.length === 0) {
            // Se não comprou nada, mostra mensagem
            container.innerHTML = `
                <div class="ingresso-none">
                    <p>Você ainda não comprou nenhum ingresso.</p>
                    <a href="ingressos.html">Clique aqui para comprar!</a>
                </div>
            `;
        } else {
            // Se comprou, gera os cards
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
        
        // 3. Funcionalidade do botão Logout
        logoutButton.addEventListener('click', () => {
            // Limpa os dados de "sessão" e "compras"
            localStorage.removeItem('usuarioSetland');
            localStorage.removeItem('meusIngressos'); // Limpa os ingressos ao sair
            
            showAlert('Deslogado com sucesso! Redirecionando...', 'sucesso');
            
            setTimeout(() => {
                window.location.href = 'index.html'; // Manda para a home
            }, 2000);
        });
    }

    // (O código que atualiza o botão de Login na navbar já existe no passo anterior)
    
    console.log("🌟 Script Setland carregado com sucesso!");

}); // Fim do DOMContentLoaded
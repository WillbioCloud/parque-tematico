/* ==========================================================
   SCRIPT PRINCIPAL - SETLAND PARQUE TEMÁTICO
   ========================================================== */

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
// (vai aparecer ao clicar no ícone 👤 na navbar, quando for implementado)
const user = JSON.parse(localStorage.getItem('usuarioSetland')) || null;

// Exemplo futuro de estrutura
function carregarPerfil() {
  if (!user) {
    console.log("Usuário não logado. Exibir opção de login.");
  } else {
    console.log(`Bem-vindo novamente, ${user.nome}`);
  }
}

// 🔸 Sistema base para futuras notificações e interações
function showAlert(msg, tipo = 'info') {
  const alerta = document.createElement('div');
  alerta.className = `alerta ${tipo}`;
  alerta.textContent = msg;
  document.body.appendChild(alerta);
  setTimeout(() => alerta.remove(), 4000);
}

// Exemplo de uso: showAlert("Bem-vindo à Setland!", "sucesso");

console.log("🌟 Script Setland carregado com sucesso!");

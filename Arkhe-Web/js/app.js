/* =========================================================
   Conta do usuário (círculo no cabeçalho, ao lado do "Baixar App")
   ========================================================= */
(function () {
  'use strict';

  var K_CONTA = 'arkhe_conta';   // { nome, email } da conta cadastrada
  var K_SESSAO = 'arkhe_sessao'; // e-mail de quem está conectado

  /* ---------- armazenamento ---------- */
  function lerLocal(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lerSessao(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }

  function conta() {
    try {
      var c = JSON.parse(lerLocal(K_CONTA));
      return c && c.email ? c : null;
    } catch (e) { return null; }
  }

  function usuarioLogado() {
    var c = conta();
    if (!c) return null;
    var s = lerLocal(K_SESSAO) || lerSessao(K_SESSAO);
    return s === c.email ? c : null;
  }

  function iniciarSessao(email, manter) {
    try {
      localStorage.removeItem(K_SESSAO);
      sessionStorage.removeItem(K_SESSAO);
      (manter ? localStorage : sessionStorage).setItem(K_SESSAO, email);
    } catch (e) {}
  }

  var normalizar = function (email) { return String(email || '').trim().toLowerCase(); };

  /* ---------- API usada por cadastro.html e login.html ---------- */
  function cadastrar(dados) {
    var c = { nome: String(dados.nome || '').trim(), email: normalizar(dados.email) };
    try { localStorage.setItem(K_CONTA, JSON.stringify(c)); } catch (e) {}
    iniciarSessao(c.email, true);
    atualizar();
    return c;
  }

  function entrar(email, manter) {
    var c = conta();
    if (!c || c.email !== normalizar(email)) return { ok: false };
    iniciarSessao(c.email, !!manter);
    atualizar();
    return { ok: true, nome: c.nome };
  }

  function sair() {
    try {
      localStorage.removeItem(K_SESSAO);
      sessionStorage.removeItem(K_SESSAO);
    } catch (e) {}
    atualizar();
  }

  /* ---------- interface ---------- */
  var btn, painel;

  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto !== undefined) n.textContent = texto;
    return n;
  }

  function link(href, classe, texto) {
    var a = el('a', classe, texto);
    a.href = href;
    return a;
  }

  function atualizar() {
    if (!btn) return;
    var c = conta();
    var logado = usuarioLogado();

    painel.replaceChildren();

    if (logado) {
      btn.textContent = (logado.nome || logado.email).charAt(0).toUpperCase();
      btn.classList.add('logado');
      btn.setAttribute('aria-label', 'Minha conta: ' + (logado.nome || logado.email));

      var perfil = el('div', 'conta-perfil');
      var info = el('div');
      info.append(el('div', 'conta-nome', logado.nome || 'Minha conta'), el('div', 'conta-email', logado.email));
      perfil.append(el('div', 'conta-avatar', btn.textContent), info);

      var sairBtn = el('button', 'conta-acao secundaria', 'Sair');
      sairBtn.type = 'button';
      sairBtn.addEventListener('click', function () { sair(); fechar(); });

      painel.append(el('h3', 'conta-titulo', 'Minha conta'), perfil, sairBtn);
      return;
    }

    btn.textContent = '👤';
    btn.classList.remove('logado');
    btn.setAttribute('aria-label', 'Minha conta');

    painel.appendChild(el('h3', 'conta-titulo', 'Minha conta'));

    if (c) {
      painel.append(
        el('p', 'conta-texto', 'Encontramos a conta de ' + c.email + '. Entre para continuar.'),
        link('login.html', 'conta-acao primaria', 'Entrar'),
        link('cadastro.html', 'conta-acao secundaria', 'Criar outra conta')
      );
    } else {
      painel.append(
        el('p', 'conta-texto', 'Você ainda não tem uma conta. Cadastre-se para salvar seus pets favoritos e acompanhar seus pedidos.'),
        link('cadastro.html', 'conta-acao primaria', 'Cadastre-se'),
        link('login.html', 'conta-acao secundaria', 'Já tenho conta · Entrar')
      );
    }
  }

  function abrir(mostrar) {
    painel.hidden = !mostrar;
    btn.setAttribute('aria-expanded', String(mostrar));
  }
  function fechar() { abrir(false); }

  function montar() {
    var destino = document.querySelector('.nav-right');
    if (!destino || document.getElementById('contaBtn')) return;

    var wrap = el('div', 'conta-wrap');

    btn = el('button', 'conta-btn');
    btn.type = 'button';
    btn.id = 'contaBtn';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'contaPanel');

    painel = el('div', 'conta-panel');
    painel.id = 'contaPanel';
    painel.setAttribute('role', 'dialog');
    painel.setAttribute('aria-label', 'Minha conta');
    painel.hidden = true;

    wrap.append(btn, painel);
    destino.appendChild(wrap);

    btn.addEventListener('click', function () { abrir(painel.hidden); });
    document.addEventListener('click', function (e) {
      if (!painel.hidden && !e.target.closest('.conta-wrap')) fechar();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fechar();
    });
    window.addEventListener('storage', atualizar);

    atualizar();
  }

  window.ArkheConta = {
    conta: conta,
    usuarioLogado: usuarioLogado,
    cadastrar: cadastrar,
    entrar: entrar,
    sair: sair,
    atualizar: atualizar
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();

/* =========================================================
   GUARDA DE ROTA: PETMATCH (Apenas checa as preferências)
   ========================================================= */
window.ArkheAcessarPetMatch = function() {
  // Verifica se o usuário já respondeu ao quiz de preferências
  const prefs = localStorage.getItem('arkhe_preferencias_petmatch');
  
  if (prefs) {
    // Se já tem preferências salvas, vai direto para o PetMatch real (o novo que fizemos)
    window.location.href = 'petmatch.html';
  } else {
    // Se não tem, vai para o Quiz de Preferências primeiro
    window.location.href = 'preferencias.html';
  }
};

// ============ DIAGNOSTICO PAGE ============
function handleUpload(input){
  const preview = document.getElementById('uploadPreview');
  const result = document.getElementById('diagResult');
  if(!input.files || !input.files[0]) return;
  preview.textContent = '✅ ' + input.files[0].name + ' enviada com sucesso. Analisando...';
  if(result){
    setTimeout(()=>{
      result.classList.add('show');
      result.scrollIntoView({behavior:'smooth', block:'center'});
    }, 900);
  }
}
document.addEventListener('DOMContentLoaded', ()=>{
  const box = document.getElementById('uploadBox');
  if(box){
    box.addEventListener('dragover', e=>{e.preventDefault(); box.style.borderColor = '#3a8d7d';});
    box.addEventListener('dragleave', ()=>{box.style.borderColor = '#e8b26a';});
    box.addEventListener('drop', e=>{
      e.preventDefault();
      box.style.borderColor = '#e8b26a';
      if(e.dataTransfer.files.length){
        const input = document.getElementById('fileInput');
        input.files = e.dataTransfer.files;
        handleUpload(input);
      }
    });
  }
});

// ============ CONSULTAS PAGE (filters) ============
document.addEventListener('click', function(e){
  if(e.target.classList && e.target.classList.contains('chip')){
    const group = e.target.dataset.filter;
    document.querySelectorAll(`.chip[data-filter="${group}"]`).forEach(c=>c.classList.remove('selected'));
    e.target.classList.add('selected');
  }
});
function agendar(nome){
  alert('Consulta com ' + nome + ' agendada! Você receberá um link de vídeo por e-mail.');
}

// ============ MARKETPLACE PAGE ============
let currentCat = 'racao';
function setCategory(btn){
  document.querySelectorAll('.cat-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  currentCat = btn.dataset.cat;
  filterProducts();
}
function filterProducts(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  const q = (document.getElementById('productSearch')?.value || '').toLowerCase();
  const sort = document.getElementById('sortSelect')?.value;
  const cards = Array.from(grid.children);

  cards.forEach(card=>{
    const matchesCat = card.dataset.cat === currentCat;
    const matchesQuery = card.textContent.toLowerCase().includes(q);
    card.style.display = (matchesCat && matchesQuery) ? '' : 'none';
  });

  if(sort === 'menor' || sort === 'maior'){
    const visible = cards.filter(c=>c.style.display !== 'none');
    visible.sort((a,b)=>{
      const pa = parseFloat(a.dataset.price), pb = parseFloat(b.dataset.price);
      return sort === 'menor' ? pa - pb : pb - pa;
    });
    visible.forEach(c=>grid.appendChild(c));
  }
}
function addToCart(name){
  alert(name + ' adicionado ao carrinho!');
}
document.addEventListener('DOMContentLoaded', filterProducts);

// ============ PETMATCH PAGE ============
const pmDeck = [
  {name:'Simba', desc:'Cachorro Caramelo - 2 anos - Dócil & Brincalhão', tags:['Vacinado','Castrado','Dócil'], emoji:'🐕'},
  {name:'Tunico', desc:'Gato Laranja - 1 ano - Calmo & Curioso', tags:['Vacinado','Vermifugado','Manso'], emoji:'🐈'},
  {name:'Luna', desc:'Gata Cinza - 2 anos - Carinhosa', tags:['Castrada','Dócil'], emoji:'🐈'},
  {name:'Max', desc:'Vira-lata - 3 anos - Ativo & Leal', tags:['Vacinado','Adestrado'], emoji:'🐕'}
];
let pmIndex = 0;
function renderPmCard(){
  const el = document.getElementById('pmCard');
  if(!el) return;
  const p = pmDeck[pmIndex % pmDeck.length];
  document.getElementById('pmPhoto').textContent = p.emoji;
  document.getElementById('pmName').textContent = p.name;
  document.getElementById('pmDesc').textContent = p.desc;
  document.getElementById('pmTags').innerHTML = p.tags.map(t=>`<span class="pm-tag">${t}</span>`).join('');
}
function pmSwipe(action){
  if(action === 'yes'){
    document.getElementById('pmModalPet').textContent = document.getElementById('pmPhoto').textContent;
    document.getElementById('pmModal').classList.add('show');
  } else {
    pmIndex++;
    renderPmCard();
  }
}
function closePmModal(){
  document.getElementById('pmModal').classList.remove('show');
  pmIndex++;
  renderPmCard();
}
renderPmCard();
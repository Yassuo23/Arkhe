// ---------- LOGIN ----------
function handleLogin(e){
  e.preventDefault();
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('app-shell').style.display = 'block';
  showScreen('home');
  return false;
}

function logout(){
  closeSidebar();
  document.getElementById('app-shell').style.display = 'none';
  document.getElementById('screen-login').classList.add('active');
}

// ---------- SCREEN NAV ----------
function showScreen(name){
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + name);
  if(target) target.classList.add('active');
  closeSidebar();

  // sync bottom nav highlight
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const map = {home:0, ongs:1, petmatch:2, favoritos:3, perfil:4};
  if(map[name] !== undefined){
    document.querySelectorAll('.nav-item')[map[name]].classList.add('active');
  }
  const shell = document.getElementById('app-shell');
  if(shell) shell.scrollTop = 0;
  window.scrollTo(0,0);
}

// ---------- SIDEBAR ----------
function openSidebar(){
  document.getElementById('sidebar').classList.add('show');
  document.getElementById('sidebarOverlay').classList.add('show');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('show');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

// ---------- FAVORITE HEART ----------
function toggleFav(btn){
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
}

// ---------- ONG ANIMAL SEARCH ----------
function filterAnimals(q){
  q = q.toLowerCase();
  document.querySelectorAll('#animalList .pet-list-item').forEach(item=>{
    const name = item.dataset.name || '';
    item.style.display = name.includes(q) ? 'flex' : 'none';
  });
}

// ---------- PETMATCH ----------
const petDeck = [
  {name:'Tunico, 1', tags:'calmo, curioso, medroso', quote:'"Um amorzinho de gatinho"', emoji:'🐈'},
  {name:'Max, 2', tags:'ativo, brincalhão, leal', quote:'"Sempre pronto pra correr!"', emoji:'🐕'},
  {name:'Luna, 3', tags:'calma, carinhosa, dócil', quote:'"Adora um colo à tarde"', emoji:'🐈'},
];
let petIndex = 0;

function renderMatchCard(){
  const p = petDeck[petIndex % petDeck.length];
  document.querySelector('.match-photo').textContent = p.emoji;
  document.getElementById('matchName').textContent = p.name;
  document.querySelector('.match-tags').textContent = p.tags;
  document.querySelector('.match-quote').textContent = p.quote;
}

function swipePet(action){
  if(action === 'yes'){
    openMatchModal();
  } else {
    petIndex++;
    renderMatchCard();
  }
}
function openMatchModal(){
  document.getElementById('matchModal').classList.add('show');
}
function closeMatchModal(){
  document.getElementById('matchModal').classList.remove('show');
  petIndex++;
  renderMatchCard();
}
renderMatchCard();

// ---------- CHAT ----------
const botReplies = [
  "Entendi. Pode me dizer há quanto tempo esse sintoma começou?",
  "Isso pode ter várias causas. Recomendo manter o pet hidratado e observar por 24h.",
  "Com base no que você descreveu, sugiro agendar uma consulta com um veterinário da nossa rede.",
  "Você pode enviar uma foto da área afetada para eu analisar melhor?"
];
function sendChat(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  const body = document.getElementById('chatBody');

  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerHTML = `<p>${escapeHtml(text)}</p>`;
  body.appendChild(userBubble);
  input.value = '';
  body.scrollTop = body.scrollHeight;

  setTimeout(()=>{
    const reply = botReplies[Math.floor(Math.random()*botReplies.length)];
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = `<span class="chat-avatar">🐾</span><p>${reply}</p>`;
    body.appendChild(botBubble);
    body.scrollTop = body.scrollHeight;
  }, 600);
}
function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// init: hide app shell until login
document.getElementById('app-shell').style.display = 'none';

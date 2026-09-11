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
// drag & drop support
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
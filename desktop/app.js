// ---------- NAVIGATION ----------
function showView(name, btn){
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const active = btn || document.querySelector(`.nav-btn[data-view="${name}"]`);
  if(active) active.classList.add('active');
  if(window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('show');
  window.scrollTo(0,0);

  // lazy-init charts the first time each view is shown
  if(name === 'dashboard') initDashboardCharts();
  if(name === 'analytics') initAnalyticsCharts();
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('show');
}

// ---------- SETTINGS TABS ----------
function showTab(name, btn){
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ---------- CADASTROS ----------
function filterCadastros(q){
  q = q.toLowerCase();
  document.querySelectorAll('#cadastrosTable tbody tr').forEach(row=>{
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}
function openNewRegistration(){
  alert('Abrindo formulário de novo cadastro...');
}
function editRow(btn){
  const row = btn.closest('tr');
  const name = row.querySelector('strong').textContent;
  alert('Editando cadastro: ' + name);
}
function deleteRow(btn){
  const row = btn.closest('tr');
  const name = row.querySelector('strong').textContent;
  if(confirm('Remover cadastro de ' + name + '?')){
    row.remove();
    recalcStats();
  }
}
function recalcStats(){
  const rows = document.querySelectorAll('#cadastrosTable tbody tr');
  document.getElementById('statTotal').textContent = rows.length;
  document.getElementById('statAtivos').textContent = document.querySelectorAll('#cadastrosTable tbody tr[data-status="Ativo"]').length;
  document.getElementById('statPendentes').textContent = document.querySelectorAll('#cadastrosTable tbody tr[data-status="Pendente"]').length;
  document.getElementById('statInativos').textContent = document.querySelectorAll('#cadastrosTable tbody tr[data-status="Inativo"]').length;
}

// ---------- DATE ----------
document.getElementById('dashDate').textContent =
  'Visão geral do sistema - ' + new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long', year:'numeric'});

// ---------- CHARTS ----------
Chart.defaults.font.family = "'Segoe UI', sans-serif";
let dashCharts = null, analyticsCharts = null;

function initDashboardCharts(){
  if(dashCharts) return;
  dashCharts = true;

  new Chart(document.getElementById('chartTrend'), {
    type:'line',
    data:{
      labels:['Jan','Fev','Mar','Abr','Mai','Jun'],
      datasets:[{data:[420,310,590,820,720,900], borderColor:'#e2703a', backgroundColor:'rgba(226,112,58,.15)', tension:.4, fill:true, pointBackgroundColor:'#e2703a'}]
    },
    options:{plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });

  new Chart(document.getElementById('chartStatus'), {
    type:'pie',
    data:{
      labels:['Ativos','Pendentes','Inativos','Arquivados'],
      datasets:[{data:[40,30,20,10], backgroundColor:['#5b9bd5','#8fc4de','#cfe6f0','#f3d9a8']}]
    },
    options:{plugins:{legend:{position:'right'}}}
  });

  new Chart(document.getElementById('chartCompare'), {
    type:'bar',
    data:{
      labels:['Jan','Fev','Mar','Abr','Mai','Jun'],
      datasets:[{data:[350,260,600,780,680,880], backgroundColor:'#e8a04d', borderRadius:4}]
    },
    options:{plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });
}

function initAnalyticsCharts(){
  if(analyticsCharts) return;
  analyticsCharts = true;

  new Chart(document.getElementById('chartActivity'), {
    type:'line',
    data:{
      labels:['00:00','04:00','08:00','12:00','16:00','20:00'],
      datasets:[{data:[120,80,420,510,480,260], borderColor:'#5b9bd5', backgroundColor:'rgba(91,155,213,.15)', fill:true, tension:.4, pointRadius:0}]
    },
    options:{plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });

  new Chart(document.getElementById('chartWeekly'), {
    type:'bar',
    data:{
      labels:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
      datasets:[
        {label:'Realizado', data:[3900,3400,5100,4500,5700,2900,2700], backgroundColor:'#7fbfae'},
        {label:'Meta', data:[3500,3200,4700,4300,5200,3100,2900], backgroundColor:'#e8a04d'}
      ]
    },
    options:{plugins:{legend:{position:'bottom'}}, scales:{y:{beginAtZero:true}}}
  });

  new Chart(document.getElementById('chartRadar'), {
    type:'radar',
    data:{
      labels:['SEO','Acessibilidade','Performance','UX','Segurança','Velocidade'],
      datasets:[
        {label:'Atual', data:[80,75,68,72,60,85], backgroundColor:'rgba(14,110,95,.25)', borderColor:'#0e6e5f'},
        {label:'Anterior', data:[65,60,70,60,55,70], backgroundColor:'rgba(226,112,58,.2)', borderColor:'#e2703a'}
      ]
    },
    options:{plugins:{legend:{position:'bottom'}}}
  });
}

// init first view
initDashboardCharts();

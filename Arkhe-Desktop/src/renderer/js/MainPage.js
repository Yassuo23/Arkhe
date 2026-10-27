let animaisCadastrados

const CarregarDados = async () => {
    console.log("CarregarDados iniciou");

    try {
        console.log("Chamando VerificarLogado...");
        const logado = await window.api.VerificarLogado();
        console.log("VerificarLogado retornou:", logado);

        if (!logado) {
            console.log("Nenhum usuário está logado");
            return;
        }

        console.log("Chamando PegarDados...");
        const dados = await window.api.PegarDados();
        console.log("PegarDados retornou:", dados);

        const botaoPerfil = document.querySelector("#label-name");
        const nomePerfil = document.querySelector("#nomePerfil");
        const emailPerfil = document.querySelector("#emailPerfil");
        const nascimentoPerfil = document.querySelector("#nascimentoPerfil");

        if (botaoPerfil && dados) {
            botaoPerfil.textContent = dados.name || "Usuário";
            nomePerfil.value = dados.name || "";
            emailPerfil.textContent = dados.email || "Não informado";

            const nascimento = dados.birthday
                ? String(dados.birthday).slice(0, 10)
                : "";
            nascimentoPerfil.textContent = /^\d{4}-\d{2}-\d{2}$/.test(nascimento)
                ? nascimento.split("-").reverse().join("/")
                : nascimento || "Não informado";
        }
    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
    }
};

CarregarDados();


//Função para navegar entre as abas da página

const sidebar = document.querySelector('#sidebar');
const btnToggleSidebar = document.querySelector('#btn-toggle-sidebar');

const secoesPorAba = {
    dashboard: 'dashboard',
    projetos: 'sec-projetos',
    ia: 'sec-ai',
    petmatch: 'sec-match',
    configuracoes: 'sec-configuracoes',
    perfil: 'sec-perfil'
};

function switchTab(event, aba) {
    event.preventDefault();

    const idSecao = secoesPorAba[aba];
    const secaoSelecionada = idSecao && document.getElementById(idSecao);

    if (!secaoSelecionada) {
        console.error(`A seção da aba "${aba}" não foi encontrada.`);
        return;
    }

    document.querySelectorAll('.tab-section').forEach((secao) => {
        secao.classList.add('d-none');
    });
    secaoSelecionada.classList.remove('d-none');

    const linkAtivo = event.currentTarget.matches('.nav-link')
        ? event.currentTarget
        : document.querySelector('#BotaoPerfil');

    sidebar.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.toggle('active', link === linkAtivo);
    });
}



const btnCadastroAnimais = document.querySelector("#btnCadatrarAnimal");

btnCadastroAnimais.addEventListener("click", async () => {
    await window.api.abrirCadastroAnimal();
});

const carregarAnimais = async () => {
    animaisCadastrados = await window.api.carregarAnimais();

    const codigoCards = animaisCadastrados.map((animal) => `
        <article class="pet-card">
            <img src="../../../Arkhe-Web/Images/luna.jpg" alt="Luna">
            <div class="pet-card-body">
                <div class="pet-card-heading">
                    <div>
                        <h4>${animal.nome}</h4>
                    </div>
                </div>
                <dl class="pet-details">
                    <div><dt>Espécie</dt><dd>${animal.especie}</dd></div>
                    <div><dt>Idade</dt><dd>${animal.idade}</dd></div>
                    <div><dt>Cor</dt><dd>${animal.cor}</dd></div>
                </dl>
                <div class="pet-card-actions">
                    <button class="pet-action pet-action-edit" type="button">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="pet-action pet-action-remove" type="button">
                        <i class="bi bi-trash"></i> Remover
                    </button>
                </div>
            </div>
        </article>
    `).join('')

    document.querySelector("#containerPets").innerHTML = codigoCards;
}

carregarAnimais();
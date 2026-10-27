let animaisCadastrados

//função para carregar os dados do usuário

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

        if (dados) {
            const nome = dados.name || dados.nome || "Usuário";

            if (botaoPerfil) {
                botaoPerfil.textContent = nome;
            }
            if (nomePerfil) {
                nomePerfil.value = dados.name || dados.nome || "";
            }
            if (emailPerfil) {
                emailPerfil.textContent = dados.email || "Não informado";
            }

            const nascimento = dados.birthday
                ? String(dados.birthday).slice(0, 10)
                : "";
            if (nascimentoPerfil) {
                nascimentoPerfil.textContent = /^\d{4}-\d{2}-\d{2}$/.test(nascimento)
                    ? nascimento.split("-").reverse().join("/")
                    : nascimento || "Não informado";
            }
        }
    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
    }
};

CarregarDados();


//Função para navegar entre as abas da página principal

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

if (btnCadastroAnimais) {
    btnCadastroAnimais.addEventListener("click", async () => {
        try {
            await window.api.abrirCadastroAnimal();
        } catch (erro) {
            console.error("Não foi possível abrir o cadastro do animal:", erro);
        }
    });
}

const carregarAnimais = async () => {
    const containerPets = document.querySelector("#containerPets");
    if (!containerPets) {
        return;
    }

    try {
        animaisCadastrados = await window.api.carregarAnimais();
        if (!Array.isArray(animaisCadastrados)) {
            throw new TypeError("A resposta do banco não contém uma lista de animais.");
        }

        containerPets.replaceChildren(...animaisCadastrados.map((animal) => {
            const card = document.createElement("article");
            card.className = "pet-card";
            card.innerHTML = `
                <img src="../../../Arkhe-Web/Images/luna.jpg" alt="">
                <div class="pet-card-body">
                    <div class="pet-card-heading"><h4 class="pet-name"></h4></div>
                    <dl class="pet-details">
                        <div><dt>Espécie</dt><dd class="pet-species"></dd></div>
                        <div><dt>Idade</dt><dd class="pet-age"></dd></div>
                        <div><dt>Cor</dt><dd class="pet-color"></dd></div>
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
            `;

            card.querySelector(".pet-name").textContent = animal.nome ?? "";
            card.querySelector(".pet-species").textContent = animal.especie ?? "";
            card.querySelector(".pet-age").textContent = animal.idade ?? "";
            card.querySelector(".pet-color").textContent = animal.cor ?? "";
            card.querySelector(".pet-action-remove").dataset.animalId = animal.id;

            const especie = String(animal.especie ?? "").trim().toLocaleLowerCase("pt-BR");
            const imagemPorEspecie = {
                gato: "../images/gato.jpg",
                gata: "../images/gato.jpg",
                cachorro: "../images/cachorro.jpeg",
                cachorra: "../images/cachorro.jpeg"
            };
            const imagem = card.querySelector("img");
            imagem.src = imagemPorEspecie[especie] || "../../../Arkhe-Web/Images/luna.jpg";
            imagem.alt = animal.nome ? `Foto de ${animal.nome}` : "Foto do animal";

            return card;
        }));
    } catch (erro) {
        console.error("Não foi possível carregar os animais:", erro);
    }
};

let idAnimalParaExcluir = null;
const modalConfirmarExclusaoElement = document.querySelector('#modalConfirmarExclusao');
const modalConfirmarExclusao = modalConfirmarExclusaoElement
    ? new bootstrap.Modal(modalConfirmarExclusaoElement)
    : null;

document.querySelector("#containerPets")?.addEventListener("click", (event) => {
    const botaoRemover = event.target.closest(".pet-action-remove[data-animal-id]");
    if (!botaoRemover || !modalConfirmarExclusao) {
        return;
    }

    idAnimalParaExcluir = botaoRemover.dataset.animalId;
    const animal = animaisCadastrados.find(
        (item) => String(item.id) === idAnimalParaExcluir
    );

    if (!animal) {
        console.error("O animal selecionado não foi encontrado.");
        return;
    }

    document.querySelector('#nomeInsumoExcluir').textContent = animal.nome;
    modalConfirmarExclusao.show();
});

document.querySelector('#btnConfirmarExclusao')?.addEventListener('click', async () => {
    if (idAnimalParaExcluir === null) {
        return;
    }

    try {
        await window.api.excluirAnimal(idAnimalParaExcluir);
        idAnimalParaExcluir = null;
        modalConfirmarExclusao.hide();
        await carregarAnimais();
    } catch (erro) {
        console.error("Não foi possível excluir o animal:", erro);
    }
});

carregarAnimais();
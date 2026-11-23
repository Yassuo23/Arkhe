let animaisCadastrados: Animal[] = [];

//função para carregar os dados do usuário

const CarregarDados = async () => {
    try {
        const logado = await window.api.VerificarLogado();
        if (!logado) {
            return;
        }

        const dados = await window.api.PegarDados();

        const botaoPerfil = document.querySelector("#label-name");
        const nomePerfil = document.querySelector("#nomePerfil");
        const emailPerfil = document.querySelector("#emailPerfil");
        const nascimentoPerfil = document.querySelector("#nascimentoPerfil");

        if (dados) {
            const nome = dados.name || dados.nome || "Usuário";

            if (botaoPerfil) {
                botaoPerfil.textContent = nome;
            }
                if (nomePerfil instanceof HTMLInputElement) {
                    nomePerfil.value = dados.name || dados.nome || "";
            }
            if (emailPerfil) {
                emailPerfil.textContent = dados.email || "Não informado";
            }

            let nascimento = "";
            if (dados.birthday instanceof Date) {
                nascimento = [
                    dados.birthday.getFullYear(),
                    String(dados.birthday.getMonth() + 1).padStart(2, "0"),
                    String(dados.birthday.getDate()).padStart(2, "0")
                ].join("-");
            } else if (dados.birthday) {
                nascimento = String(dados.birthday).slice(0, 10);
            }
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

if (sidebar instanceof HTMLElement && btnToggleSidebar instanceof HTMLButtonElement) {
    btnToggleSidebar.addEventListener("click", () => {
        const collapsed = sidebar.classList.toggle("collapsed");
        btnToggleSidebar.setAttribute("aria-expanded", String(!collapsed));
    });
}

const secoesPorAba: Record<string, string> = {
    dashboard: 'dashboard',
    projetos: 'sec-projetos',
    ia: 'sec-ai',
    petmatch: 'sec-match',
    configuracoes: 'sec-configuracoes',
    perfil: 'sec-perfil'
};

function switchTab(event: Event, aba: string) {
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

    const target = event.currentTarget as HTMLElement | null;
    const linkAtivo = target?.matches('.nav-link')
        ? target
        : document.querySelector('#BotaoPerfil');

    sidebar?.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.toggle('active', link === linkAtivo);
    });
}

document.querySelectorAll<HTMLElement>("[data-tab]").forEach((link) => {
    link.addEventListener("click", (event) => {
        const aba = link.dataset.tab;
        if (aba) {
            switchTab(event, aba);
        }
    });
});



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

            const petName = card.querySelector(".pet-name");
            const petSpecies = card.querySelector(".pet-species");
            const petAge = card.querySelector(".pet-age");
            const petColor = card.querySelector(".pet-color");
            const petRemove = card.querySelector<HTMLElement>(".pet-action-remove");
            petName && (petName.textContent = animal.nome ?? "");
            petSpecies && (petSpecies.textContent = animal.especie ?? "");
            petAge && (petAge.textContent = String(animal.idade ?? ""));
            petColor && (petColor.textContent = animal.cor ?? "");
            petRemove && (petRemove.dataset.animalId = String(animal.id ?? ""));

            const especie = String(animal.especie ?? "").trim().toLocaleLowerCase("pt-BR");
            const imagemPorEspecie: Record<string, string> = {
                gato: "../images/gato.jpg",
                gata: "../images/gato.jpg",
                cachorro: "../images/cachorro.jpeg",
                cachorra: "../images/cachorro.jpeg"
            };
            const imagem = card.querySelector<HTMLImageElement>("img");
            if (imagem) {
                imagem.src = imagemPorEspecie[especie] || "../../../Arkhe-Web/Images/luna.jpg";
                imagem.alt = animal.nome ? `Foto de ${animal.nome}` : "Foto do animal";
            }

            return card;
        }));
    } catch (erro) {
        console.error("Não foi possível carregar os animais:", erro);
    }
};

let idAnimalParaExcluir: string | null = null;
const modalConfirmarExclusaoElement = document.querySelector('#modalConfirmarExclusao');
const modalConfirmarExclusao = modalConfirmarExclusaoElement
    ? new bootstrap.Modal(modalConfirmarExclusaoElement)
    : null;

document.querySelector("#containerPets")?.addEventListener("click", (event: Event) => {
    const target = event.target instanceof Element ? event.target : null;
    const botaoRemover = target?.closest<HTMLElement>(".pet-action-remove[data-animal-id]");
    if (!botaoRemover || !modalConfirmarExclusao) {
        return;
    }

    idAnimalParaExcluir = botaoRemover.dataset.animalId ?? null;
    const animal = animaisCadastrados.find(
        (item) => String(item.id) === idAnimalParaExcluir
    );

    if (!animal) {
        console.error("O animal selecionado não foi encontrado.");
        return;
    }

    const nomeInsumoExcluir = document.querySelector<HTMLElement>('#nomeInsumoExcluir');
    if (nomeInsumoExcluir) {
        nomeInsumoExcluir.textContent = animal.nome;
    }
    modalConfirmarExclusao.show();
});

document.querySelector('#btnConfirmarExclusao')?.addEventListener('click', async () => {
    if (idAnimalParaExcluir === null) {
        return;
    }

    try {
        await window.api.excluirAnimal(idAnimalParaExcluir);
        idAnimalParaExcluir = null;
        modalConfirmarExclusao?.hide();
        await carregarAnimais();
    } catch (erro) {
        console.error("Não foi possível excluir o animal:", erro);
    }
});

carregarAnimais();
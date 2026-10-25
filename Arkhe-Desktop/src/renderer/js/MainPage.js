
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

        if (botaoPerfil && dados) {
            botaoPerfil.textContent = dados.name;
        }
    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
    }
};

CarregarDados();


const sidebar = document.querySelector('#sidebar');
const btnToggleSidebar = document.querySelector('btn-toggle-sidebar');
const botaoPerfil = document.querySelector("#botaoConfig")

botaoPerfil.addEventListener("click", async (e) => {
    const abrirPerfil = await window.api.abrirPerfil

})


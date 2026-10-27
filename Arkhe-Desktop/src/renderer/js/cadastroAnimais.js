const formAnimais = document.querySelector("#form-cadastro-animal");

formAnimais.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(e.target));
    dados.nome = String(dados.nome);
    dados.cor = String(dados.cor);
    dados.raca = String(dados.raca)
    dados.idade = Number(dados.idade);
    dados.especie = String(dados.especie);
    try {
        const resposta = await window.api.cadastrarAnimal(dados);
        console.log("Animal Cadastrado!!!");
    }
    catch (erro) {
        console.error("Não foi possível cadastrar o animal:", erro);
    }
});
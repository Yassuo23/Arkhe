const formAnimais = document.querySelector<HTMLFormElement>("#form-cadastro-animal");

formAnimais?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const campos = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    const dados: Animal = {
        nome: String(campos.nome ?? ""),
        cor: String(campos.cor ?? ""),
        raca: String(campos.raca ?? ""),
        idade: Number(campos.idade ?? 0),
        especie: String(campos.especie ?? "")
    };
    try {
        const resposta = await window.api.cadastrarAnimal(dados);
        console.log("Animal Cadastrado!!!");
    }
    catch (erro) {
        console.error("Não foi possível cadastrar o animal:", erro);
    }
});
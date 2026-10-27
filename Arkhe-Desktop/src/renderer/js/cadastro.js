const FormCadastro = document.querySelector("#FormSingUp")

FormCadastro.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const campos = Object.fromEntries(new FormData(e.target));
    const data = {
        name: String(campos.nome || "").trim(),
        email: String(campos.email || "").trim(),
        password: String(campos.senha || ""),
        birthday: String(campos.aniversario || ""),
        tel: String(campos.tel || "").trim()
    };

    try{
        await window.api.signUp(data);
        console.log("Usuário cadastrado!!!");
        e.target.reset();
    }
    catch (erro){
        console.error("Não foi possível cadastrar o usuário:", erro);
    }


})
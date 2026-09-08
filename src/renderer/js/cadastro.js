const FormCadastro = document.querySelector("#FormSingUp")

FormCadastro.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));
    data.name = String(data.name);
    data.email = String(data.email);
    data.password = String(data.password);
    data.birthday = String(data.birthday);
    data.tel = Number(data.tel);

    try{
        const answer = await window.api.singUp(data);
        console.log("Usuário cadastrado!!!");
        e.target.reset();
    }
    catch (erro){
        console.log("Fudeu, não deu pra cadastrar");
    }


})
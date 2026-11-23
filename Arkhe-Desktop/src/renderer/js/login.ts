const form = document.querySelector<HTMLFormElement>("#FormLogin");

if (form){
    form.addEventListener("submit", async (e: SubmitEvent) => {
        e.preventDefault();


        const dt = Object.fromEntries(new FormData(e.target as HTMLFormElement));
        const payload = {
            email: String(dt.email || "").trim(),
            password: String(dt.password || "").trim()
        }

        try 
        {
            const success = await window.api.login(payload)

            if (success){
                console.log("Login efetuado com sucesso");
                await window.api.openMainPage();
            }
            else{
                window.alert("Senha ou email incorretos");
            }

        } 
        catch (error)
        {
                console.log("Erro ao validar o login", error);
                window.alert("Não foi possível efetuar o login");
        }
    })
}
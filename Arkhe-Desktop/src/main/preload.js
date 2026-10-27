const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("api", {

    openMainPage: () => ipcRenderer.invoke('openMainPage'),
    signUp: (data) => ipcRenderer.invoke("signUp", data),
    login: (payload) => ipcRenderer.invoke("login", payload),
    PegarDados: () => ipcRenderer.invoke("PegarDados"),
    VerificarLogado: () => ipcRenderer.invoke("VerificarLogado"),
    abrirCadastroAnimal: () => ipcRenderer.invoke("modalCadastroAnimal:abrir"),
    cadastrarAnimal: (dados) => ipcRenderer.invoke("animal:cadastrar", dados),
    carregarAnimais: () => ipcRenderer.invoke("animal:carregar"),
    excluirAnimal: (id) => ipcRenderer.invoke("animal:excluir", id)
})
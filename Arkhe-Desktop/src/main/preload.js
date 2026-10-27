const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("api", {

    openMainPage: () => ipcRenderer.invoke('openMainPage'),
    singUp: (data) => ipcRenderer.invoke("singUp", data),
    login: (payload) => ipcRenderer.invoke("login", payload),
    PegarDados: () => ipcRenderer.invoke("PegarDados"),
    VerificarLogado: () => ipcRenderer.invoke("VerificarLogado"),
    abrirCadastroAnimal: () => ipcRenderer.invoke("modalCadastroAnimal:abrir"),
    cadastrarAnimal: (dados) => ipcRenderer.invoke("animal:cadastrar", dados),
    carregarAnimais: () => ipcRenderer.invoke("animal:carregar")
})
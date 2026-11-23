import { contextBridge, ipcRenderer } from "electron";

interface CadastroUsuario {
    name: string;
    email: string;
    password: string;
    birthday: string;
    tel: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface Animal {
    nome: string;
    cor: string;
    raca: string;
    idade: number;
    especie: string;
}

contextBridge.exposeInMainWorld("api", {
    openMainPage: () => ipcRenderer.invoke('openMainPage'),
    signUp: (data: CadastroUsuario) => ipcRenderer.invoke("signUp", data),
    login: (payload: LoginPayload) => ipcRenderer.invoke("login", payload),
    PegarDados: () => ipcRenderer.invoke("PegarDados"),
    VerificarLogado: () => ipcRenderer.invoke("VerificarLogado"),
    abrirCadastroAnimal: () => ipcRenderer.invoke("modalCadastroAnimal:abrir"),
    cadastrarAnimal: (dados: Animal) => ipcRenderer.invoke("animal:cadastrar", dados),
    carregarAnimais: () => ipcRenderer.invoke("animal:carregar"),
    excluirAnimal: (id: number | string) => ipcRenderer.invoke("animal:excluir", id)
});
const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("api", {

    openCadastros: () => ipcRenderer.invoke('openCadastros'),
    singUp: (data) => ipcRenderer.invoke("singUp", data)
    
})
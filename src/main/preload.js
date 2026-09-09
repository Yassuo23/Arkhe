const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("api", {

    openMainPage: () => ipcRenderer.invoke('openMainPage'),
    singUp: (data) => ipcRenderer.invoke("singUp", data),
    login: (payload) => ipcRenderer.invoke("login", payload)
    
})
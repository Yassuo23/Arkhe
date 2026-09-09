const { BrowserWindow, Menu, Tray, app, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const connection = require("./dataBase");
const { resolve } = require("dns");


const connectionTest = () => {
    connection.connect((erro) => {
        if (erro) {
            console.error("Erro de conecção com o banco", erro.message);
            dialog.showErrorBox(
                'Erro de conecção com o banco',
                `Não foi possível se conectar com o banco de dados Mysql.\n\n${erro.message}`
            );
            return;
        }
        console.log("Conectado com o banco de dados")
    })
}

app.whenReady().then(() => {

    connectionTest();

    const window = new BrowserWindow({
        width: 500,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    window.loadFile(path.join(__dirname, "../renderer/login.html"));
});

ipcMain.handle('openMainPage', () => {
    
    const windowCadastros = new BrowserWindow({

        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    }) 
    
    windowCadastros.loadFile(path.join(__dirname, "../renderer/index.html"))

})

ipcMain.handle('singUp', (event, data) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users (name, email, password, birthday) VALUES (?, ?, ?, ?)'
    
        connection.query(sql, [data.name, data.email, data.password, data.birthday], (erro, result) => {
            if (erro){
                reject(erro);
                return;
            }
            resolve({id:result.insertId, ...data})
            console.log("Dados cadastrados!!!");
        });
    });
});

ipcMain.handle("login", (e, payload) => {
    return new Promise((resolve, reject) => {
        const dbData = 'SELECT id, name, password FROM users WHERE email = ?';

        connection.query(dbData, [payload.email], (erro, resultados) => {
            if (erro) {
                console.error(erro);
                reject(erro);
                return;
            }

            const usuario = resultados[0];
            const autenticado = usuario && usuario.password === payload.password;

            resolve(autenticado ? {
                id: usuario.id,
                name: usuario.name,
                email: payload.email
            } : null);
        });
    });
})


const { BrowserWindow, Menu, Tray, app, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const connection = require("./dataBase");
const { resolve } = require("dns");
let MainWindow;


let usuarioLogado = null
let logado = false

//Testa a conexão com o banco de dados
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

    const windowLogin = new BrowserWindow({
        width: 500,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });


    windowLogin.loadFile(path.join(__dirname, "../renderer/login.html"));


});

//Função para abrir a página principal 
ipcMain.handle('openMainPage', (event) => {
    
    const mainWindow = new BrowserWindow({

        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    }) 
    
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

    MainWindow = mainWindow;

    const loginWindow = BrowserWindow.fromWebContents(event.sender);
    if (loginWindow && !loginWindow.isDestroyed()) {
        loginWindow.close();
    }

})

ipcMain.handle('modalCadastroAnimal:abrir', async () => {
    if (!MainWindow || MainWindow.isDestroyed()) {
        throw new Error('A janela principal não está disponível para abrir o cadastro.');
    }

    const modalCadastro = new BrowserWindow({
        width: 500,
        height: 700,
        parent: MainWindow,
        modal: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    await modalCadastro.loadFile(path.join(__dirname, "../renderer/cadastroAnimal.html"));
});

ipcMain.handle('signUp', (event, data) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users (name, email, password, birthday, tel) VALUES (?, ?, ?, ?, ?)'
    
        connection.query(sql, [data.name, data.email, data.password, data.birthday || null, data.tel || null], (erro, result) => {
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
        const dbData = 'SELECT id, name, email, password, birthday, tel FROM users WHERE email = ?';

        connection.query(dbData, [payload.email], (erro, resultados) => {
            if (erro) {
                console.error(erro);
                reject(erro);
                return;
            }

            const usuario = resultados[0];
            const autenticado = usuario && usuario.password === payload.password;

            if(!autenticado){
                usuarioLogado = null
                logado = false;
                resolve(null);
                return;
            }

            usuarioLogado = {
                id: usuario.id,
                name: usuario.name,
                email: usuario.email,
                birthday: usuario.birthday,
                tel: usuario.tel
            }

            logado = true
            resolve(usuarioLogado);

        });
    });
});

ipcMain.handle("PegarDados", () => {
    return usuarioLogado;
})

ipcMain.handle("VerificarLogado", () => {
    return logado;
});


ipcMain.handle("animal:cadastrar", (_event, dados) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO animais (nome, cor, raca, idade, especie) VALUES (?, ?, ?, ?, ?)'

        connection.query(sql, [dados.nome, dados.cor, dados.raca, dados.idade, dados.especie], (erro, result) => {
            if (erro){
                reject(erro);
                return;
            }
            resolve({ id: result.insertId, ...dados });
            console.log("Animal Cadastrado!!!");
        });
    });
});

ipcMain.handle("animal:carregar", (_event, dados) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM animais ORDER BY idade DESC'

        connection.query(sql, (erro, result) => {
            if (erro){
                reject(erro);
                return;
            }
            resolve(result)

        });
    });
});

ipcMain.handle('animal:excluir', (_event, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM animais WHERE id = ?';

        connection.query(sql, [id], (erro, resultado) => {
            if (erro) {
                reject(erro);
                return;
            }
            resolve(resultado);
        });
    });
});

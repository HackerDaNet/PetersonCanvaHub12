//Importa o framework express
const express = require('express');
const cors = require('cors');
const connection = require('./db.js');
const server = express();

//Middleware que permite o servidor entender requisições com JSON no corpo (req.body)
server.use(express.json());
server.use(cors());

//===================================
//Método HTTP: GET
//LISTAR TODOS OS CURSOS
//localhost:3000/cursos
server.get('/jogos', (req, res) => {
    const sql = 'SELECT * FROM jogos';
    connection.query(sql , (erro , resultados) => {
        if(erro){
            return res.status(500).json({erro: erro.message});
        }
        return res.json(resultados);
    });
});

//===================================
//Método HTTP: GET
//LISTAR jogos por nome
//localhost:3099/jogos/busca?nome=Minecraft
server.get('/jogos/busca', (req, res) => {
    const nomeBusca = req.query.nome;
    if (!nomeBusca) {
        return res.status(400).json({ erro: 'Parâmetro nome é obrigatório' });
    }

    const sql = 'SELECT * FROM jogos WHERE nome LIKE ?';
    const nomeVariavel = `%${nomeBusca}%`;
    connection.query(sql, [nomeVariavel], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }
        return res.json(resultados);
    });
});

//===================================
//Método HTTP: GET
//LISTAR jogos por gênero/categoria
//localhost:3099/jogos/buscaCategoria?genero=Ação
server.get('/jogos/buscaCategoria', (req, res) => {
    const generoBusca = req.query.genero;
    if (!generoBusca) {
        return res.status(400).json({ erro: 'Parâmetro genero é obrigatório' });
    }

    // Busca por gênero inteiro ou por combinação com separador '/'
    const sql = `SELECT * FROM jogos WHERE 
        genero = ? OR 
        genero LIKE ? OR 
        genero LIKE ? OR 
        genero LIKE ?`;
    const parametros = [
        generoBusca,
        `${generoBusca}/%`,
        `%/${generoBusca}`,
        `%/${generoBusca}/%`
    ];

    connection.query(sql, parametros, (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }
        return res.json(resultados);
    });
});

//Método HTTP: GET
//LISTAR UM UNICO CURSO
//localhost:3099/jogos/2
server.get('/jogos/:id', (req, res) => {
    const sql = 'SELECT * FROM jogos WHERE id = ?';

    connection.query(sql, [req.params.id], (erro, resultados) => {
        if(erro){
            return res.status(500).json({erro: erro.message})
    }
    return res.json(resultados)
})
});

//Método HTTP: POST
//CRIAR UM NOVO CURSO
//localhost:3000/cursos
//{ "name": "Curso de Python" }
server.post('/jogos', (req, res)=> {

    
    const { nome, preco, genero, data_entrada, data_saida } = req.body
    const sql = 'INSERT INTO jogos (nome, preco, genero, data_entrada, data_saida) VALUES (?, ?, ?, ?, ?)';

    connection.query(sql , [nome, preco, genero, data_entrada, data_saida] , (erro , resultados) => {
        if(erro){
            return res.status(500).json({erro: erro.message})
        }
        return res.json({
            mensagem: 'Jogo cadastrado com sucesso',
            id: resultados.insertId,
            nome: nome
        })
    });
});

//Middleware global
server.use((req, res, next) => {
    console.log("Requisição chamada");
    return next();
});

//Middleware local
function cursoExiste(req, res, next) {
    if(!req.body.nome) {
        return res.status(400).json({ error: "Nome do curso é obrigatório" });
    }
    return next();
}

//Middleware local
//Verifica se o id curso existe
function idcursoExiste(req, res, next) {
    if(!cursos[req.params.id]) {
        return res.status(400).json({ error: "Curso não existe" });
    }
    return next();
}

//Método HTTP: PUT
//ATUALIZAR UM CURSO
//localhost:3000/cursos/0
server.put('/jogos/:id', (req, res) => {

       // Obtém o índice do curso a ser atualizado pela URL
    const id = req.params.id;
    const nome = req.body.nome;
    const preco = req.body.preco;
    const genero = req.body.genero;
    const data_entrada = req.body.data_entrada;
    const data_saida = req.body.data_saida;
    const sql = 'UPDATE jogos SET nome = ?, preco = ?, genero = ?, data_entrada = ?, data_saida = ? WHERE id = ?';

    connection.query(sql , [nome, preco, genero, data_entrada, data_saida, id] , (erro , resultados) => {
        if(erro){
            return res.status(500).json({erro: erro.message});
        }
        return res.json({
            mensagem: 'Jogo Atualizado com Sucesso!',
            nome: nome,
            id: id
        })
    } );

});

//Método HTTP: DELETE
//DELETAR UM CURSO
//localhost:3000/cursos/1
server.delete('/jogos/:id', (req, res) => {

    // Obtém o índice do curso a ser removido
    const id = req.params.id;
    const sql = 'DELETE FROM jogos WHERE id = ?'

    connection.query(sql , [id], (erro) => {
        if(erro){
            return res.status(500).json({erro: erro.message})
        }
        return res.json({
            mensagem: 'Jogo removido com sucesso!'
        })

    });
});



//O metodo listen() faz o servidor começar a escutar
// requisiçoes em uma determinada porta.
server.listen(3099 , () => {
    console.log("Servidor rodando na porta 3099");
});

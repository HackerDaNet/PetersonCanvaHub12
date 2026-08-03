//promessas

async function listarJogos() {
    const resposta = await fetch('http://localhost:3099/jogos');
    const jogos = await resposta.json();

    const lista = document.getElementById('lista');
    lista.innerHTML='';

   jogos.forEach(jogo => {
    lista.innerHTML += `
    <li>
    ${jogo.id} - ${jogo.nome} - ${jogo.preco} - ${jogo.genero} - ${jogo.data_entrada} - ${jogo.data_saida}
    <div>
    <button onclick="editarJogos(${jogo.id}, '${jogo.nome}', ${jogo.preco}, '${jogo.genero}', '${jogo.data_entrada}', '${jogo.data_saida}')">Editar</button>
    <button onclick="excluirJogo(${jogo.id})">Excluir</button>
    <div>
    </li>
    `
})

}

async function cadastrarJogo(){
const nome = document.getElementById('nome').value;
const preco = document.getElementById('preco').value;
const genero = document.getElementById('genero').value;
const data_entrada = document.getElementById('data_entrada').value;
const data_saida = document.getElementById('data_saida').value;

if(nome === '') {
    alert('O nome do jogo é obrigatório');
    return;
}
if(preco === '') {
    alert('O preço do jogo é obrigatório');
    return;
}
if(genero === '') {
    alert('O gênero do jogo é obrigatório');
    return;
}
if(data_entrada === '') {
    alert('A data de entrada do jogo é obrigatória');
    return;
}
if(data_saida === '') {
    alert('A data de saída do jogo é obrigatória');
    return;
}
const resposta = await fetch('http://localhost:3099/jogos', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ nome, preco, genero, data_entrada, data_saida })
});

const dados = await resposta.json();
alert('Jogo cadastrado com sucesso' + dados.nome);

document.getElementById('nome').value = '';
listarJogos();
}

async function editarJogos(id, nomeAtual, precoAtual, generoAtual, dataEntradaAtual, dataSaidaAtual){
const novoNome = prompt('Digite o novo nome: ', nomeAtual);
const novoPreco = prompt('Digite o novo preço: ', precoAtual);
const novoGenero = prompt('Digite o novo gênero: ', generoAtual);
const novaDataEntrada = prompt('Digite a nova data de entrada: ', dataEntradaAtual);
const novaDataSaida = prompt('Digite a nova data de saída: ', dataSaidaAtual);
if(!novoNome || !novoPreco || !novoGenero || !novaDataEntrada || !novaDataSaida) return;

await fetch(`http://localhost:3099/jogos/${id}`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body:JSON.stringify({nome: novoNome, preco: novoPreco, genero: novoGenero, data_entrada: novaDataEntrada, data_saida: novaDataSaida})
})
listarJogos();
}

async function excluirJogo(id) {
    if (!confirm('Deseja realmente excluir este jogo?')) return;

    await fetch(`http://localhost:3099/jogos/${id}`, {
        method: 'DELETE'
    });

    listarJogos();
}
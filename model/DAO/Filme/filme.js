/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 *      Filme
 * Data: 2026-04-17
 * Autor: Kaique Carvalho Costa
 * Versão: 1.0
 * 
 *******************************************************************************************************/

//Impor da biblioteca para gereniciar o banco de dados MySQL no node.js
const knex = require('knex')

//Import do arquivo de configuração para conexão com o banco de dados MySQL
const knexDatabaseConfig = require('../../database_config_knex/knexFile.js')

//Criar a conexão com o banco de dados MySQL
const knexConection = knex(knexDatabaseConfig.development)


//Função para inserir dados na tabela de filmes
const insertFilme = async function(filme) {
    try {
        
    

    let sql = `insert into tbl_filme (
                    nome, 
                    data_lancamento, 
                    duracao, 
                    sinopse, 
                    avaliacao, 
                    valor, 
                    capa
                    )
	        values(
                    '${filme.nome}', 
		            '${filme.data_lancamento}', 
                    '${filme.duracao}',
                    '${filme.sinopse}',
                    if('${filme.avaliacao}' = '', null, '${filme.avaliacao}'),
                    '${filme.valor}',
                    '${filme.capa}');`

                   

    //Executar o ScriptSQL no Banco de Dados
    let result = await knexConection.raw(sql)

    if(result)
        return true
    else
        return false

    } catch (error) {
        return false
    }
    
}

//Função para atualizar um filme existente na tabela
const updateFilme = async function(filme) {
    try{
        let sql = `update tbl_filme set
        nome = '${filme.nome}',
        sinopse = '${filme.sinopse}',
        capa = '${filme.capa}',
        data_lancamento = '${filme.data_lancamento}',
        duracao = '${filme.duracao}',
        valor = '${filme.duracao}',
        avaliacao = if('${filme.avaliacao}' = '', null, '${filme.avaliacao}')
    where id = ${filme.id};`

        let result = await knexConection.raw(sql)

        if(result){
            return true
        
            }else{
                return false
            }
        
    
    }
        catch(error){
         return false   
        }
    
}

//Função para retornar todos os dados da tabela de filme
const selectAllFilme = async function() {
    //Script sql para listar todos os filme
    try {
        let sql = 'select * from tbl_filme order by id desc'
        
        //Executa o bd e script e guarda o retorno do bd.
        //Pode ser um ERROR de um array com dados
        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

        console.log(result)
    } catch (error) {
        return false
        
    }

}


//Funçaõ para retornar os dados do filme fitrando pelo ID
const selectByIdFilme = async function(id) {
    try{
        let sql = `select * from tbl_filme where id=${id}`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
           return result[0]
        }else{
            return false
        }
    }
    catch(error){
        return false

    }
    
}

//Função para excluir um filme pelo ID
const deleteFilme = async function(id) {
    try{
        let sql = `delete from tbl_filme where id=${id}`

        let result = await knexConection.raw(sql)

        if(result){            
            return true
    }else{
        return false
    }
   
}catch (error){
  return false 
}

}
module.exports = {
    insertFilme,
    updateFilme,
    selectAllFilme,
    selectByIdFilme,
    deleteFilme
}
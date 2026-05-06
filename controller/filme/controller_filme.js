/*********************************************************************************************************
 * Objetivo: Arquivo responsavel pela validação, tratamento,
 *           manipulacao de dados para o CRUD de filmes
 * Data: 2026-04-17
 * Autor: Kaique Carvalho
 * Versão: 1.0
 *********************************************************************************************************/

//Import do arquivo de configurações de mensagem do projeto
const configMessages = require('../modulo/configMessages.js')

//Import do arquivo de DAO para manipular os dados do filme no Banco de Dados
const filmeDAO = require('../../model/DAO/Filme/filme.js')

//Função para inserir um novo filme
const inserirNovoFilme = async function(filme, contentType) {

    //Cria uma copia dos JSON do arquivo de configuração de mensagem
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
   

    if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função para validar a entrada dos daods do filme
            let validacao = validarFilme(filme)

            if(!validacao.status){
                customMessage.DEFAULT_MESSAGE = customMessage.ERROR_BAD_REQUEST
                customMessage.DEFAULT_MESSAGE.field = validacao.field
                return customMessage.DEFAULT_MESSAGE
            }
            
            //Encaminha os dados do Filme para o DAO inserir no BD
            let result =await filmeDAO.insertFilme(filme)

            if(result){ //201
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

            }else{ //500
                customMessage.DEFAULT_MESSAGE.status = customMessage.ERROR_INTERNAL_SERVER.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.ERROR_INTERNAL_SERVER.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.ERROR_INTERNAL_SERVER.message

            }

            return customMessage.DEFAULT_MESSAGE
    }else{
        return customMessage.ERROR_CONTENT_TYPE //415
    }

        } catch (error) {
            return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500      
        }
}

//Função para validar os dados de cadastro do Filme
const validarFilme = function(filme) {
    let messageJSON = JSON.parse(JSON.stringify(configMessages))


    if(filme.nome == undefined || filme.nome == '' || filme.nome == null ||  filme.nome.length > 80){
        messageJSON.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400                                                                    //diferente de 10 por não pode ter menos ou mais
    }else if(filme.data_lancamento == undefined || filme.data_lancamento == '' || filme.data_lancamento == null ||  filme.data_lancamento.length != 10){
        messageJSON.ERROR_BAD_REQUEST.field = '[DATA_LANCAMENTO] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400
    }else if(filme.duracao == undefined || filme.duracao == '' || filme.duracao == null ||  filme.duracao.length <= 5){
        messageJSON.ERROR_BAD_REQUEST.field = '[DURAÇÃO] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400
    }else if( filme.sinopse == undefined || filme.sinopse == '' || filme.sinopse == null){
        messageJSON.ERROR_BAD_REQUEST.field = '[SINOPSE] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400
    }else if(isNaN(filme.avaliacao) || filme.avaliacao.length > 3){
        messageJSON.ERROR_BAD_REQUEST.field = '[AVALIAÇÃO] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400
    }else if( filme.valor == undefined || filme.valor == '' || filme.valor == null || isNaN(filme.valor) || filme.valor.split('.')[0].length > 3){
        messageJSON.ERROR_BAD_REQUEST.field = '[VALOR] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400
    }else if(filme.capa.length > 255){
        messageJSON.ERROR_BAD_REQUEST.field = '[CAPA] INVÁLIDO'
    }else{
        return false
    }
}

//Função para atualizar um filme existente
const atualizarFilme = async function(filme, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarFilme = await buscarFilme(id)

            if(resultBuscarFilme.status){

                let validar = await validarFilme(filme)

                console.log(validar);
                

                if(!validar){

                    filme.id = Number(id)
                    let result = await filmeDAO.updateFilme(filme)
                        if(result){
                            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_UPDATED_ITEM.status
                            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_UPDATED_ITEM.status_code
                            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_UPDATED_ITEM.message

                            return customMessage.DEFAULT_MESSAGE
                        }else{
                            return customMessage.ERROR_INTERNAL_SERVER_MODEL//500 (model)
                        }
                }else{
                    return validar //400 da validação dos bancos de dados
                }

            }else{
                return resultBuscarFilme//400(ID INVÁLIDO ), 404(NAO ENCONTRADO) ou 500
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE //415
        }  


    }
    catch(error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER//500(controller)

    }
    
}

//Função para retornar todos os filmes existentes
const listarFilme = async function() {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await filmeDAO.selectAllFilme()

        //Validação para verifircar se o DAO conseguiu processar o script
        if(result){
            //Validação para verificar se o conteudo do array rem dados de
            //retorno ou se esta vazio
            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.filme = result

                return customMessage.DEFAULT_MESSAGE


            }else{
                return customMessage.ERROR_NOT_FOUND //404
            }
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL//500 (model)
        }

    }catch(error) {
        console.log(error)
        
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER//500(controller)
    }

}


//Função para buscar um filme pelo ID
const buscarFilme = async function(id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if(id == undefined || String(id).replaceAll(' ', '') == '' || id == null ||  isNaN(id) || id <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '(ID) INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{
            let result = await filmeDAO.selectByIdFilme(id)
            console.log(result);
            
            if(result){
                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.filme = result

                    return customMessage.DEFAULT_MESSAGE //200
                }else{
                    return customMessage.ERROR_NOT_FOUND //404
                }

            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
        

        

    }   
    catch(error){
        console.log(error);
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}





//Função para excluir um filme
const excluirFilme = async function(id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarFilme = await buscarFilme(id)
            if(resultBuscarFilme.status){

                let result = await filmeDAO.deleteFilme(id) 

                if(result){
                    return configMessages.SUCESS_DELETED_ITEM //200 ou 204

                }else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }

            }else{
                return resultBuscarFilme //400 e 404
            }
        
    } catch (error) {
        
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 controller
    }



}

module.exports = {
    inserirNovoFilme,
    atualizarFilme,
    listarFilme,
    buscarFilme,
    excluirFilme

}
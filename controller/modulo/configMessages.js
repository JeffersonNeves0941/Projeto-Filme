/***********************************************************************************************************
 * 
 * ObjetiVo: Arquivo responsável pela padronização e status code do projeto de filmes
 * Data: 2026-04-17
 * Autor: Kaique Carvalho
 * Versão: 1.0
 * 
 **********************************************************************************************************/

const { response } = require("express")

//Padronização dos retornos da api(Cabeçario)
const DEFAULT_MESSAGE =  {
    api_description: 'API para controlar o projeto de filmes',
    development: 'Jefferson Neves',
    version: '1.0.4.26',
    status: Boolean,
    status_code: Number,
    message: String,
    response: {}
}

//Mensagens de ERRO do projeto de filmes
const ERROR_BAD_REQUEST = {
    status: 'false',
    status_code: 400,
    message: 'O servidor não pode ou não irá processar a solicitação devido a algo que é percebido como um erro do cliente.'
}

//Mensagens de SUCESSO do projeto de filmes
const SUCCESS_CREATED_ITEM = {
    status: 'true',
    status_code:201,
    message: 'Item inserido com sucesso.'
}

//Mensagens de ERRO do servidor MODEL
const ERROR_INTERNAL_SERVER = {
    status: 'false',
    status_code:500,
    message: 'Não foi possivel processar a requisição devido a um erro interno no servidor [MODEL].'
}

const ERROR_CONTENT_TYPE = {
    status: 'false',
    status_code: 415,
    message: 'Não foi possivel processar a requisição pois o formato de dados encaminhado não é suportado pelo servidor, apenas deve ser utilizado JSON.'
}

const ERROR_INTERNAL_SERVER_CONTROLLER = {
    status: 'false',
    status_code:500,
    message
    
    : 'Não foi possivel processar a requisição devido a um erro interno no servidor [CONTROLLER].'
}
const ERROR_NOT_FOUND = {
    status: 'false',
    status_code:404,
    message: 'Não foram encontrados dados para retorno'
}

const SUCESS_RESPONSE = {
    status: true,
    status_code:200,

}


const SUCESS_UPDATED_ITEM = {status: true, status_code: 200, message: 'Item atualizado com sucesso'}
const SUCESS_DELETED_ITEM = {stauts: true,status_code:200, message:'Item excluido com sucesso'}

    module.exports = {
        DEFAULT_MESSAGE,
        ERROR_BAD_REQUEST,
        SUCCESS_CREATED_ITEM,
        ERROR_INTERNAL_SERVER,
        ERROR_CONTENT_TYPE,
        ERROR_INTERNAL_SERVER_CONTROLLER,
        ERROR_NOT_FOUND,
        SUCESS_RESPONSE,
        SUCESS_UPDATED_ITEM,
        SUCESS_DELETED_ITEM
    }
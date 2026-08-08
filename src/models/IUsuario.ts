export default interface IUsuario {
    id: number,
    token: string,
    nome: string,
    telefone: string,
    dataCadastro: string,       
    dataUltimaAlteracao: string,
    email: string,
    senha: string,
    status: boolean,
    avatar: string
}
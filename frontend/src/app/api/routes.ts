import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api/v1';

export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`);
    return response.data;
  } catch (error) {
      console.error('Erro ao buscar Usuario:', error);
      throw error;
    }
};

export const createUsuarios = async (data: any) => {
  try {
      const response = await axios.get(`${API_URL}/usuarios`, data);
      return response.data;
  }catch (error) {
      console.error('Erro ao cadastrar o Usuario:', error);
      throw error;
  }
};

export const updateUsuarios = async (id: string, data: any) => {
  try {
      const response = await axios.put(`${API_URL}/usuarios/${id}`, data);
      return response.data;
  } catch (error) {
      console.error('Erro ao atualizar Usuario: ', error);
      throw error;
  }
};

export const deleteUsuario = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/usuarios/${id}`);
  } catch (error) {
    console.error('Erro ao deletar Usuario:', error);
    throw error;
  }
};

export const getGeneros = async () => {
  const response = await axios.get(`${API_URL}/generos`);
  return response.data.map((genero: { nome: string }) => genero.nome)
                      .sort((a: string, b: string) => a.localeCompare(b));
};

export const getEstados = async () => {
  const response = await axios.get(`${API_URL}/estados`);
  return response.data.map((estado: { nome: string }) => estado.nome)
                      .sort((a: string, b: string) => a.localeCompare(b));
};

export const getTipos = async () => {
  const response = await axios.get(`${API_URL}/tipos`);
  return response.data.map((tipo: { nome: string }) => tipo.nome)
                      .sort((a: string, b: string) => a.localeCompare(b));
};

export const getObras = async () => {
  const response = await axios.get(`${API_URL}/obras`);
  const obras = response.data;

  return obras.map((obra: { id: number, capa: string, titulo: string }) => ({
    id: obra.id,
    capa: obra.capa,
    titulo: obra.titulo
  }));
};

export const getObraDetails = async (obraId: number) => {
  const response = await axios.get(`${API_URL}/obras/${obraId}`);
  const data = response.data;

  return {
    id: data.id,
    titulo: data.titulo,
    sinopse: data.sinopse,
    capa: data.capa,
    autor: {
      nome: data.usuario.nome,
      fotoPerfil: data.usuario.foto_perfil
    },
    dataPublicacao: data.data_publicacao,
    tipo: data.tipo.nome,
    estado: data.estado.nome,
    generos: data.generos.map((genero: { nome: string }) => genero.nome),
    likes: data.likes
  };
};

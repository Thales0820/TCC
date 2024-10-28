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

export const getObraIds = async () => {
  try {
    const response = await axios.get(`${API_URL}/obras`); // Suponha que essa rota retorna uma lista de obras
    const data = response.data;

    // Retorna um array de IDs das obras
    return data.map((obra: { id: number }) => obra.id);
  } catch (error) {
    console.error("Erro ao buscar IDs de obras:", error);
    return [];
  }
};


export const getObraDetails = async (id: number) => {
  try {
      const response = await axios.get(`${API_URL}/obras/${id}`);
      const data = response.data;

      return {
          id: data.id,
          titulo: data.titulo,
          sinopse: data.sinopse,
          capa: `http://127.0.0.1:8000/${data.capa}`,
          autor: data.usuario.nome, // Altere para retornar apenas o nome como string
          dataPublicacao: data.data_publicacao,
          tipo: data.tipo,
          estado: data.estado,
          generos: data.generos,
          likes: data.likes,
          capitulos: data.capitulos || [
              { numero: 1124, titulo: "Melhor Amigo", visualizado: false },
              { numero: 1123, titulo: "Duas Semanas Perdidas", visualizado: false },
              { numero: 1122, titulo: "Quando a Hora Chegar", visualizado: false }
          ]
      };
  } catch (error) {
      console.error("Erro ao buscar detalhes da obra:", error);
      return null;
  }
};
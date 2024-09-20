import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api/v1';

export const getUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar Idosos:', error);
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
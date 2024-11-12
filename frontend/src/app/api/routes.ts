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

export const getGeneroIds = async () => {
  try {
    const response = await axios.get(`${API_URL}/generos`); // Suponha que essa rota retorna uma lista de obras
    const data = response.data;

    // Retorna um array de IDs das obras
    return data.map((genero: { id: number, nome: string }) => ({
      id: genero.id,
      nome: genero.nome
    }));
  } catch (error) {
    console.error("Erro ao buscar IDs de obras:", error);
    return [];
  }
};

export const getEstados = async () => {
  try {
    const response = await axios.get(`${API_URL}/estados`);
    // console.log("Qualquer:", response.data);
    return response.data.map((estado: { nome: string }) => estado.nome)
                        .sort((a: string, b: string) => a.localeCompare(b));
  } catch (error) {
    console.error("Erro ao buscar estados:", error);
    return [];
  }
};

export const getTipos = async () => {
  try {
    const response = await axios.get(`${API_URL}/tipos`);
    //console.log("Dados dos tipos:", response.data);
    return response.data.map((tipo: { nome: string }) => tipo.nome)
                        .sort((a: string, b: string) => a.localeCompare(b));
  } catch (error) {
    console.error("Erro ao buscar tipos:", error);
    return [];
  }
};

export const getLeituras = async () => {
  try {
    const response = await axios.get(`${API_URL}/leituras`);
    // console.log('Resposta da API: ', response.data)
    const leituras = response.data;

    return leituras.map((leitura: { id: number, tipo: string }) => ({
      id: leitura.id,
      tipo: leitura.tipo,
    }));
  } catch (error) {
    console.error('Erro ao buscar Leituras:', error)
    return []
  }
};

export const addToLista = async (usuarioId: number, obraId: number, leituraId: number) => {
    return await axios.post(`${API_URL}/listas`, {
      usuario_id: usuarioId,
      obra_id: obraId,
      leitura_id: leituraId
    })
}

export const updateLista = async (listaId: number, leituraId: number) => {
  try {
    const response = await axios.put(`${API_URL}/listas/${listaId}`, {
      leitura_id: leituraId,
    })
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar a lista:', error);
    throw error;
  }
}

export const getLista = async (usuarioId: number, obraId: number) => {
  try {
      const response = await fetch(`${API_URL}/listas`);
      const data = await response.json()
      
      // Filtrar a lista para verificar se existe uma entrada com o usuario_id e obra_id fornecidos
    const lista = data.find(
      (item: { usuario_id: number; obra_id: number; leitura: { id: number; tipo: string } }) =>
        item.usuario_id === usuarioId && item.obra_id === obraId
    );

    console.log("Dados da Lista para usuário e obra:", lista);
    return lista ? { listaId: lista.id, leituraId: lista.leitura.id, tipo: lista.leitura.tipo } : null;
  } catch (error) {
      console.error('Erro ao buscar obra na lista:', error);
      return null
  }
};

export const deletarLista = async (listaId: number) => {
  try {
      const response = await axios.delete(`${API_URL}/listas/${listaId}`);
      console.log("Obra removida da lista com sucesso!", response.data);
      return response.data; // Retorna a resposta para confirmação
  } catch (error) {
      console.error("Erro ao remover a obra da lista:", error);
      throw error;
  }
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

export const getObrasPorAutor = async (autorId: number) => {
  const response = await axios.get(`${API_URL}/obras`);
  const obras = response.data;

  // Filtra as obras pelo autorId no front-end
  const obrasDoAutor = obras
    .filter((obra: { autor_id: number }) => obra.autor_id === autorId)
    .map((obra: { id: number, capa: string, titulo: string, estado: { nome: string } }) => ({
      id: obra.id,
      capa: obra.capa,
      titulo: obra.titulo,
      estado: obra.estado.nome,
    }));

  return obrasDoAutor;
};

export const getObrasLista = async (usuarioId: number) => {
  try {
      // Faz uma requisição para obter todas as listas
      const response = await axios.get(`${API_URL}/listas`);
      const listas = response.data;

      // Filtra as obras que pertencem ao usuário específico e extrai apenas os dados necessários
      const listaUsuario = listas
          .filter((lista: { usuario_id: number }) => lista.usuario_id === usuarioId)
          .map((lista: {
            id: number;
            obra: { id: number; titulo: string; capa: string };
            leitura: { tipo: string };
          }) => ({
              id: lista.obra.id,
              titulo: lista.obra.titulo,
              capa: lista.obra.capa,
              leitura: lista.leitura.tipo
          }));

      return listaUsuario;

  } catch (error) {
      console.error("Erro ao buscar obras na lista do usuário:", error);
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
          autor_id: data.usuario.autor_id,
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

export const getObrasLikes = async () => {
  const response = await axios.get(`${API_URL}/obras?orderBy=likes&order=desc`);
  const obras = response.data;

  return obras.map((obra: { id: number; capa: string; titulo: string }) => ({
    id: obra.id,
    capa: obra.capa,
    titulo: obra.titulo,
  }));
};

export const getObrasRecentes = async () => {
  const response = await axios.get(`${API_URL}/obras`, {
    params: {
      orderBy: 'created_at', // substitua pelo campo correto que indica a data de criação
      order: 'desc'          // 'desc' para decrescente, 'asc' para crescente
    }
  });
  
  const obras = response.data;

  return obras.map((obra: { id: number, capa: string, titulo: string }) => ({
    id: obra.id,
    capa: obra.capa,
    titulo: obra.titulo
  }));
};

export const getObrasPorGenero = async (generoId: number) => {
  try {
      const response = await axios.get(`${API_URL}/obras`);
      const obras = response.data;

      // Filtrando as obras para incluir apenas as que contêm o gênero desejado
      return obras.filter((obra: { generos: { id: number }[] }) =>
          obra.generos.some((genero) => genero.id === generoId)
      );
  } catch (error) {
      console.error("Erro ao buscar obras:", error);
      throw error;
  }
};
"use client";
import { Menu } from "@/components/Menu";
import { useRouter } from "next/navigation";
import style from './style.module.css';
import { FaArrowLeft } from "react-icons/fa";
import Pesquisar from "@/components/Pesquisar";
import { ModalPerfil } from "@/components/ModalPerfil";
import { Cards } from "@/components/Cards";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";

interface TokenPayload {
  sub: number;
}

interface Obra {
  id: number;
  titulo: string;
  capa: string;
}

export default function Historico() {
  const [obras, setObras] = useState<Obra[]>([]); // Estado para obras
  const [loading, setLoading] = useState(true); // Estado para controle de loading
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const router = useRouter();

  const voltar = () => {
    router.back();
  };

  useEffect(() => {
    // Recupera o ID do usuário do token
    const cookies = parseCookies();
    const token = cookies["obra.token"];

    if (token) {
      try {
        const decodedToken: TokenPayload = jwtDecode<TokenPayload>(token);
        setUsuarioId(decodedToken.sub);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchHistorico = async () => {
      if (usuarioId) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/v1/historico/${usuarioId}?detalhado=true`
          );
          console.log("Resposta da API:", response.data);

          // Extrai as informações necessárias das obras no histórico
          const obrasDetalhadas: Obra[] = response.data.map((item: any) => ({
            id: item.obra.id,
            titulo: item.obra.titulo,
            capa: item.obra.capa,
          }));

          // Remove duplicatas pelo ID
          const obrasSemDuplicatas: Obra[] = Array.from(
            new Map(obrasDetalhadas.map((obra) => [obra.id, obra])).values()
          );

          setObras(obrasSemDuplicatas);
        } catch (error) {
          console.error("Erro ao buscar histórico:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHistorico();
  }, [usuarioId]);  

  return (
    <>
      <Menu />
      <Pesquisar />
      <ModalPerfil />
      <div className={style.container}>
        <div className={style.titulo}>
          <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
          <h1>Histórico</h1>
        </div>
        <br />
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <Cards data={obras} />
        )}
      </div>
    </>
  );
}

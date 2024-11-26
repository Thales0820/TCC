"use client";
import { Menu } from "@/components/Menu";
import style from "./style.module.css";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Pesquisar from "@/components/Pesquisar";
import { useEffect, useState } from "react";
import CardList from "@/components/CardList";
import { ModalPerfil } from "@/components/ModalPerfil";
import axios from "axios";
import { getObrasLista } from "../api/routes";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    sub: number;
}

export default function Atualizacoes() {
    const router = useRouter();
    const [obras, setObras] = useState([]); // Estado para obras e capítulos atualizacoes
    const [loading, setLoading] = useState(true); // Estado para controle de loading
    const [usuarioId, setUsuarioId] = useState<number | null>(null);

    const voltar = () => {
        router.back();
    };

    useEffect(() => {
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
        const fetchAtualizacao = async () => {
            try {
                const listaObras: { id: number; titulo: string; capa: string; leitura: string }[] =
                    await getObrasLista(Number(usuarioId));
                const listaObrasId = listaObras.map((obra) => obra.id);
        
                const response = await axios.get("http://127.0.0.1:8000/api/v1/capitulos");
                const capitulos = response.data;
        
                // Verifica se a resposta tem dados válidos
                if (!capitulos || !Array.isArray(capitulos)) {
                    throw new Error("Capítulos inválidos ou vazios.");
                }
        
                // Agrupa capítulos por obra e mantém apenas os 3 últimos
                const atualizacoes = capitulos.reduce((acc: any, capitulo: any) => {
                    const obraId = capitulo.obra_id;
        
                    // Ignora capítulos de obras que não estão na lista do usuário
                    if (!listaObrasId.includes(obraId)) {
                        return acc;
                    }
        
                    // Garante que a propriedade 'obra' existe
                    if (!capitulo.obra) {
                        console.warn(`Capítulo com ID ${capitulo.id} não possui informações da obra.`);
                        return acc;
                    }
        
                    if (!acc[obraId]) {
                        acc[obraId] = {
                            ...capitulo.obra,
                            capitulos: [],
                        };
                    }
        
                    acc[obraId].capitulos.push({
                        id: capitulo.id,
                        titulo: capitulo.titulo,
                        numero: capitulo.numero,
                    });
        
                    // Ordena capítulos por número e mantém apenas os 3 últimos
                    acc[obraId].capitulos = acc[obraId].capitulos
                        .sort((a: any, b: any) => b.numero - a.numero)
                        .slice(0, 3);
        
                    return acc;
                }, {});
        
                setObras(Object.values(atualizacoes)); // Converte objetos atualizacoes em array
            } catch (error) {
                console.error("Erro ao buscar capítulos:", error);
            } finally {
                setLoading(false); // Define loading como false após a chamada
            }
        };        
        if (usuarioId) {
            fetchAtualizacao(); // Chama a função fetchAtualizacao quando usuarioId está disponível
        }
    }, [usuarioId]); // O array vazio [] faz com que o efeito rode apenas na montagem do componente

    return (
        <>
            <Menu />
            <Pesquisar />
            <ModalPerfil />
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Atualizações</h1>
                </div>
                <br />
                {loading ? (
                    <p>Carregando...</p> // Mensagem de loading enquanto os dados estão sendo buscados
                ) : (
                    <CardList data={obras} /> // Passando os dados atualizacoes para o CardList
                )}
            </div>
        </>
    );
}

"use client";
import { Menu } from "@/components/Menu";
import style from "./style.module.css";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Pesquisar from "@/components/Pesquisar";
import { useEffect, useState } from "react";
import CardList from "@/components/CardList";
import { ModalPerfil } from "@/components/ModalPerfil";

export default function Atualizacoes() {
    const router = useRouter();
    const [obrasAgrupadas, setObrasAgrupadas] = useState([]); // Estado para obras e capítulos agrupados
    const [loading, setLoading] = useState(true); // Estado para controle de loading

    const voltar = () => {
        router.back();
    };

    useEffect(() => {
        const fetchCapitulos = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/v1/capitulos"); // Ajuste a URL conforme necessário
                if (!response.ok) {
                    throw new Error("Erro ao buscar capítulos");
                }
                const data = await response.json();

                // Agrupando capítulos por obra
                const agrupados = data.reduce((acc: any, capitulo: any) => {
                    const obraId = capitulo.obra_id;
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
                        data_publicacao: capitulo.data_publicacao,
                    });
                    return acc;
                }, {});

                setObrasAgrupadas(Object.values(agrupados)); // Converte objetos agrupados em array
            } catch (error) {
                console.error("Erro:", error);
            } finally {
                setLoading(false); // Define loading como false após a chamada
            }
        };

        fetchCapitulos(); // Chama a função fetchCapitulos
    }, []); // O array vazio [] faz com que o efeito rode apenas na montagem do componente

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
                    <CardList data={obrasAgrupadas} /> // Passando os dados agrupados para o CardList
                )}
            </div>
        </>
    );
}

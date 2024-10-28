"use client";
import { Menu } from "@/components/Menu";
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Pesquisar from "@/components/Pesquisar";
import { ModalPerfil } from "@/components/ModalPerfil";
import { useEffect, useState } from "react";
import CardList from "@/components/CardList";

export default function Atualizacoes() {
    const router = useRouter();
    const [obras, setObras] = useState([]); // Estado para armazenar as obras
    const [loading, setLoading] = useState(true); // Estado para controle de loading

    const voltar = () => {
        router.back();
    };

    useEffect(() => {
        const fetchObras = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/obraslancadas'); // Ajuste a URL conforme necessário
                if (!response.ok) {
                    throw new Error('Erro ao buscar obras'); // Trate o erro aqui se necessário
                }
                const obrasData = await response.json();
                setObras(obrasData); // Atualiza o estado com as obras retornadas
            } catch (error) {
                console.error('Erro:', error);
            } finally {
                setLoading(false); // Define loading como false após a chamada
            }
        };

        fetchObras(); // Chama a função fetchObras
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
                    <CardList data={obras}/>
                )}
            </div>
        </>
    );
}

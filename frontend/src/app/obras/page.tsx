"use client" 
import { Menu } from "@/components/Menu";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import style from './style.module.css';
import { useState, useEffect } from "react";
import { Cards } from "@/components/Cards";
import Pesquisar from "@/components/Pesquisar";
import { ModalPerfil } from "@/components/ModalPerfil";
import { getObras } from "../api/routes";

interface Obra {
    id: number;
    image: string;
    titulo: string;
}

export default function Obras() {
    const [obras, setObras] = useState<Obra[]>([]);
    const [letraSelecionada, setLetraSelecionada] = useState('');
    const [obrasFiltradas, setObrasFiltradas] = useState<Obra[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Função para buscar os dados da API
        const fetchObras = async () => {
            try {
                const obrasOrdenadas = await getObras();
                obrasOrdenadas.sort((a: Obra, b: Obra) => a.titulo.localeCompare(b.titulo));
                setObras(obrasOrdenadas);
                setObrasFiltradas(obrasOrdenadas); // Exibe todas as obras inicialmente
            } catch (error) {
                console.error("Erro ao buscar obras:", error);
            }
        };
        fetchObras();
    }, []);

    const letras = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const handleLetraClick = (letra: string) => {
        if (letra === letraSelecionada) {
            // Se a letra clicada já estiver selecionada, desmarcar a seleção
            setLetraSelecionada("");
            setObrasFiltradas(obras); // Exibe todas as obras novamente
        } else {
            setLetraSelecionada(letra);
            // Filtra as obras com base na letra selecionada
            if (letra === "#") {
                setObrasFiltradas(obras.filter(obra => !/^[A-Za-z]/.test(obra.titulo)));
            } else {
                setObrasFiltradas(obras.filter(obra => obra.titulo.startsWith(letra)));
            }
        }
    };

    const voltar = () => {  
        router.back();
    }

    return(
        <>
            <Menu />
            <Pesquisar />
            <ModalPerfil />
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Todos os Quadrinhos</h1>
                </div>
                <br />
                <div className={style.listaContainer}>
                    <div className={style.lista}>
                        {letras.map((letra, index) => (
                            <div key={index} onClick={() => handleLetraClick(letra)}
                            className={letra === letraSelecionada ? style.letraSelecionada : style.letra}>
                                <p>{letra}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <Cards data={obrasFiltradas} />
            </div>
        </>
    );
}

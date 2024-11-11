"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import style from './style.module.css';
import { FaArrowLeft } from 'react-icons/fa';

interface Obra {
    id: number;
    titulo: string;
    capa: string;
    sinopse: string;
    autor_id: number;
    likes: number;
    data_publicacao: string;
    data_encerramento: string | null;
    tipo_id: number;
    estado_id: number;
}

interface Capitulo {
    id: number;
    titulo: string;
    numero: string;
    data_publicacao: string;
    obra_id: number;
    obra: Obra;
}

export default function CapituloPage() {
    const router = useRouter();
    const { id } = useParams(); // Captura o ID do capítulo a partir da URL

    const [capitulo, setCapitulo] = useState<Capitulo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Estado para capturar erros

    useEffect(() => {
        if (typeof id === 'string') {
            fetchCapitulo(id);
        }
    }, [id]);

    const fetchCapitulo = async (capituloId: string) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/capitulos/${capituloId}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Verifica se a resposta da API está correta e se possui dados válidos
            if (response.status === 200 && response.data) {
                setCapitulo(response.data);
            } else {
                throw new Error('A resposta da API não é válida.');
            }
        } catch (error) {
            console.error('Erro ao carregar capítulo:', error);
            setError('Erro ao carregar capítulo. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!capitulo) {
        return <div>Capítulo não encontrado.</div>;
    }

    // Verifica se a URL da capa é válida e constrói a URL completa
    const capaUrl = capitulo.obra.capa ? `http://127.0.0.1:8000/${capitulo.obra.capa}` : '';

    return (
        <div className={style.container}>
            <div className={style.header}>
                <FaArrowLeft onClick={() => router.back()} className={style.icon} title="Voltar" />
                <h1>{capitulo.titulo}</h1>
            </div>

            <div className={style.capituloDetails}>
                <h2>Capítulo {capitulo.numero}</h2>
                <p>Data de Publicação: {capitulo.data_publicacao}</p>

                <h3>Obra: {capitulo.obra.titulo}</h3>
                {capaUrl ? (
                    <img
                        src={capaUrl}
                        alt="Capa da Obra"
                        className={style.coverImage}
                    />
                ) : (
                    <p>Imagem da capa não disponível.</p>
                )}
                <p>{capitulo.obra.sinopse}</p>
            </div>
        </div>
    );
}

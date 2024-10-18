"use client";

import { useState, useEffect } from "react";
import axios from 'axios';
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { ModalGenero } from "@/components/ModalGenero";

// Definindo os tipos de dados para autores, tipos e estados
interface Autor {
    id: string;
    nome: string;
}

interface Tipo {
    id: string;
    nome: string;
}

interface Estado {
    id: string;
    nome: string;
}

interface Genero {
    id: string;
    nome: string;
}

export default function CriarObra() {
    const [titulo, setTitulo] = useState('');
    const [capa, setCapa] = useState<File | null>(null);
    const [sinopse, setSinopse] = useState('');
    const [dataPublicacao, setDataPublicacao] = useState(new Date().toISOString().substring(0, 10));
    const [autorId, setAutorId] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [estadoId, setEstadoId] = useState('');
    const [generoSelecionados, setGeneroSelecionados] = useState<Genero[]>([]); // Mudança aqui
    const [autores, setAutores] = useState<Autor[]>([]);
    const [tipos, setTipos] = useState<Tipo[]>([]);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [generos, setGeneros] = useState<Genero[]>([]); // Adicionando estado para gêneros
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    const voltar = () => {
        router.back();
    };

    const handleCapaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCapa(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const formData = new FormData();
        formData.append('titulo', titulo);
        if (capa) {
            formData.append('capa', capa);
        }
        formData.append('sinopse', sinopse);
        formData.append('data_publicacao', dataPublicacao);
        formData.append('autor_id', autorId);
        formData.append('tipo_id', tipoId);
        formData.append('estado_id', estadoId);

        generoSelecionados.forEach((genero) => {
            formData.append('generos[]', genero.id); // Corrigindo para enviar ID do gênero
        });

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/obras', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Obra criada com sucesso:', response.data);
            setTitulo('');
            setCapa(null);
            setSinopse('');
            setDataPublicacao(new Date().toISOString().substring(0, 10));
            setAutorId('');
            setTipoId('');
            setEstadoId('');
            setGeneroSelecionados([]); // Limpar gêneros selecionados
            (e.target as HTMLFormElement).reset();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                setError('Erro ao criar obra: ' + (error.response.data.message || error.message));
            } else {
                setError('Erro inesperado: ' + (error as Error).message);
            }
            console.error('Erro ao criar obra:', error);
        }
    };

    const fetchOptions = async () => {
        try {
            const [autoresRes, tiposRes, estadosRes, generosRes] = await Promise.all([ // Adicionando a chamada para gêneros
                axios.get('http://127.0.0.1:8000/api/v1/usuarios'),
                axios.get('http://127.0.0.1:8000/api/v1/tipos'),
                axios.get('http://127.0.0.1:8000/api/v1/estados'),
                axios.get('http://127.0.0.1:8000/api/v1/generos'), // Nova chamada para buscar gêneros
            ]);

            setAutores(autoresRes.data);
            setTipos(tiposRes.data);
            setEstados(estadosRes.data);
            setGeneros(generosRes.data); // Armazenando a lista de gêneros
        } catch (error) {
            console.error('Erro ao buscar opções:', error);
            setError('Erro ao buscar opções');
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    return (
        <>
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Criando Obra</h1>
                </div>
                <br />
                {error &&
                    <div role="alert" className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current"
                            fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                }
                <br />
                <form onSubmit={handleSubmit} className={style.form}>
                    <div className={style.formGroup}>
                        <label>Título:</label>
                        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                    </div>
                    <div className={style.formGroup}>
                        <label>Capa:</label>
                        <input type="file" onChange={handleCapaChange} />
                    </div>
                    <div className={style.formGroup}>
                        <label>Sinopse:</label>
                        <textarea value={sinopse} onChange={(e) => setSinopse(e.target.value)} required />
                    </div>
                    <div className={style.formGroup}>
                        <label>Data de Publicação:</label>
                        <input type="date" value={dataPublicacao} onChange={(e) => setDataPublicacao(e.target.value)} />
                    </div>
                    <div className={style.formGroup}>
                        <label>Autor:</label>
                        <select value={autorId} onChange={(e) => setAutorId(e.target.value)} required>
                            <option value="">Selecione um autor</option>
                            {autores.map((autor) => (
                                <option key={autor.id} value={autor.id}>{autor.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className={style.formGroup}>
                        <label>Tipo:</label>
                        <select value={tipoId} onChange={(e) => setTipoId(e.target.value)} required>
                            <option value="">Selecione um tipo</option>
                            {tipos.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className={style.formGroup}>
                        <label>Estado:</label>
                        <select value={estadoId} onChange={(e) => setEstadoId(e.target.value)} required>
                            <option value="">Selecione um estado</option>
                            {estados.map((estado) => (
                                <option key={estado.id} value={estado.id}>{estado.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className={`${style.formGroup} ${style.generosContainer}`}>
                        <label>Gêneros:</label>
                        <button
                            type="button"
                            className={style.generosButton}
                            onClick={() => setModalOpen(true)}
                        >
                            Selecionar Gêneros
                        </button>
                    </div>

                    <button type="submit" className={style.submitButton}>Criar Obra</button>
                </form>
                <ModalGenero
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    selecionaGenero={generoSelecionados.map(g => g.id)}
                    onSelectGenre={(selected) => {
                        const selecionados = generos.filter(g => selected.includes(g.id));
                        setGeneroSelecionados(selecionados);
                    }}
                    generos={generos} // Assegure-se de que esta linha está presente
                />


            </div>
        </>
    );
}

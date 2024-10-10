"use client";
import { useState, useEffect } from "react";
import axios from 'axios';
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
    
export default function CriarObra() {
    const [titulo, setTitulo] = useState('');
    const [capa, setCapa] = useState<File | null>(null);
    const [sinopse, setSinopse] = useState('');
    const [dataPublicacao, setDataPublicacao] = useState('');
    const [dataEncerramento, setDataEncerramento] = useState('');
    const [autorId, setAutorId] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [estadoId, setEstadoId] = useState('');
    const [autores, setAutores] = useState([]); // Lista de autores
    const [tipos, setTipos] = useState([]); // Lista de tipos
    const [estados, setEstados] = useState([]); // Lista de estados
    const [error, setError] = useState('');
    const router = useRouter();

    const voltar = () => {
        router.back();
    }
    const handleCapaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCapa(e.target.files[0]);
        }
    }

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
        formData.append('data_encerramento', dataEncerramento);
        formData.append('autor_id', autorId);
        formData.append('tipo_id', tipoId);
        formData.append('estado_id', estadoId);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/obras', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Obra criada com sucesso:', response.data);
            // Reset form fields
            setTitulo('');
            setCapa(null);
            setSinopse('');
            setDataPublicacao('');
            setDataEncerramento('');
            setAutorId('');
            setTipoId('');
            setEstadoId('');

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

    // Função para buscar autores, tipos e estados
    const fetchOptions = async () => {
        try {
            const [autoresRes, tiposRes, estadosRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/v1/usuarios'), // Endpoint para buscar autores
                axios.get('http://127.0.0.1:8000/api/v1/tipos'),   // Endpoint para buscar tipos
                axios.get('http://127.0.0.1:8000/api/v1/estados')  // Endpoint para buscar estados
            ]);

            setAutores(autoresRes.data);
            setTipos(tiposRes.data);
            setEstados(estadosRes.data);
        } catch (error) {
            console.error('Erro ao buscar opções:', error);
            setError('Erro ao buscar opções');
        }
    };

    // Carregar opções ao montar o componente
    useEffect(() => {
        fetchOptions();
    }, []);
    return(
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
                    <div className={style.formRow}>
                        <div className={style.formGroup}>
                            <label htmlFor="titulo">Título:</label>
                            <input
                                placeholder="Digite o Nome da Obra"
                                type="text"
                                id="titulo"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="capa">Capa:</label>
                            <div className={style.inputContainer}>
                                <input
                                    type="file"
                                    id="capa"
                                    accept="image/*"
                                    onChange={handleCapaChange}
                                    required
                                    className={style.fileInputStyled}
                                />
                                <div className={style.verticalBar}></div>
                            </div>
                        </div>
                    </div>
                    <div className={style.formRow}>
                        <div className={style.formGroup}>
                            <label htmlFor="dataPublicacao">Data de Publicação:</label>
                            <input
                                type="date"
                                id="dataPublicacao"
                                value={dataPublicacao}
                                onChange={(e) => setDataPublicacao(e.target.value)}
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="dataEncerramento">Data de Encerramento:</label>
                            <input
                                type="date"
                                id="dataEncerramento"
                                value={dataEncerramento}
                                onChange={(e) => setDataEncerramento(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={style.formRow}>
                        <div className={style.formGroup}>
                            <label htmlFor="autorId">Autor:</label>
                            <select
                                id="autorId"
                                value={autorId}
                                onChange={(e) => setAutorId(e.target.value)}
                                required
                            >
                                <option value="">Selecione o autor</option>
                                {autores.map((autor: any) => (
                                    <option key={autor.id} value={autor.id}>{autor.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="tipoId">Tipo:</label>
                            <select
                                id="tipoId"
                                value={tipoId}
                                onChange={(e) => setTipoId(e.target.value)}
                                required
                            >
                                <option value="">Selecione o tipo</option>
                                {tipos.map((tipo: any) => (
                                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="estadoId">Estado:</label>
                            <select
                                id="estadoId"
                                value={estadoId}
                                onChange={(e) => setEstadoId(e.target.value)}
                                required
                            >
                                <option value="">Selecione o estado</option>
                                {estados.map((estado: any) => (
                                    <option key={estado.id} value={estado.id}>{estado.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="sinopse">Sinopse:</label>
                        <textarea
                            id="sinopse"
                            placeholder="Digite a sinopse da história"
                            value={sinopse}
                            onChange={(e) => setSinopse(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={style.submitButton}>Criar Obra</button>
                </form>
            </div>
        </>
    )
}
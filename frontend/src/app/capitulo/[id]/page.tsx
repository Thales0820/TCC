"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import style from './style.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { BsFullscreen } from 'react-icons/bs';
import { getCapitulosPorObra } from '@/app/api/routes';

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

interface Pagina {
    id: number;
    capitulo_id: number;
    numero: string;
    imagem: string;
}

export default function CapituloPage() {
    const router = useRouter();
    const { id } = useParams();

    const [capitulo, setCapitulo] = useState<Capitulo | null>(null);
    const [capitulos, setCapitulos] = useState<Array<{ id: number; numero: number; }>>([]);
    const [paginas, setPaginas] = useState<Pagina[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof id === 'string') {
            fetchCapitulo(id);
            fetchPaginas(id);
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') {
                handleNextPage();
            } else if (event.key === 'ArrowLeft') {
                handlePreviousPage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [id, currentPage, paginas.length]);

    useEffect(() => {
        if (capitulo?.obra_id) {
            fetchCapitulos(capitulo.obra_id);
        }
    }, [capitulo]);

    const fetchCapitulos = async (obraId: number) => {
        try {
            const capitulosData = await getCapitulosPorObra(obraId);
            if (capitulosData) {
                setCapitulos(capitulosData.map((cap: { id: number; numero: number; }) => ({
                    id: cap.id,
                    numero: cap.numero,
                })));
            }
        } catch (error) {
            console.error('Erro ao carregar capítulos:', error);
        }
    };

    const fetchCapitulo = async (capituloId: string) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/capitulos/${capituloId}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200 && response.data) {
                setCapitulo(response.data);
            } else {
                throw new Error('Capítulo não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao carregar capítulo:', error);
            setError('Erro ao carregar capítulo. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPaginas = async (capituloId: string) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/paginas`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200 && response.data) {
                const paginasFiltradas = response.data.filter((pagina: Pagina) => pagina.capitulo_id === parseInt(capituloId));
                
                // Pré-carrega as imagens
                paginasFiltradas.forEach((pagina: Pagina) => {
                    const img = new Image();
                    img.src = `http://127.0.0.1:8000/${pagina.imagem}`;
                });

                setPaginas(paginasFiltradas);
            } else {
                throw new Error('Páginas não encontradas para este capítulo.');
            }
        } catch (error) {
            console.error('Erro ao carregar páginas:', error);
            setError('Erro ao carregar páginas. Tente novamente mais tarde.');
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Erro ao tentar entrar em tela cheia: ${err.message}`);
            });
        } else {
            document.exitFullscreen().catch((err) => {
                console.error(`Erro ao tentar sair do modo tela cheia: ${err.message}`);
            });
        }
    };

    const handleNextPage = () => {
        if (currentPage < paginas.length - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPage = parseInt(event.target.value);
        if (!isNaN(selectedPage)) {
            setCurrentPage(selectedPage);
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;
    if (!capitulo || paginas.length === 0) return <div>Capítulo não encontrado ou não contém páginas.</div>;

    return (
        <div className={style.readerContainer}>
            <div className={style.header}>
                <div className={style.informacoes}>
                    <h3>{capitulo.titulo}</h3>
                    <Link href={`/obra/${capitulo.obra_id}`} legacyBehavior>
                        <a>{capitulo.obra.titulo}</a>
                    </Link>
                </div>
                <select className={style.select} onChange={(event) => {
                    const selectedCapituloId = event.target.value;
                    if (selectedCapituloId) {
                        router.push(`/capitulo/${selectedCapituloId}`);
                    }
                }}>
                    <option disabled selected>Capítulo {capitulo.numero}</option>
                    {capitulos.map((cap) => (
                        <option key={cap.id} value={cap.id}>
                            Capítulo {cap.numero}
                        </option>
                    ))}
                </select>
                <select className={style.select} value={currentPage} onChange={handlePageChange}>
                    {paginas.map((_, index) => (
                        <option key={index} value={index}>Página {index + 1} / {paginas.length}</option>
                    ))}
                </select>
            </div>
            <div className={style.pageContainer}>
                <FaChevronLeft size={50} onClick={handlePreviousPage} title="Página anterior"
                    className={`${style.navigationButton} ${style.left} ${currentPage === 0 ? style.disabled : ''}`}/>
                <img
                    src={`http://127.0.0.1:8000/${paginas[currentPage].imagem}`}
                    alt={`Página ${currentPage + 1}`}
                    className={style.mangaPage}/>
                <FaChevronRight size={50} onClick={handleNextPage} title="Próxima página"
                    className={`${style.navigationButton} ${style.right} ${currentPage === paginas.length - 1 ? style.disabled : ''}`}/>
                <BsFullscreen size={40} className={style.telaFull} title="Abir Tela Cheia" 
                    onClick={toggleFullscreen}/>
            </div>
            <br />
        </div>
    );
}
"use client";
import { Menu } from '@/components/Menu';
import style from './style.module.css';
import Pesquisar from '@/components/Pesquisar';
import { ModalPerfil } from '@/components/ModalPerfil';
import { BiArrowFromBottom, BiArrowToBottom, BiSolidLike } from 'react-icons/bi';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import Comentarios from '@/components/Comentarios';
import { BsFillChatLeftTextFill } from 'react-icons/bs';
import { getLista, getObraDetails } from '../../api/routes';
import { useRouter } from 'next/navigation';
import { PiBookOpenTextBold } from 'react-icons/pi';
import { parseCookies } from 'nookies';
import {jwtDecode} from 'jwt-decode';
import Link from 'next/link';
import { ModalLeitura } from '@/components/ModalLeitura';

interface TokenPayload {
    sub: string;
}

interface ObraInfo {
    id: number;
    titulo: string;
    sinopse: string;
    capa: string;
    autor: string;
    autor_id: string;
    dataPublicacao: string;
    tipo: string;
    estado: string;
    generos: string[];
    likes: number;
    capitulos: {
        numero: number;
        titulo: string;
        visualizado: boolean;
    }[];
}

function getUserId(): string | null {
    const cookies = parseCookies();
    const token = cookies['obra.token'];
  
    if (token) {
        try {
            const decodedToken = jwtDecode<TokenPayload>(token);
            return decodedToken.sub;
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
            return null;
        }
    }
    return null;
}

export default function Obra({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [like, setLike] = useState(false);
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [obra, setObra] = useState<ObraInfo | null>(null);
    const [leitura, setLeitura] = useState<string | null>(null);
    const userId = getUserId();

    useEffect(() => {
        if (!userId) {
            router.push('/login');
            return;
        }

        const fetchObra = async () => {
            const response = await getObraDetails(parseInt(params.id));
            console.log("Dados da Obra:", response);
            setObra(response);
        };

        const fetchLeitura = async () => {
            if (userId) {
                const leitura = await getLista(parseInt(userId), parseInt(params.id));
                console.log("Leitura obtida:", leitura); // Console para verificar a resposta
                setLeitura(leitura);
            }
        };

        fetchObra();
        fetchLeitura();
    }, [params.id, router, userId]);

    const handleAddChapter = () => {
        if (obra) {
            // Redireciona para a página de adicionar capítulo passando o ID da obra na URL
            router.push(`/adiciona-capitulo/${obra.id}`);
        }
    };
    

    const toggleOrdem = () => {
        if (obra) {
            const novaOrdem = [...obra.capitulos].sort((a, b) =>
                ordemCrescente ? a.numero - b.numero : b.numero - a.numero
            );
            setObra({ ...obra, capitulos: novaOrdem });
            setOrdemCrescente(!ordemCrescente);
        }
    };

    const handleOpenModal = () => { setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); };

    const toggleVisualizacao = (numero: number) => {
        if (obra) {
            const capitulosAtualizados = obra.capitulos.map((capitulo) =>
                capitulo.numero === numero ? { ...capitulo, visualizado: !capitulo.visualizado } : capitulo
            );
            setObra({ ...obra, capitulos: capitulosAtualizados });
        }
    };

    const formatarData = (data: string) => {
        const date = new Date(data);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = String(date.getFullYear());

        return `${dia}/${mes}/${ano}`;
    };

    const toggleLike = () => {
        if (obra) {
            setLike(!like);
            const novoLike = like ? obra.likes - 1 : obra.likes + 1;
            setObra({ ...obra, likes: novoLike });
        }
    };

    const toggleComentarios = () => {
        setMostrarComentarios(!mostrarComentarios);
    };

    return (
        <>
            <Menu />
            <Pesquisar />
            <ModalPerfil />
            <div className={style.containerObra}>
                <div className={style.detalhe}>
                    <div className={style.capa}>
                        <img src={obra?.capa} alt={`Capa de ${obra?.titulo}`} />
                    </div>
                    <div className={style.informacoes}>
                        <h1 className={style.titulo}>{obra?.titulo}</h1>
                        <div className={style.generos}>
                            {obra?.generos.map((genero, index) => (
                                <div key={index}><p>{genero}</p></div>
                            ))}
                        </div>
                        <p>{obra?.sinopse}</p>
                        <div className={style.especificacao}>
                            <p>{obra?.autor}</p>
                            <p>{obra?.tipo}</p>
                            <p>{obra?.estado}</p>
                            <p>{obra ? formatarData(obra.dataPublicacao) : 'Data não disponível'}</p>
                        </div>
                    </div>
                </div>
                <div className={style.acoes}>
                    <div className={style.funcoes}>
                        {obra && String(obra.autor_id) === String(userId) ? (
                            <button onClick={handleAddChapter}><FaPlus size={25} /> Adicionar Cap.</button>
                        ) : leitura ? (
                            <button><FaRegEdit size={25} /> {leitura}</button>
                        ) : (
                            <button onClick={handleOpenModal}><FaPlus size={25} /> Adicionar</button>
                        )}
                        <div className={style.icones}>
                            <div onClick={toggleLike}>
                                <BiSolidLike size={45} className={like ? style.like : style.curtir} />
                                {obra && obra.likes > 0 && (
                                    <span className={like ? style.curtido : style.likesCount}>{obra.likes}</span>
                                )}
                            </div>
                            {mostrarComentarios ? (
                                <PiBookOpenTextBold size={45} onClick={toggleComentarios} className={style.aberto} />
                            ) : (
                                <BsFillChatLeftTextFill size={45} onClick={toggleComentarios} className={style.aberto} />
                            )}
                        </div>
                    </div>
                    {mostrarComentarios ? (
                        <Comentarios />
                    ) : (
                        <div className={style.capitulosContainer}>
                            <div className={style.topoCapitulos}>
                                <h1>Capítulos: </h1>
                                <div className={style.mudarOrdem}>
                                    <BiArrowToBottom size={45} className={ordemCrescente ? style.selecionado : ''} onClick={toggleOrdem} />
                                    <BiArrowFromBottom size={45} className={!ordemCrescente ? style.selecionado : ''} onClick={toggleOrdem} />
                                </div>
                            </div>
                            <div className={style.capitulos}>
                                {obra?.capitulos.map(cap => (
                                    <div className={style.capitulo} key={cap.numero}>
                                        {cap.visualizado ? (
                                            <IoEyeOff size={25} onClick={() => toggleVisualizacao(cap.numero)} />
                                        ) : (
                                            <IoEye size={25} onClick={() => toggleVisualizacao(cap.numero)} />
                                        )}
                                        <span className={style.numero}>Cap. {cap.numero}</span>
                                        <span className={style.tituloCap}>{cap.titulo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ModalLeitura 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            obraId={parseInt(params.id)}
            usuarioId={userId ? parseInt(userId) : null}
            />
        </>
    );
}

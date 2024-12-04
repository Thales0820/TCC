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
import { getCapitulosPorObra, getLista, getObraDetails } from '../../api/routes';
import { useRouter } from 'next/navigation';
import { PiBookOpenTextBold } from 'react-icons/pi';
import { parseCookies } from 'nookies';
import { jwtDecode } from 'jwt-decode';
import { ModalLeitura } from '@/components/ModalLeitura';
import Link from 'next/link';
import axios from 'axios';

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
    const [capitulos, setCapitulos] = useState<{ id: number; numero: number; titulo: string; obra_id: number}[]>([]);
    const [visualizados, setVisualizados] = useState<number[]>([]);
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [like, setLike] = useState(false);
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [obra, setObra] = useState<ObraInfo | null>(null);
    const [leitura, setLeitura] = useState<{ listaId: number; leituraId: number; tipo: string } | null>(null);
    const userId = getUserId();

    useEffect(() => {
        if (!userId) {
            router.push('/login');
            return;
        }

        const fetchObra = async () => {
            const response = await getObraDetails(parseInt(params.id));
            setObra(response);
        };

        const fetchCapitulos = async () => {
            const capitulosData = await getCapitulosPorObra(parseInt(params.id));
            if (capitulosData) {
                setCapitulos(capitulosData.map((cap: { id: number; numero: number; titulo: string; }) => ({
                    id: cap.id, // Adicionando id explicitamente
                    numero: cap.numero,
                    titulo: cap.titulo,
                })));
            }
        };


        const fetchLeitura = async () => {
            if (userId) {
                const lista = await getLista(parseInt(userId), parseInt(params.id));
                //console.log("Leitura obtida:", lista); // Console para verificar a resposta
                setLeitura(lista);
            }
        };

        const fetchLikeStatus = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/obras/${params.id}/like-status`, {
                    params: { userId },
                });

                if (response.data?.liked) {
                    setLike(true);
                }
            } catch (error) {
                console.error("Erro ao buscar status de like:", error);
            }
        };

        const carregarHistorico = async () => {
            try {
                const usuarioId = userId; // Substitua pelo ID do usuário autenticado
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/historico/${usuarioId}`);
                console.log(response.data)
                setVisualizados(response.data); // Recebe apenas os IDs dos capítulos visualizados
            } catch (error) {
                console.error('Erro ao carregar o histórico:', error);
            }
        };

        carregarHistorico();
        fetchLikeStatus();
        fetchObra();
        fetchCapitulos();
        fetchLeitura();
    }, [params.id, router, userId]);

    const handleAddChapter = () => {
        if (obra) {
            // Redireciona para a página de adicionar capítulo passando o ID da obra na URL
            router.push(`/adiciona-capitulo/${obra.id}`);
        }
    };

    const toggleOrdem = () => {
        const novaOrdem = [...capitulos].sort((a, b) =>
            ordemCrescente ? a.numero - b.numero : b.numero - a.numero
        );
        setCapitulos(novaOrdem);
        setOrdemCrescente(!ordemCrescente);
    };

    const toggleVisualizacao = async (numero: number, capituloId: number, obraId: number) => {
        if (visualizados.includes(capituloId)) {
            // Remover do histórico
            try {
                const usuarioId = userId; // Substitua pelo ID do usuário autenticado
                await axios.delete(`http://127.0.0.1:8000/api/v1/historico/${usuarioId}/${capituloId}`);
                setVisualizados((prev) => prev.filter((id) => id !== capituloId));
            } catch (error) {
                console.error('Erro ao remover do histórico:', error);
            }
        } else {
            // Adicionar ao histórico
            try {
                const usuarioId = userId; // Substitua pelo ID do usuário autenticado
                await axios.post('http://127.0.0.1:8000/api/v1/historico', {
                    usuario_id: usuarioId,
                    obra_id: params.id,
                    capitulo_id: capituloId,
                });
                setVisualizados((prev) => [...prev, capituloId]);
            } catch (error) {
                console.error('Erro ao adicionar ao histórico:', error);
            }
        }
    };


    const handleOpenModal = () => { setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); };

    const formatarData = (data: string) => {
        const date = new Date(data);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = String(date.getFullYear());

        return `${dia}/${mes}/${ano}`;
    };

    const handleLikeToggle = async () => {
        if (!obra) return;

        // Atualiza visualmente
        setLike(!like);
        const novoLike = like ? obra.likes - 1 : obra.likes + 1;
        setObra({ ...obra, likes: novoLike });

        try {
            // Chamada à API
            const response = await axios.post(`http://127.0.0.1:8000/api/v1/obras/${obra.id}/like`, {
                usuario_id: parseInt(userId ?? '0'), // Passe o ID do usuário logado, se necessário
            });

            // Atualiza com os dados retornados pelo servidor
            if (response.data) {
                setObra({ ...obra, likes: response.data.likesCount });
                setLike(response.data.status === "liked");
            }
        } catch (error) {
            console.error("Erro ao atualizar like:", error);

            // Reverte a mudança visual em caso de erro
            setLike(!like);
            setObra({ ...obra, likes: like ? obra.likes + 1 : obra.likes - 1 });
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
                            <p>{obra?.autor ?? "Autor Desconhecido"}</p>
                            <p>{obra?.tipo}</p>
                            <p>{obra?.estado}</p>
                            <p>{obra ? formatarData(obra.dataPublicacao) : ''}</p>
                        </div>
                    </div>
                </div>
                <div className={style.acoes}>
                    <div className={style.funcoes}>
                        {obra && String(obra.autor_id) === String(userId) ? (
                            <button onClick={handleAddChapter}><FaPlus /> Adicionar Cap.</button>
                        ) : leitura ? (
                            <button onClick={handleOpenModal}>{leitura.tipo}</button>
                        ) : (
                            <button onClick={handleOpenModal}><FaPlus /> Adicionar</button>
                        )}
                        <div className={style.icones}>
                            {obra && String(obra.autor_id) === String(userId) && (

                                <Link href={`/editar-obra/${obra.id}`} legacyBehavior>
                                    <FaRegEdit className={style.icone} size={45} title='Editar Obra' />
                                </Link>
                            )}
                            <div onClick={handleLikeToggle}>
                                <BiSolidLike size={45} className={like ? style.like : style.curtir} />
                                {obra && obra.likes > 0 && (
                                    <span className={like ? style.curtido : style.likesCount}>{obra.likes}</span>
                                )}
                            </div>
                            {mostrarComentarios ? (
                                <PiBookOpenTextBold onClick={toggleComentarios} className={style.aberto} />
                            ) : (
                                <BsFillChatLeftTextFill onClick={toggleComentarios} className={style.aberto} />
                            )}
                        </div>
                    </div>
                    {mostrarComentarios ? (
                        <Comentarios obraId={parseInt(params.id)} userId={userId ? parseInt(userId) : null} />
                    ) : (
                        <div className={style.capitulosContainer}>
                            <div className={style.topoCapitulos}>
                                <h1>Capítulos: </h1>
                                <div className={style.mudarOrdem}>
                                    <BiArrowToBottom className={ordemCrescente ? style.selecionado : ''} onClick={toggleOrdem} />
                                    <BiArrowFromBottom className={!ordemCrescente ? style.selecionado : ''} onClick={toggleOrdem} />
                                </div>
                            </div>
                            <div className={style.capitulos}>
                                {capitulos.map((cap) => (
                                    <div className={style.capitulo} key={cap.numero}>
                                        {visualizados.includes(cap.id) ? (
                                            <IoEyeOff
                                                size={25}
                                                onClick={() => toggleVisualizacao(cap.numero, cap.id, cap.obra_id)}
                                            />
                                        ) : (
                                            <IoEye
                                                size={25}
                                                onClick={() => toggleVisualizacao(cap.numero, cap.id, cap.obra_id)}
                                            />
                                        )}
                                        <Link href={`/capitulo/${cap.id}`} legacyBehavior>
                                            <span className={style.numero} title={`Ler o Capítulo ${cap.numero}`}
                                                onClick={async () => {
                                                    try {
                                                        const usuarioId = userId;
                                                        await axios.post('http://127.0.0.1:8000/api/v1/historico', {
                                                            usuario_id: usuarioId,
                                                            obra_id: params.id,
                                                            capitulo_id: cap.id,
                                                        });
                                                        setVisualizados((prev) => [...prev, cap.id]);
                                                    } catch (error) {
                                                        console.error('Erro ao adicionar ao histórico ao acessar o capítulo:', error);
                                                    }
                                                }}
                                            >  Cap. {cap.numero}
                                            </span>
                                        </Link>
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
                listaId={leitura?.listaId}
                leituraAtual={leitura?.leituraId}
            />
            <br />
        </>
    );
}
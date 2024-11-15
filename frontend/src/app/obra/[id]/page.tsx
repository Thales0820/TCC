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
import {jwtDecode} from 'jwt-decode';
import { ModalLeitura } from '@/components/ModalLeitura';
import Link from 'next/link';

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
    const [capitulos, setCapitulos] = useState<{ id: number; numero: number; titulo: string; visualizado: boolean }[]>([]);
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
                    visualizado: false // Defina o valor inicial conforme necessário
                })));
            }
        };
        

        const fetchLeitura = async () => {
            if (userId) {
                const lista = await getLista(parseInt(userId), parseInt(params.id));
                console.log("Leitura obtida:", lista); // Console para verificar a resposta
                setLeitura(lista);
            }
        };

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
    
    const toggleVisualizacao = (numero: number) => {
        const capitulosAtualizados = capitulos.map((capitulo) =>
            capitulo.numero === numero ? { ...capitulo, visualizado: !capitulo.visualizado } : capitulo
        );
        setCapitulos(capitulosAtualizados);
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

    return(
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
                            <p>{obra ? formatarData(obra.dataPublicacao) : ''}</p>
                        </div>
                    </div>
                </div>
                <div className={style.acoes}>
                    <div className={style.funcoes}>
                        {obra && String(obra.autor_id) === String(userId) ? (
                            <button onClick={handleAddChapter}><FaPlus size={25} /> Adicionar Cap.</button>
                        ) : leitura ? (
                            <button onClick={handleOpenModal}>{leitura.tipo}</button>
                        ) : (
                            <button onClick={handleOpenModal}><FaPlus size={25} /> Adicionar</button>
                        )}
                        <div className={style.icones}>
                            {obra && String(obra.autor_id) === String(userId) && (
                                <FaRegEdit className={style.icone} size={45} title='Editar Obra'/>
                            )}
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
                                {capitulos.map((cap) => (
                                    <div className={style.capitulo} key={cap.numero}>
                                        {cap.visualizado ? (
                                            <IoEyeOff size={25} onClick={() => toggleVisualizacao(cap.numero)} />
                                        ) : (
                                            <IoEye size={25} onClick={() => toggleVisualizacao(cap.numero)} />
                                        )}
                                        <Link href={`/capitulo/${cap.id}`} legacyBehavior>
                                            <span className={style.numero} title={`Ler o Capítulo ${cap.numero}`}> Cap. {cap.numero}</span>
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
        </>
    );
}
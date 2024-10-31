"use client"
import { Menu } from '@/components/Menu';
import style from './style.module.css';
import Pesquisar from '@/components/Pesquisar';
import { ModalPerfil } from '@/components/ModalPerfil';
import { BiArrowFromBottom, BiArrowToBottom, BiSolidLike } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import Comentarios from '@/components/Comentarios';
import { BsFillChatLeftTextFill } from 'react-icons/bs';
import { getObraDetails } from '../../api/routes';
import { isAuthenticated } from '@/utils/auth'; // Import the authentication utility
import { useRouter } from 'next/navigation';
import { PiBookOpenTextBold } from 'react-icons/pi';

interface ObraInfo {
    id: number;
    titulo: string;
    sinopse: string;
    capa: string;
    autor: {
        nome: string;
    };
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

export default function Obra({ params } : { params: { id: string } }) {
    const router = useRouter();
    const [ordemCrescente, setOrdemCrescente] = useState(true)
    const [like, setLike] = useState(false);
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [obra, setObra] = useState<ObraInfo | null>(null);

    useEffect(() => {
        // Redirect to login if the user is not authenticated
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        // Fetch obra details
        const fetchObra = async () => {
            const response = await getObraDetails(parseInt(params.id));
            setObra(response);
        };

        fetchObra();
    }, [params.id, router]);

    const toggleOrdem = () => {
        if (obra) {
            const novaOrdem = [...obra.capitulos].sort((a, b) =>
              ordemCrescente ? a.numero - b.numero : b.numero - a.numero
            );
            setObra({ ...obra, capitulos: novaOrdem });
            setOrdemCrescente(!ordemCrescente);
        }
    };

    const toggleVisualizacao = (numero: number) => {
        if (obra) {
            const capitulosAtualizados = obra.capitulos.map(capitulo => 
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
                        <p>{obra?.autor.nome}</p>
                        <p>{obra?.tipo}</p>
                        <p>{obra?.estado}</p>
                        <p>{obra ? formatarData(obra.dataPublicacao) : 'Data não disponível'}</p>
                    </div>
                </div>
            </div>
            <div className={style.acoes}>
                <div className={style.funcoes}>
                    <button><FaPlus size={25}/> Adicionar</button>
                    <div className={style.icones}>
                        <div onClick={toggleLike}>
                            <BiSolidLike size={45} className={like ? style.like : style.curtir}/>
                                {obra && obra.likes > 0 && (
                                    <span className={like ? style.curtido : style.likesCount}>{obra?.likes}</span>
                                )}
                        </div>
                        {mostrarComentarios ? (
                            <BsFillChatLeftTextFill size={45} onClick={toggleComentarios} 
                            className={style.aberto}/>
                        ) : (
                            <PiBookOpenTextBold size={45} onClick={toggleComentarios} 
                            className={style.aberto}/>
                        )
                        }
                    </div>
                </div>
                {mostrarComentarios ? (
                    <Comentarios />
                ) : (
                    <div className={style.capitulosContainer}>
                        <div className={style.topoCapitulos}>
                            <h1>Capítulos: </h1>
                            <div className={style.mudarOrdem}>
                                <BiArrowToBottom size={45} 
                                className={ordemCrescente ? style.selecionado : ''} onClick={toggleOrdem}/>
                                <BiArrowFromBottom size={45} className={!ordemCrescente ? style.selecionado : ''} 
                                onClick={toggleOrdem}/>
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
        </>
    )
}

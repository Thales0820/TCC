"use client"
import { Menu } from '@/components/Menu';
import style from './style.module.css';
import Pesquisar from '@/components/Pesquisar';
import { ModalPerfil } from '@/components/ModalPerfil';
import { BiArrowFromBottom, BiArrowToBottom, BiSolidLike } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useState } from 'react';
import Comentarios from '@/components/Comentarios';
import { BsFillChatLeftTextFill } from 'react-icons/bs';

interface Capitulo {
    numero: number;
    titulo: string;
    visualizado: boolean;
}

interface ObraInfo {
    titulo: string;
    image: string;
    estado: string;
    tipo: string;
    dataLancamento: string;
    autor: string;
    sinopse: string;
    likes: number;
    generos: string[];
    capitulos: Capitulo[];
}

export default function Obra() {

    const [ordemCrescente, setOrdemCrescente] = useState(true)
    const [like, setLike] = useState(false);
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [obra, setObra] = useState<ObraInfo>({
        titulo: 'One Piece',
        image: 'https://mangadex.org/covers/a1c7c817-4e59-43b7-9365-09675a149a6f/c4bdbbc6-f6c1-4fe9-ab28-ff9ab44b6694.png',
        estado: 'Publicando',
        tipo: 'Mangá',
        dataLancamento: '22/07/1997',
        autor: 'Eiichiro Oda',
        sinopse: 'One Piece conta a história do jovem Monkey D. Luffy, que ganhou poderes de borracha depois de comer uma fruta do diabo. O enredo mostra as aventuras de Luffy e seu grupo, Os Piratas de Chapéu de Palha, em busca do One Piece, o tesouro mais procurado do mundo.',
        likes: 100,
        generos: ['Aventura', 'Ação', 'Comédia', 'Drama', 'Fantasia'],
        capitulos: [
            { numero: 1124, titulo: "Melhor Amigo", visualizado: false },
            { numero: 1123, titulo: "Duas Semanas Perdidas", visualizado: false },
            { numero: 1122, titulo: "Quando a Hora Chegar", visualizado: false }
        ]
    });

     // Função para alternar entre crescente e decrescente
     const toggleOrdem = () => {
        setOrdemCrescente(!ordemCrescente);
        // Ordena os capítulos com base no estado atual
        const novaOrdem = [...obra.capitulos].sort((a, b) => 
            ordemCrescente ? a.numero - b.numero : b.numero - a.numero);
        setObra({ ...obra, capitulos: novaOrdem });
    };

    // Função para alternar o estado de visualização de um capítulo
    const toggleVisualizacao = (numero: number) => { // Tipando o parâmetro como number
        const capitulosAtualizados = obra.capitulos.map(capitulo => {
            if (capitulo.numero === numero) {
                return { ...capitulo, visualizado: !capitulo.visualizado }; // Alterna o estado de visualizado
            }
            return capitulo;
        });
        setObra({ ...obra, capitulos: capitulosAtualizados });
    };

    const toggleLike = () => {
        setLike(!like);
        const novoLike = like ? obra.likes - 1 : obra.likes + 1;
        setObra({ ...obra, likes: novoLike})
    }

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
                    <img src={obra.image} alt={`Capa de ${obra.titulo}`} />
                </div>
                <div className={style.informacoes}>
                    <h1 className={style.titulo}>{obra.titulo}</h1>
                    <div className={style.generos}>
                        {obra.generos.map((genero, index) => (
                            <div key={index}><p>{genero}</p></div>
                        ))}
                    </div>
                    <p>{obra.sinopse}</p>
                    <div className={style.especificacao}>
                        <p>{obra.autor}</p>
                        <p>{obra.tipo}</p>
                        <p>{obra.estado}</p>
                        <p>{obra.dataLancamento}</p>
                    </div>
                </div>
            </div>
            <div className={style.acoes}>
                <div className={style.funcoes}>
                    <button><FaPlus size={25}/> Adicionar</button>
                    <div className={style.icones}>
                        <div onClick={toggleLike}>
                            <BiSolidLike size={45} className={like ? style.like : style.curtir}/>
                                {obra.likes > 0 && (
                                    <span className={like ? style.curtido : style.likesCount}>{obra.likes}</span>
                                )}
                        </div>
                        <BsFillChatLeftTextFill size={45} onClick={toggleComentarios} 
                            className={mostrarComentarios ? style.aberto : style.fechado}/>
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
                            {obra.capitulos.map(cap => (
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
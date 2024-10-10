"use client"
import { Menu } from '@/components/Menu';
import style from './style.module.css';
import Pesquisar from '@/components/Pesquisar';
import { ModalPerfil } from '@/components/ModalPerfil';
import { BiArrowFromBottom, BiArrowToBottom, BiSolidLike } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useState } from 'react';

interface Capitulo {
    numero: number;
    titulo: string;
    visualizado: boolean;
}

export default function Obra() {

    const [ordemCrescente, setOrdemCrescente] = useState(true)

    const [capitulos, setCapitulos] = useState([
        { numero: 1124, titulo: "Melhor Amigo", visualizado: false },
        { numero: 1123, titulo: "Duas Semanas Perdidas", visualizado: false },
        { numero: 1122, titulo: "Quando a Hora Chegar", visualizado: false }
    ])

     // Função para alternar entre crescente e decrescente
     const toggleOrdem = () => {
        setOrdemCrescente(!ordemCrescente);
        // Ordena os capítulos com base no estado atual
        const novaOrdem = [...capitulos].sort((a, b) => ordemCrescente ? a.numero - b.numero : b.numero 
        - a.numero);
        setCapitulos(novaOrdem);
    };

    // Função para alternar o estado de visualização de um capítulo
    const toggleVisualizacao = (numero: number) => { // Tipando o parâmetro como number
        const capitulosAtualizados = capitulos.map(capitulo => {
            if (capitulo.numero === numero) {
                return { ...capitulo, visualizado: !capitulo.visualizado }; // Alterna o estado de visualizado
            }
            return capitulo;
        });
        setCapitulos(capitulosAtualizados);
    };

    return(
        <>
        <Menu />
        <Pesquisar />
        <ModalPerfil />
        <div className={style.containerObra}>
            <div className={style.detalhe}>
                <div className={style.capa}>
                    <img src="https://mangadex.org/covers/a1c7c817-4e59-43b7-9365-09675a149a6f/c4bdbbc6-f6c1-4fe9-ab28-ff9ab44b6694.png" alt="Capa de One Piece" />
                </div>
                <div className={style.informacoes}>
                    <h1 className={style.titulo}>One Piece</h1>
                    <div className={style.generos}>
                        <div><p>Aventura</p></div>
                        <div><p>Ação</p></div>
                        <div><p>Comédia</p></div>
                        <div><p>Drama</p></div>
                        <div><p>Fantasia</p></div>
                    </div>
                    <p>One Piece conta a história do jovem Monkey D. Luffy, que ganhou poderes de borracha depois de comer uma fruta do diabo. O enredo mostra as aventuras de Luffy e seu grupo, Os Piratas de Chapéu de Palha, em busca do One Piece, o tesouro mais procurado do mundo.</p>
                    <div className={style.especificacao}>
                        <p>Eiichiro Oda</p>
                        <p>Publicando</p>
                        <p>22/07/1997</p>
                    </div>
                </div>
            </div>
            <div className={style.acoes}>
                <div className={style.funcoes}>
                    <button><FaPlus size={25}/> Adicionar</button>
                    <div className={style.icones}>
                        <BiSolidLike size={45}/>
                        <i className="bi bi-chat-left-text"></i>
                    </div>
                </div>
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
                        {capitulos.map(cap => (
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
            </div>
        </div>
        </>
    )
}
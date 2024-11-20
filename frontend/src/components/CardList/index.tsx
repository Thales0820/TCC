"use client";
import style from "./style.module.css";
import { useRouter } from "next/navigation";

interface Capitulo {
    id: number;
    numero: string;
    titulo: string;
}

interface Obra {
    id: number;
    titulo: string;
    capa: string;
    capitulos: Capitulo[];
}

interface CardComponentProps {
    data: Obra[];
}

export const CardList: React.FC<CardComponentProps> = ({ data }) => {
    const router = useRouter();

    const handleObraClick = (obraId: number) => {
        router.push(`/obra/${obraId}`); // Redireciona para a página da obra
    };

    const handleCapituloClick = (capituloId: number) => {
        router.push(`/capitulo/${capituloId}`); // Redireciona para a página do capítulo
    };

    return (
        <div className={style.containerCard}>
            <div className={style.row}>
                {data.map((obra) => (
                    <div key={obra.id} className={style.card}>
                        <img src={obra.capa.startsWith("http") ? obra.capa : `http://localhost:8000/${obra.capa}`}
                            alt={`Capa da obra ${obra.titulo}`} className={style.image} 
                            onClick={() => handleObraClick(obra.id)}/>
                        <div className={style.conteudo}>
                            <h2 className={style.nome} onClick={() => handleObraClick(obra.id)}>{obra.titulo}</h2>
                            <div className={style.barra}></div>
                            <div className={style.capitulos}>
                                {obra.capitulos.map((cap) => (
                                    <div key={cap.id} className={style.informacoes}
                                        onClick={(e) => { e.stopPropagation(); // Impede o clique de acionar o evento da obra
                                            handleCapituloClick(cap.id);}}>  {/* Clique no capítulo */}
                                        <span className={style.capitulo}>Cap. {cap.numero}</span>
                                        <span className={style.tituloCap}>{cap.titulo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardList;

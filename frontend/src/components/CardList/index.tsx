"use client"
import style from "./style.module.css";

interface Capitulo {
    numero: string;
    titulo: string;
}
  
interface Obra {
    titulo: string;
    image: string;
    capitulos: Capitulo[];
}
  
interface CardComponentProps {
    data: Obra[];
}

export const CardList: React.FC<CardComponentProps> = ({data}) => {
    return(
        <>
        <div className={style.containerCard}>
            <div className={style.row}>
                {data.map((item, index) => (
                <div key={index} className={style.card}>
                    <img src={item.image} alt={`Capa de ${item.titulo}`} className={style.image} />
                    <div className={style.conteudo}>
                        <h2 className={style.nome}>{item.titulo}</h2>
                        <div className={style.barra}></div>
                        <div className={style.capitulos}>
                            {item.capitulos.map((cap, capIndex) => (
                            <div key={capIndex} className={style.informacoes}>
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
        </>
    )
}

export default CardList
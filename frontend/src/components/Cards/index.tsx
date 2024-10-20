"use client"
import style from "./style.module.css";

interface CardItem {
  capa: string;
  titulo: string;
}

interface CardsProps {
  data: CardItem[];
}

export const Cards: React.FC<CardsProps> = ({ data }) => {

    return (
      <>
      <div className={style.cardsContainer}>
          {data.map((item, index) => (
            <div key={index} className={style.card}>
               <img src={`http://localhost:8000/${item.capa}`} alt={`Capa de ${item.titulo}`} />
              <p>{item.titulo}</p>
            </div>
        ))}
      </div>
      </>
    );
  };
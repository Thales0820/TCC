"use client"
import style from "./style.module.css";

interface CardItem {
  image: string;
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
              <img src={item.image} alt={`Capa de ${item.titulo}`} />
              <p>{item.titulo}</p>
            </div>
        ))}
      </div>
      </>
    );
  };
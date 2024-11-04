"use client"
import Link from "next/link";
import style from "./style.module.css";

interface CardItem {
  id: number;
  image: string;
  titulo: string;
}

interface CardsProps {
  data: CardItem[];
}

export const Cards: React.FC<CardsProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>Nenhum dado disponível</p>; // Para lidar com a ausência de dados
  }

  return (
    <>
      <div className={style.cardsContainer}>
        {data.map((item) => (
          <div key={item.id} className={style.card}>
              <Link href={`obra/${item.id}`} legacyBehavior>
                <img src={item.image.startsWith("http") ? item.image : `http://localhost:8000/${item.image}`} alt={`image de ${item.titulo}`} />
              </Link>
              <p>{item.titulo}</p>
          </div>
        ))}
      </div>
    </>
  );
};

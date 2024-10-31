"use client";
import Link from "next/link";
import style from "./style.module.css";
import { useState } from "react";

interface CardItem {
  id: number;
  capa: string;
  titulo: string;
}

interface CardsProps {
  data: CardItem[];
}

export const CardsHome: React.FC<CardsProps> = ({ data }) => {
  const maxItems = 10; // Limite máximo de obras no carrossel
  const itemsPerPage = 4; // Número de itens exibidos por vez
  const itemsToSlide = 2; // Número de itens que deslizam por clique
  const [startIndex, setStartIndex] = useState(0);

  // Limitar o número de itens ao máximo permitido
  const limitedData = data.slice(0, maxItems);

  // Obter o subconjunto de obras a serem exibidas com base no índice inicial
  const visibleData = limitedData.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + itemsToSlide, limitedData.length - itemsPerPage));
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsToSlide, 0));
  };

  return (
    <div className={style.carouselContainer}>
      <div className={style.cards}>
        <button onClick={handlePrev} disabled={startIndex === 0} className={`${style.arrowButton} ${style.left}`}>
          <i className="bi bi-chevron-left"></i>
        </button>
        {visibleData.map((item) => (
          <div key={item.id} className={style.card}>
            <Link href={`obra/${item.id}`} legacyBehavior>
              <img src={`http://localhost:8000/${item.capa}`} alt={`Capa de ${item.titulo}`} />
            </Link>
            <p>{item.titulo}</p>
          </div>
        ))}
        <button onClick={handleNext} disabled={startIndex + itemsPerPage >= limitedData.length} 
                className={`${style.arrowButton} ${style.right}`}>
                <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

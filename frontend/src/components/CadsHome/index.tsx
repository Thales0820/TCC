"use client";
import Link from "next/link";
import style from "./style.module.css";
import { useEffect, useState } from "react";

interface CardItem {
  id: number;
  capa: string;
  titulo: string;
}

interface CardsProps {
  data: CardItem[];
}

export const CardsHome: React.FC<CardsProps> = ({ data }) => {
  const [itemsPerPage, setItemsPerPage] = useState(4); // Valor padrão
  const [startIndex, setStartIndex] = useState(0);
  const maxItems = 10;
  const itemsToSlide = 2;

  // Limitar o número de itens ao máximo permitido
  const limitedData = data.slice(0, maxItems);

  // Obter o subconjunto de obras a serem exibidas com base no índice inicial
  const visibleData = limitedData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) setItemsPerPage(2); // Mobile
      else if (width <= 1024) setItemsPerPage(3); // Tablet
      else setItemsPerPage(4); // Desktop
    };

    handleResize(); // Ajusta ao carregar
    window.addEventListener("resize", handleResize); // Atualiza ao redimensionar

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

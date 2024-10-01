"use client"
import React from "react";
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
              <img src={item.image || "default-image-url.jpg"} alt={`Capa de ${item.titulo} || "Desconhecido"`} />
              <p>{item.titulo || "Título desconhecido"}</p>
            </div>
        ))}
      </div>
      </>
    );
  };
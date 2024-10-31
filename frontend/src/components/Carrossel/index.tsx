"use client";
import { useEffect, useState } from "react";
import style from "./style.module.css";
import { getObraDetails, getObraIds } from "@/app/api/routes";
import Link from "next/link";

interface Obra {
  id: number;
  capa: string;
  titulo: string;
  generos: string[];
  sinopse: string;
  autor: string; // Ajuste o tipo para aceitar um objeto com nome
}

export const Carrossel: React.FC = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);

  const fetchObrasAleatorias = async () => {
    try {
      const ids = await getObraIds();
      const novasObras: Obra[] = [];

      // Seleciona 5 IDs aleatórios
      const idsAleatorios = ids.sort(() => 0.5 - Math.random()).slice(0, 5);

      for (const id of idsAleatorios) {
        const obra = await getObraDetails(id);
        if (obra) novasObras.push(obra);
      }

      setObras(novasObras);
      setIndiceAtual(0); // Começa mostrando a primeira obra do array
    } catch (error) {
      console.error("Erro ao buscar obras aleatórias:", error);
    }
  };

  useEffect(() => {
    fetchObrasAleatorias();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndiceAtual((prevIndice) => (prevIndice + 1) % obras.length);
    }, 15000); // 10 segundos

    return () => clearInterval(interval); // Limpa o timer ao desmontar o componente
  }, [obras.length]);

  const obraAtual = obras[indiceAtual];

  const handleNext = () => {
    setIndiceAtual((prevIndice) => (prevIndice + 1) % obras.length);
  };

  const handlePrev = () => {
    setIndiceAtual((prevIndice) => 
      (prevIndice - 1 + obras.length) % obras.length
    );
  };


  if (obras.length === 0) {
    return <p>Carregando obra...</p>;
  }

  return (
    <div className={style.carrossel}>
        <div className={style.images}>
          <img src={obraAtual.capa} alt={`Obra ${obraAtual.titulo}`} />
        </div>
      <div className={style.obra}>
        <Link href={`obra/${obraAtual.id}`} legacyBehavior>
          <img src={obraAtual.capa} alt={`Capa de ${obraAtual.titulo}`} />
        </Link>
        <div className={style.informacoes}>
          <h1>{obraAtual.titulo}</h1>
          <div className={style.generos}>
            {obraAtual.generos && obraAtual.generos.length > 0 ? (
              obraAtual.generos.map((genero: string, index: number) => (
                <div key={index}>
                  <p>{genero}</p>
                </div>
              ))
            ) : (
              <p>Gêneros não disponíveis</p>
            )}
          </div>
          <p className={style.sinopse}><strong>{obraAtual.sinopse}</strong></p>
          <p><strong>{obraAtual.autor}</strong></p>
        </div>
      </div>
      <div className={style.navigationContainer}>
        <button onClick={handlePrev} className={style.prevButton}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className={style.progressContainer}>
          {obras.map((_, index) => (
            <div
              key={index}
              className={`${style.progressBar} ${
                index === indiceAtual ? style.active : ""
              }`}
            ></div>
          ))}
        </div>
        <button onClick={handleNext} className={style.nextButton}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};
export default Carrossel;
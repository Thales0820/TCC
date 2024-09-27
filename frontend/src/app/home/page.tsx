"use client"
import { Menu } from '@/components/Menu';
import styles from './style.module.css';

async function getObras() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/obras", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao buscar as obras");
  }

  return res.json();
}

export default async function Home() {
  const obras = await getObras();

  return (
    <>
      <Menu />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Bem-vindo à página Home</h1>
          <ul className={styles.list}>
            {obras.map((obra: any) => (
              <li key={obra.id} className={styles.card}>
                <h2 className={styles.cardTitle}>{obra.titulo}</h2>
                <p className={styles.cardText}>
                  <strong>Autor:</strong>{" "}
                  {obra.usuario ? obra.usuario.nome : "Autor não encontrado"}
                </p>
                <p className={styles.cardText}>
                  <strong>Likes:</strong> {obra.likes}
                </p>
                <button className={styles.button}>Ver Detalhes</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

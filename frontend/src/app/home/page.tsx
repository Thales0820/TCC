"use client";
import { Menu } from '@/components/Menu';
import style from './style.module.css';
import { Carrossel } from '@/components/Carrossel';
import { useEffect, useState } from 'react';

async function getObras() {
    const res = await fetch("http://127.0.0.1:8000/api/v1/obras", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Falha ao buscar as obras");
    }

    return res.json();
}

export default function Home() {
    const [obras, setObras] = useState([]);

    useEffect(() => {
        getObras().then((data) => {
            setObras(data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <>
            <Menu />
            <div className={style.container}>
                <Carrossel />
                <div className={style.wrapper}>
                    <h1 className={style.title}>Bem-vindo à página Home</h1>
                    <ul className={style.list}>
                      {obras.map((obra: any) => (
                        <li key={obra.id} className={style.card}>
                          <h2 className={style.cardTitle}>{obra.titulo}</h2>
                          <p className={style.cardText}>
                            <strong>Autor:</strong>{" "}
                            {obra.usuario ? obra.usuario.nome : "Autor não encontrado"}
                          </p>
                          <p className={style.cardText}>
                            <strong>Likes:</strong> {obra.likes}
                          </p>
                          <button className={style.button}>Ver Detalhes</button>
                        </li>
                      ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

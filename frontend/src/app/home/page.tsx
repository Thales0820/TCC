"use client";
import { Menu } from '@/components/Menu';
import style from './style.module.css';
import { Carrossel } from '@/components/Carrossel';
import { useEffect, useState } from 'react';
import Pesquisar from '@/components/Pesquisar';
import { ModalPerfil } from '@/components/ModalPerfil';

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
                <Pesquisar />
                <ModalPerfil />
                <Carrossel />
                <div className={style.wrapper}>
                    <div className={style.cards}>
                        <div className={style.card}>
                            <img src="https://a-static.mlcdn.com.br/450x450/poster-cartaz-batman-a-piada-mortal-pop-arte-poster/poparteskins2/15938544114/bb3e16085364ca48b024042f6dc1548e.jpeg" alt="Capa de Batman: A Piada Mortal" />
                            <p>Batman: A Piada Mortal</p>
                        </div>
                        <div className={style.card}>
                            <img src="https://mangadex.org/covers/32d76d19-8a05-4db0-9fc2-e0b0648fe9d0/95c6aa66-fab2-4388-be95-d7890dc0598a.jpg" />
                            <p>Solo Leveling</p>
                        </div>
                        <div className={style.card}>
                            <img src="https://media.fstatic.com/xTq6vfyhx_pfWVOkNWI-2DSGwSA=/322x478/smart/filters:format(webp)/media/movies/covers/2011/04/9a4c1509d7e0707a25e1b70e92adc285.jpg" alt="Capa de As Aventuras de Tintin" />
                            <p>As Aventuras de Tintim</p>
                        </div>
                        <div className={style.card}>
                            <img src="https://mangadex.org/covers/4ada20eb-085a-491a-8c49-477ab42014d7/69098388-a967-464f-8178-344aa9bd4b31.jpg" alt="Capa de The Beginning After the End" />
                            <p>The Beginning After the End</p>
                        </div>
                        {/* {obras.map((obra: any) => (
                            <div key={obra.id} className={style.card}>
                                <img src={`http://localhost:8000/${obra.capa}`} alt={`Capa de ${obra.titulo}`} />
                                <p>{obra.titulo}</p>
                            </div>
                        ))} */}
                    </div>
                </div>
            </div>
        </>
    );
}

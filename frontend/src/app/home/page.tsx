"use client";
import { Menu } from '@/components/Menu';
import style from './style.module.css';
import { Carrossel } from '@/components/Carrossel';
import { useEffect, useState } from 'react';
import Pesquisar from '@/components/Pesquisar';
import { ModalPerfil } from '@/components/ModalPerfil';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { verificaTokenExpirado, isAuthenticated } from '@/utils/auth';

async function getObras() {
    const res = await fetch("http://127.0.0.1:8000/api/v1/obras", { cache: "no-store" });

    if (!res.ok) {
        throw new Error("Falha ao buscar as obras");
    }

    return res.json();
}

export default function Home() {
    const router = useRouter();
    const [obras, setObras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchObras = async () => {
            try {
                const data = await getObras();
                setObras(data);
            } catch (error) {
                console.error("Erro ao buscar obras:", error);
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchObras();
    }, []);

    // Função que será chamada quando o usuário clicar em uma obra
    const handleObraClick = (obraId: number) => {
        const token = parseCookies()['obra.token'];
        const authenticated = isAuthenticated() && !verificaTokenExpirado(token);

        if (!authenticated) {
            console.log('Redirecionando para o login...');
            router.push('/login');
        } else {
            router.push(`/obras/${obraId}`);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro: {error}</div>;
    }

    return (
        <>
            <Menu />
            <div className={style.container}>
                <Pesquisar />
                <ModalPerfil />
                <Carrossel />
                <div className={style.wrapper}>
                    <div className={style.cards}>
                        {obras.map((obra: any) => (
                            <div
                                key={obra.id}
                                className={style.card}
                                onClick={() => handleObraClick(obra.id)} // Chamando a função de clique
                            >
                                <img src={`http://localhost:8000/${obra.capa}`} alt={`Capa de ${obra.titulo}`} />
                                <p>{obra.titulo}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

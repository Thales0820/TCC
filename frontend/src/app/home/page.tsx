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
import { CardsHome } from '@/components/CadsHome';
import { getGeneroIds, getObrasLikes, getObrasPorGenero, getObrasRecentes } from '../api/routes';

export default function Home() {
    const router = useRouter();
    const [obrasLikes, setObrasLikes] = useState([]);
    const [obrasNovas, setObrasNovas] = useState([]);
    const [obrasGenero, setObrasGenero] = useState([]);
    const [generoNome, setGeneroNome] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchObrasNovas = async () => {
            try {
                console.log("Fetching obras...");
                const data = await getObrasRecentes();
                setObrasNovas(data);
                console.log("Fetched obras:", data);
                setObrasNovas(data);
            } catch (error) {
                console.error("Erro ao buscar obras:", error);
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        const fetchObrasLike = async () => {
            try {
                console.log("Fetching obras...");
                const data = await getObrasLikes();
                setObrasLikes(data);
                console.log("Fetched obras:", data);
                setObrasLikes(data);
            } catch (error) {
                console.error("Erro ao buscar obras:", error);
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        const fetchObrasGenero = async () => {
            try {
                // Obtenha os IDs dos gêneros
                const generoIds = await getGeneroIds();
                
                if (generoIds.length === 0) {
                    console.warn("Nenhum ID de gênero encontrado.");
                    return;
                }
        
                // Escolha um ID aleatório da lista
                const generoIdAleatorio = generoIds[Math.floor(Math.random() * generoIds.length)];
        
                // Use o ID aleatório para buscar obras
                const data = await getObrasPorGenero(generoIdAleatorio.id);
                setObrasGenero(data);

                setGeneroNome(generoIdAleatorio.nome)

                console.log(`Obras do gênero aleatório ${generoIdAleatorio}:`, data);
            } catch (error) {
                console.error("Erro ao buscar obras do gênero aleatório:", error);
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchObrasNovas();
        fetchObrasLike();
        fetchObrasGenero();
    }, []);

    // Função que será chamada quando o usuário clicar em uma obra
    const handleObraClick = (obraId: number) => {
        const token = parseCookies()['obra.token'];
        
        // Verifica se o usuário está autenticado e se o token não está expirado
        const authenticated = isAuthenticated() && !verificaTokenExpirado(token);

        if (!authenticated) {
            console.log('Redirecionando para o login...');
            router.push('/login');
        } else {
            router.push(`/obra/${obraId}`);
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
                    <h1 className={style.tema}>Novidades:</h1>
                        <CardsHome data={obrasNovas} />
                    <h1 className={style.tema}>Mais Curtidos:</h1>
                        <CardsHome data={obrasLikes} />
                    <h1 className={style.tema}>Pra quem gosta de {generoNome}:</h1>
                        <CardsHome data={obrasGenero} />
                    <br />
                </div>
            </div>
        </>
    );
}
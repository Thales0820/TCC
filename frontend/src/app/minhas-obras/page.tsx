"use client";
import { Menu } from "@/components/Menu";
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Cards } from "@/components/Cards";
import Pesquisar from "@/components/Pesquisar";
import { ModalPerfil } from "@/components/ModalPerfil";
import { parseCookies } from 'nookies';
import {jwtDecode} from 'jwt-decode';
import { isAuthenticated, verificaTokenExpirado } from "@/utils/auth"; // Importa do auth.ts
import { getObrasPorAutor } from "../api/routes";

interface TokenPayload {
    sub: string;
}

interface Usuario {
    id: number;
    nome: string;
    perfil: {
        tipo: string;
    };
}

interface Obra {
    id: number
    titulo: string
    capa: string
    estado: string
}

export default function MinhasObras() {
    const router = useRouter();
    const [selecioneEstado, setSelecioneEstado] = useState<string>("Publicando");
    const [autorId, setAutorId] = useState<number | null>(null);
    const [nomeAutor, setNomeAutor] = useState<string>("");
    const [obras, setObras] = useState<Obra[]>([])

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies['obra.token'];

        if (token && isAuthenticated() && !verificaTokenExpirado(token)) {
            const decodedToken: TokenPayload = jwtDecode<TokenPayload>(token);
            const userId = decodedToken.sub;

            const fetchUserObras = async () => {
                try {
                    const res = await fetch(`http://127.0.0.1:8000/api/v1/usuarios/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!res.ok) {
                        throw new Error("Erro ao buscar dados do usuário.");
                    }

                    const usuario: Usuario = await res.json();

                    // Verifica se o usuário é um autor
                    if (!usuario.perfil || usuario.perfil.tipo !== 'Autor') {
                        router.push('/home');
                        return;
                    }

                    setAutorId(usuario.id);
                    setNomeAutor(usuario.nome);

                    console.log('id: ' + usuario.id )

                    const obrasDoAutor = await getObrasPorAutor(usuario.id)
                    setObras(obrasDoAutor)                    

                } catch (error) {
                    console.error("Erro ao verificar o perfil do usuário:", error);
                    router.push('/home'); // Redireciona se houver erro
                }
            };

            fetchUserObras();
        } else {
            router.push('/home'); // Redireciona se o token não for válido
        }
    }, [router]);

    const voltar = () => {
        router.back();
    }

    const handleStatusClick = (estadoPublicacao: string) => {
        setSelecioneEstado(estadoPublicacao);
    }

    const filtrarLeitura = obras.filter((obra) => obra.estado === selecioneEstado);

    return (
        <>
            <Menu />
            <Pesquisar />
            <ModalPerfil />
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Seus Quadrinhos</h1>
                </div>
                <div className={style.listaContainer}>
                    <div className={style.listagem}>
                        <div className={style.lista}>
                            <div onClick={() => handleStatusClick('Publicando')} 
                            className={`${style.leitura} ${selecioneEstado === 'Publicando' ? style.selecionado : ''}`} 
                            ><p>Publicando</p></div>
                            <div onClick={() => handleStatusClick('Pausado')} 
                            className={`${style.leitura} ${selecioneEstado === 'Pausado' ? style.selecionado : ''}`}
                            ><p>Pausado</p></div>
                            <div onClick={() => handleStatusClick('Finalizado')} 
                            className={`${style.leitura} ${selecioneEstado === 'Finalizado' ? style.selecionado : ''}`}
                            ><p>Finalizado</p></div>
                            <div onClick={() => handleStatusClick('Cancelado')} 
                            className={`${style.leitura} ${selecioneEstado === 'Cancelado' ? style.selecionado : ''}`}
                            ><p>Cancelado</p></div>
                        </div>
                    </div>
                </div>
               <Cards data={filtrarLeitura}/>
               <br />
                <Link href="/criar-obra" legacyBehavior>
                  <div className={style.botaoContainer}>
                    <button type="submit" className={style.botao}>Criar Obra</button>
                    <div className={style.iconebotao}>
                      <FaPlus size={24} />
                    </div>
                  </div>
                </Link>
            </div>
            <br />
        </>
    );
}

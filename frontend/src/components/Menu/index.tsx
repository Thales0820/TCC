"use client";
import Link from "next/link";
import style from "./style.module.css";
import { GrUpdate } from 'react-icons/gr';
import { LuBookUp } from 'react-icons/lu';
import { SiBookstack } from 'react-icons/si';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface Perfil {
    id: number;
    tipo: string; // 'Autor', 'Leitor', etc.
}

interface Usuario {
    id: number;
    nome: string;
    foto_perfil: string;
    email: string;
    perfil_id: number;
    perfil: Perfil;
}

interface Payload {
    sub: number; // ou string, dependendo de como o ID do usuário é armazenado
}

export const validaTipo = (
    usuario: Usuario | null,
    tiposPermitidos: Array<string>
) => {
    if (usuario && usuario.perfil && tiposPermitidos.includes(usuario.perfil.tipo)) {
        return true;
    }
    return false; // Se o usuário não for encontrado ou o tipo não estiver permitido
};

// Função para buscar um usuário pelo ID
const buscarUsuarioPorId = async (id: number): Promise<Usuario | null> => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/usuarios/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar usuário");
        }
        const data: Usuario = await response.json();
        return data;
    } catch (error) {
        console.error("Erro:", error);
        return null;
    }
};

export const Menu = () => {
    const [token, setToken] = useState<string | undefined>(undefined);
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        const retrievedToken = Cookies.get('obra.token');
        setToken(retrievedToken); // Armazena o token no estado

        if (retrievedToken) {
            try {
                const payload: Payload = jwtDecode<Payload>(retrievedToken);
                buscarUsuarioPorId(payload.sub).then(setUsuario); // Busca o usuário com o ID do payload
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    return (
        <div className={style.body}>
            <nav className={style.menu}>
                <div>
                    <div className={style.divLogo}>
                        <Link href="/home" legacyBehavior>
                            <img src="/images/logoDark.png" alt="Logo" title="Indie Comics" />
                        </Link>
                    </div>
                    <ul className={style.ul}>
                        <li>
                            <Link href="/home" legacyBehavior>
                                <a className={style.link}>
                                    <i className="bi bi-house-door-fill"></i> <span>Home</span>
                                </a>
                            </Link>
                        </li>
                        {validaTipo(usuario, ['Leitor', 'Autor']) && ( 
                        <li>
                            <Link href="/lista" legacyBehavior>
                                <a className={style.link}>
                                    <i className="bi bi-bookmark-fill"></i> <span>Lista</span>
                                </a>
                            </Link>
                        </li>
                        )}
                        <li>
                            <Link href="/pesquisar" legacyBehavior>
                                <a className={style.link}>
                                    <i className="bi bi-search"></i> <span>Pesquisar</span>
                                </a>
                            </Link>
                        </li>
                            {validaTipo(usuario, ['Leitor', 'Autor']) && (
                        <li>
                                <Link href="/atualizacoes" legacyBehavior>
                                    <a className={style.link}>
                                        <GrUpdate /> <span>Atualizações</span>
                                    </a>
                                </Link>
                        </li>
                            )}
                            {validaTipo(usuario, ['Leitor', 'Autor']) && ( //
                        <li>
                                <Link href="/historico" legacyBehavior>
                                    <a className={style.link}>
                                        <i className="bi bi-clock-history"></i> <span>Histórico</span>
                                    </a>
                                </Link>
                        </li>
                            )}
                        <li>
                            <Link href="/obras" legacyBehavior>
                                <a className={style.link}>
                                    <SiBookstack /> <span>Quadrinhos</span>
                                </a>
                            </Link>
                        </li>
                        {validaTipo(usuario, ['Autor']) && ( // Renderiza 'Lançar' apenas se for Autor
                            <li>
                                <Link href="/minhas-obras" legacyBehavior>
                                    <a className={style.link}>
                                        <LuBookUp /> <span>Lançar</span>
                                    </a>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

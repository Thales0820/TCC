import { FaBookmark, FaUser } from "react-icons/fa";
import style from './style.module.css';
import { useState, useEffect } from "react";
import { LuArrowLeftFromLine } from "react-icons/lu";
import { MdWbSunny } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import Link from "next/link";
import { parseCookies, destroyCookie } from 'nookies';
import { jwtDecode } from "jwt-decode"; // Corrige para "jwtDecode"
import { useTheme } from "@/hooks/useTheme";
import { RiMoonClearFill } from "react-icons/ri";

// Interface do payload do token
interface TokenPayload {
    sub: string; // ID do usuário no token
}

interface Perfil {
    id: number;
    tipo: string;
}

interface Usuario {
    id: number;
    nome: string;
    perfil: Perfil | null;
}

export const ModalPerfil = () => {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [error, setError] = useState<string | null>(null);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies['obra.token'];

        if (token) {
            const decodedToken = jwtDecode<TokenPayload>(token); // Usando jwtDecode com a importação correta
            const userId = decodedToken.sub;

            const fetchUserData = async () => {
                try {
                    const res = await fetch(`http://127.0.0.1:8000/api/v1/usuarios/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        const data: Usuario = await res.json();
                        console.log('Dados do usuário:', data);
                        setUsuario(data);
                    } else {
                        setError("Erro ao buscar dados do usuário.");
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                    setError("Erro ao buscar dados do usuário.");
                }
            };

            fetchUserData();
        }
    }, []);

    const handleLogout = () => {
        destroyCookie(null, 'obra.token');
        console.log("Usuário deslogado");
        window.location.href = '/login';
    };

    return (
        <>
            <div className={style.profileIcon} onClick={toggleModal}>
                <FaUser size={35} />
            </div>
            {isOpen && (
                <div className={style.modalOverlay} onClick={toggleModal}>
                    <div className={style.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={style.perfil}>
                            <FaUser size={35} />
                            <div className={style.texto}>
                                {usuario ? (
                                    <>
                                        <span className={style.nome}>{usuario.nome}</span>
                                        <span className={style.usuario}>
                                            {usuario.perfil ? usuario.perfil.tipo : 'Perfil não encontrado'}
                                        </span>
                                    </>
                                ) : error ? (
                                    <span>{error}</span>
                                ) : (
                                    <span>Usuário não Logado</span>
                                )}
                            </div>
                        </div>
                        <div className={style.barra}></div>
                        <div className={style.lista}>
                            {usuario ? (
                                <ul>
                                    <Link href="/lista" legacyBehavior>
                                        <li><FaBookmark size={30} /> Lista de Leitura</li>
                                    </Link>
                                    <li><IoMdNotifications size={30} /> Notificações</li>
                                    <li><IoSettingsSharp size={30} /> Configuração</li>
                                </ul>
                            ) : (
                                <div className={style.deslogado}>
                                    <Link href="/login" legacyBehavior>
                                        <button>Faça Login</button>
                                    </Link>
                                    <p>Ou</p>
                                    <Link href="/cadastro" legacyBehavior>
                                        <button>Cadastre-se</button>
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className={style.barra}></div>
                        <div className={style.opcoes}>
                        {theme === "dark" ? (
                            <MdWbSunny size={30} onClick={toggleTheme} 
                                title="Alterar para o tema claro" 
                            /> ) : (
                            <RiMoonClearFill size={30} onClick={toggleTheme} 
                                title="Alterar para o tema escuro" 
                            />
                        )}
                            <LuArrowLeftFromLine onClick={handleLogout} size={30} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
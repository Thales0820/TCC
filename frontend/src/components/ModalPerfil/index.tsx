import { FaBookmark, FaUser } from "react-icons/fa";
import style from './style.module.css';
import { useState, useEffect } from "react";
import { LuArrowLeftFromLine } from "react-icons/lu";
import { MdWbSunny } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import Link from "next/link";
import { parseCookies, destroyCookie } from 'nookies';

// Definição da interface para o perfil
interface Perfil {
    id: number;
    tipo: string;
}

// Definição da interface para o usuário
interface Usuario {
    id: number;
    nome: string;
    perfil: Perfil | null; // Permite que perfil seja null
}

export const ModalPerfil = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies['obra.token'];

        if (token) {
            const fetchUserData = async () => {
                try {
                    const res = await fetch('http://127.0.0.1:8000/api/v1/usuarios', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        const data: Usuario[] = await res.json();
                        console.log('Dados do usuário:', data[0]);
                        setUsuario(data[0]);
                    } else {
                        console.error('Erro ao buscar dados do usuário');
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                }
            };

            fetchUserData();
        }
    }, []);

    const handleLogout = () => {
        destroyCookie(null, 'obra.token');
        console.log("Usuário deslogado");
        window.location.href = '/login'; // Redireciona para a página de login
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
                                ) : (
                                    <span>Carregando...</span>
                                )}
                            </div>
                        </div>
                        <div className={style.barra}></div>
                        <div className={style.lista}>
                            <ul>
                                <Link href="/lista" legacyBehavior>
                                    <li><FaBookmark size={30} /> Lista de Leitura</li>
                                </Link>
                                <li><IoMdNotifications size={30} /> Notificações</li>
                                <li><IoSettingsSharp size={30} /> Configuração</li>
                                <li onClick={handleLogout}><LuArrowLeftFromLine size={30} /> Sair</li>
                            </ul>
                        </div>
                        <div className={style.barra}></div>
                        <div className={style.opcoes}>
                            <MdWbSunny size={30} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

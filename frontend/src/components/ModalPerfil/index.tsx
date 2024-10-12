import { FaBookmark, FaUser } from "react-icons/fa"
import style from './style.module.css'
import { useState } from "react";
import { LuArrowLeftFromLine } from "react-icons/lu";
import { MdWbSunny } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import Link from "next/link";


export const ModalPerfil = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
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
                                <span className={style.nome}>Thales</span>
                                <span className={style.usuario}>Leitor</span>
                            </div>
                        </div>
                        <div className={style.barra}></div>
                        <div className={style.lista}>
                            <ul>
                                <Link href="/lista" legacyBehavior>
                                    <li><FaBookmark size={25}/> Lista de Leitura</li>
                                </Link>
                                    <li><IoMdNotifications size={30}/> Notificações</li>
                                    <li><IoSettingsSharp size={30}/> Configuração</li>
                            </ul>
                        </div>
                        <div className={style.barra}></div>
                        <div className={style.opcoes}>
                            <MdWbSunny  size={30}/>
                            <LuArrowLeftFromLine size={30}/>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
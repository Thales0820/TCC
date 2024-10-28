"use client"
import Link from "next/link";
import style from "./style.module.css";
import { GrUpdate } from 'react-icons/gr';
import { LuBookUp } from 'react-icons/lu';
import { SiBookstack } from 'react-icons/si';

export const Menu = () => {
    return(
        <>
        <div className={style.body}>
            <nav className={style.menu}>
                <div>
                    <div className={style.divLogo}>
                        <Link href="/home" legacyBehavior>
                            <img src="/images/logoDark.png" alt="Logo" title="Indie Comics"/>
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
                        <li>
                            <Link href="/lista" legacyBehavior>
                                <a className={style.link}>
                                    <i className="bi bi-bookmark-fill"></i> <span>Lista</span>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/pesquisar" legacyBehavior>
                                <a className={style.link}>
                                    <i className="bi bi-search"></i> <span>Pesquisar</span>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/atualizacoes" legacyBehavior>
                                <a className={style.link}>
                                    <GrUpdate /> <span>Atualizações</span>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/historico" legacyBehavior>
                                <a className={style.link}>
                                    <i className="bi bi-clock-history"></i> <span>Histórico</span>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/obras" legacyBehavior>
                                <a className={style.link}>
                                    <SiBookstack /> <span>Quadrinhos</span>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/minhas-obras" legacyBehavior>
                                <a className={style.link}   >
                                    <LuBookUp /> <span>Lançar</span>
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
        </>
    );
}
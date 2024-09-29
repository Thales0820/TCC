"use client"
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
                        <img src="images/logoDark.png" alt="Logo" />
                    </div>
                    <ul className={style.ul}>
                        <li><i className="bi bi-house-door-fill"></i> <strong>Home</strong></li>
                        <li><i className="bi bi-bookmark-fill"></i> <strong>Lista</strong></li>
                        <li><i className="bi bi-search"></i> <strong>Pesquisar</strong></li>
                        <li><GrUpdate /> <strong>Atualizações</strong></li>
                        <li><i className="bi bi-clock-history"></i> <strong>Histórico</strong></li>
                        <li><SiBookstack /> <strong>Quadrinhos</strong></li>
                        <li><LuBookUp /> <strong>Lançar</strong></li>
                    </ul>
                </div>
            </nav>
        </div>
        </>
    );
}
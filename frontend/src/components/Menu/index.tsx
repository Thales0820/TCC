"use client";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { GrUpdate } from 'react-icons/gr';
import { LuBookUp } from 'react-icons/lu';
import { SiBookstack } from 'react-icons/si';

export const Menu = () => {
    return(
        <>
            <nav>
                <div>
                    <div>
                        <img src="images/logoDark.png" alt="Logo" />
                    </div>
                    <ul>
                        <li><i className="bi bi-house-door-fill"></i> Home</li>
                        <li><i className="bi bi-bookmark-fill"></i> Lista</li>
                        <li><i className="bi bi-search"></i>Pesquisar</li>
                        <li><GrUpdate /> Atualizações</li>
                        <li><i className="bi bi-clock-history"></i> Histórico</li>
                        <li><SiBookstack /> Quadrinhos</li>
                        <li><LuBookUp />Lançar</li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
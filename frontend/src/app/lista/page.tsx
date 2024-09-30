"use client"
import { FaArrowLeft } from "react-icons/fa";
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { Menu } from "@/components/Menu";

export default function Lista() {
    const router = useRouter();

    const voltar = () => {
        router.back();
    }

    return(
        <>
            <Menu />
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Lista de Leitura</h1>
                </div>
            </div>
        </>
    )
}
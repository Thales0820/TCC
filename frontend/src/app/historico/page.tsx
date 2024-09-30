"use client"
import { Menu } from "@/components/Menu";
import { useRouter } from "next/navigation";
import style from './style.module.css';
import { FaArrowLeft } from "react-icons/fa";

export default function Historico() {
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
                    <h1>Histórico</h1>
                </div>
            </div>
        </>
    )
}
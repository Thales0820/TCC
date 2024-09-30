"use client"
import { Menu } from "@/components/Menu";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import style from './style.module.css';

export default function Obras() {
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
                    <h1>Todos os Quadrinhos</h1>
                </div>
            </div>
        </>
    )
}
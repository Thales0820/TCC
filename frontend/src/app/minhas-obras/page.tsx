"use client"
import { Menu } from "@/components/Menu";
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function MinhasObras() {
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
                    <h1>Seus Quadrinhos</h1>
                </div>
            </div>
        </>
    )
}
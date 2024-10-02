"use client";
import { Menu } from "@/components/Menu";
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function MinhasObras() {
    const router = useRouter();

    const voltar = () => {
        router.back();
    }
    return (
        <>
            <Menu />
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Seus Quadrinhos</h1>
                </div>
                <Link href="/criar-obra" legacyBehavior>
                    <button type="submit" className={style.submitButton}>Criar Obra</button>
                </Link>
                    <FaPlus />
            </div>
        </>
    );
}

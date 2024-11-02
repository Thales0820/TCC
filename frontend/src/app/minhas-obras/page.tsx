"use client";
import { Menu } from "@/components/Menu";
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { Cards } from "@/components/Cards";
import Pesquisar from "@/components/Pesquisar";
import { ModalPerfil } from "@/components/ModalPerfil";

export default function MinhasObras() {

    const obrasData = [
        {
          id: 1,
          capa: "https://m.media-amazon.com/capas/I/818KGgapfiL._SL1500_.jpg",
          titulo: "A Garota do Mar",
          estado: "Publicando",
        },
        {
          id: 2,
          capa: "https://mangadex.org/covers/aa6c76f7-5f5f-46b6-a800-911145f81b9b/2d50161f-e715-4e4f-86bd-d38772823b39.jpg",
          titulo: "Sono Bisque Doll wa Koi o Suru",
          estado: "Pausado",
        },
        {
          id: 3,
          capa: "https://m.media-amazon.com/capas/I/814zhAWOKBL._AC_UF1000,1000_QL80_.jpg",
          titulo: "Persépolis",
          estado: "Cancelado",
        },
        {
          id: 4,
          capa: "https://m.media-amazon.com/capas/I/81dQUROWcHL._AC_UF1000,1000_QL80_.jpg",
          titulo: "Adulthood Is a Myth",
          estado: "Finalizado",
        },
      ];

    const router = useRouter();
    const [selecioneEstado, setSelecioneEstado] = useState<string>("Publicando");

    const voltar = () => {
        router.back();
    }

    const handleStatusClick = (estadoPublicacao: string) => {
        console.log("Status selecionado: ", estadoPublicacao);
        setSelecioneEstado(estadoPublicacao)
      }
  
      const filtrarLeitura = obrasData.filter((obra) => obra.estado === selecioneEstado);
    return (
        <>
            <Menu />
            <Pesquisar />
            <ModalPerfil />
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Seus Quadrinhos</h1>
                </div>
                <div className={style.listaContainer}>
                    <div className={style.lista}>
                        <div onClick={() => handleStatusClick('Publicando')} 
                        className={`${style.leitura} ${selecioneEstado === 'Publicando' ? style.selecionado : ''}`} 
                        ><p>Publicando</p></div>
                        <div onClick={() => handleStatusClick('Pausado')} 
                        className={`${style.leitura} ${selecioneEstado === 'Pausado' ? style.selecionado : ''}`}
                        ><p>Pausado</p></div>
                        <div onClick={() => handleStatusClick('Finalizado')} 
                        className={`${style.leitura} ${selecioneEstado === 'Finalizado' ? style.selecionado : ''}`}
                        ><p>Finalizado</p></div>
                        <div onClick={() => handleStatusClick('Cancelado')} 
                        className={`${style.leitura} ${selecioneEstado === 'Cancelado' ? style.selecionado : ''}`}
                        ><p>Cancelado</p></div>
                    </div>
                </div>
               
                <Link href="/criar-obra" legacyBehavior>
                  <div className={style.botaoContainer}>
                    <button type="submit" className={style.botao}>Criar Obra</button>
                    <div className={style.iconebotao}>
                      <FaPlus size={24} />
                    </div>
                  </div>
                </Link>
            </div>
        </>
    );
}

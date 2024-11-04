"use client"
import { FaArrowLeft } from "react-icons/fa";
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { Menu } from "@/components/Menu";
import { Cards } from "@/components/Cards";
import { useState } from "react";
import Pesquisar from "@/components/Pesquisar";
import { ModalPerfil } from "@/components/ModalPerfil";

export default function Lista() {

    const obrasData = [
        {
          id: 1,
          image: "https://mangadex.org/covers/e7eabe96-aa17-476f-b431-2497d5e9d060/69dea7d8-5bb2-4442-a907-f5095163f946.jpg",
          titulo: "Black Clover",
          status: "Dropei",
        },
        {
          id: 8,
          image: "https://mangadex.org/covers/c52b2ce3-7f95-469c-96b0-479524fb7a1a/a2091dbc-4171-41b1-b74a-40b70ae36eec.png",
          titulo: "Jujutsu Kaisen",
          status: "Lendo",
        },
        {
          id: 2,
          image: "https://mangadex.org/covers/fffbfac3-b7ad-41ee-9581-b4d90ecec941/b3276db6-f2fb-4b7e-96e8-2a093e82ccf2.jpg",
          titulo: "Grand Blue",
          status: "Vou Ler",
        },
        {
          id: 3,
          image: "https://mangadex.org/covers/801513ba-a712-498c-8f57-cae55b38cc92/618fec71-9b45-4cc9-a66d-fecfd78d43cd.jpg",
          titulo: "Berserk",
          status: "Vou Ler",
        },
        {
          id: 4,
          image: "https://mangadex.org/covers/e52d9403-3356-403b-b7bb-d7d6a420dd50/d2e604e1-d49a-4f48-89f9-6d8f3d4b912f.jpg",
          titulo: "Nanatsu no Taizai",
          status: "Lido",
        },
        {
          id: 5,
          image: 'https://mangadex.org/covers/296cbc31-af1a-4b5b-a34b-fee2b4cad542/ad60795c-b36f-46b8-8fd4-bff289fe9c4b.jpg.512.jpg',
          titulo: '[Oshi no Ko]',
          status: "Dropei",
        },
      ];

    const router = useRouter();
    const [selecioneStatus, setSelecioneStatus] = useState<string>("Lendo");

    const voltar = () => {
        router.back();
    }

    const handleStatusClick = (statusLeitura: string) => {
      console.log("Status selecionado: ", statusLeitura);
      setSelecioneStatus(statusLeitura)
    }

    const filtrarLeitura = obrasData.filter((obra) => obra.status === selecioneStatus);

    return(
        <>
            <Menu />
            <Pesquisar />
            <ModalPerfil />
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Lista de Leitura</h1>
                </div>
                <div className={style.listaContainer}>
                    <div className={style.lista}>
                        <div onClick={() => handleStatusClick('Lendo')} 
                        className={`${style.leitura} ${selecioneStatus === 'Lendo' ? style.selecionado : ''}`} 
                        ><p>Lendo</p></div>
                        <div onClick={() => handleStatusClick('Vou Ler')} 
                        className={`${style.leitura} ${selecioneStatus === 'Vou Ler' ? style.selecionado : ''}`}
                        ><p>Vou Ler</p></div>
                        <div onClick={() => handleStatusClick('Lido')} 
                        className={`${style.leitura} ${selecioneStatus === 'Lido' ? style.selecionado : ''}`}
                        ><p>Lido</p></div>
                        <div onClick={() => handleStatusClick('Dropei')} 
                        className={`${style.leitura} ${selecioneStatus === 'Dropei' ? style.selecionado : ''}`}
                        ><p>Dropei</p></div>
                    </div>
                </div>
                <Cards data={filtrarLeitura}/>
            </div>
        </>
    )
}
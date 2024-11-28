"use client"
import { Menu } from "@/components/Menu";
import { useRouter } from "next/navigation";
import style from './style.module.css';
import { FaArrowLeft } from "react-icons/fa";
import CardList from "@/components/CardList";
import Pesquisar from "@/components/Pesquisar";
import { ModalPerfil } from "@/components/ModalPerfil";

export default function Historico() {
    const obrasData = [
        {
          titulo: 'One Piece',
          capa: 'https://mangadex.org/covers/a1c7c817-4e59-43b7-9365-09675a149a6f/c4bdbbc6-f6c1-4fe9-ab28-ff9ab44b6694.png',
          capitulos: [
            { numero: '1123', titulo: ' As 2 semanas em branco' },
            { numero: '1122', titulo: 'O Momento Certo' },
            { numero: '1121', titulo: ' O fluxo constante das eras' },
          ],
        },
        {
          titulo: 'Mokushiroku no Yonkishi',
          capa: 'https://mangadex.org/covers/34019331-7377-4e2c-837e-f6e1ab2b5ef7/4340fc00-5f2c-45a6-942e-a47731aa670f.jpg.512.jpg',
          capitulos: [
            { numero: '128', titulo: ' O Dia em que Você Desapareceu' },
          ],
        },
        {
          titulo: 'Shuumatsu no Walküre',
          capa: 'https://mangadex.org/covers/b5b21ca1-bba5-4b9a-8cd1-6248f731650b/80929257-30e2-4651-8410-c7464a7f6deb.jpg.512.jpg',
          capitulos: [
            { numero: '91', titulo: 'Deus da Espada vs Demônio da Espada' },
            { numero: '90', titulo: ' Formas Variantes' },
          ],
        },
        {
          titulo: 'Berserk',
          capa: 'https://mangadex.org/covers/801513ba-a712-498c-8f57-cae55b38cc92/618fec71-9b45-4cc9-a66d-fecfd78d43cd.jpg',
          capitulos: [
            { numero: '3', titulo: 'Zodd, o Nosferatu (2)' },
            { numero: '2', titulo: 'Zodd, o Nosferatu (1)' },
            { numero: '1', titulo: 'Ventos da Espada' },
          ],
        },
    ];

    const router = useRouter();

    const voltar = () => {
        router.back();
    }

    return(
        <>
            <Menu />
            <Pesquisar />
            <ModalPerfil />
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Histórico</h1>
                </div>
                <br />
                
            </div>
        </>
    )
}
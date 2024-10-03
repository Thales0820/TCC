"use client"
import { Menu } from "@/components/Menu";
import { useRouter } from "next/navigation";
import style from './style.module.css';
import { FaArrowLeft } from "react-icons/fa";
import CardList from "@/components/CardList";

export default function Historico() {
    const obrasData = [
        {
          titulo: 'One Piece',
          image: 'https://mangadex.org/covers/a1c7c817-4e59-43b7-9365-09675a149a6f/c4bdbbc6-f6c1-4fe9-ab28-ff9ab44b6694.png',
          capitulos: [
            { numero: '1123', titulo: ' As 2 semanas em branco' },
            { numero: '1122', titulo: 'O Momento Certo' },
            { numero: '1121', titulo: ' O fluxo constante das eras' },
          ],
        },
        {
          titulo: 'Mokushiroku no Yonkishi',
          image: 'https://mangadex.org/covers/e52d9403-3356-403b-b7bb-d7d6a420dd50/d2e604e1-d49a-4f48-89f9-6d8f3d4b912f.jpg',
          capitulos: [
            { numero: '128', titulo: ' O Dia em que Você Desapareceu' },
          ],
        },
        {
          titulo: 'Shuumatsu no Walküre',
          image: 'https://mangadex.org/covers/c52b2ce3-7f95-469c-96b0-479524fb7a1a/a2091dbc-4171-41b1-b74a-40b70ae36eec.png',
          capitulos: [
            { numero: '91', titulo: 'Deus da Espada vs Demônio da Espada' },
            { numero: '90', titulo: ' Formas Variantes' },
          ],
        },
        {
          titulo: 'Berserk',
          image: 'https://mangadex.org/covers/801513ba-a712-498c-8f57-cae55b38cc92/618fec71-9b45-4cc9-a66d-fecfd78d43cd.jpg',
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
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Histórico</h1>
                </div>
                <br />
                <CardList data={obrasData}/>
            </div>
        </>
    )
}
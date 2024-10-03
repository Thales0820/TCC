"use client"
import { Menu } from "@/components/Menu";
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { CardList } from "@/components/CardList";

export default function Atualizacoes() {

    const obrasData = [
        {
          titulo: 'Black Clover',
          image: 'https://mangadex.org/covers/e7eabe96-aa17-476f-b431-2497d5e9d060/69dea7d8-5bb2-4442-a907-f5095163f946.jpg', // URL da imagem
          capitulos: [
            { numero: '373', titulo: 'Os Irmãos Silva' },
            { numero: '372', titulo: 'Fracassado' },
            { numero: '371', titulo: 'Almas Imortais' },
          ],
        },
        {
          titulo: 'Grand Blue',
          image: 'https://mangadex.org/covers/fffbfac3-b7ad-41ee-9581-b4d90ecec941/b3276db6-f2fb-4b7e-96e8-2a093e82ccf2.jpg',
          capitulos: [
            { numero: '95', titulo: 'A Noite é uma Criança' },
          ],
        },
        {
          titulo: 'Jujutsu Kaisen',
          image: 'https://mangadex.org/covers/c52b2ce3-7f95-469c-96b0-479524fb7a1a/a2091dbc-4171-41b1-b74a-40b70ae36eec.png',
          capitulos: [
            { numero: '267', titulo: 'Confronto desumado em Shinjuku! Parte 34' },
            { numero: '266', titulo: 'Confronto desumado em Shinjuku! Parte 33' },
          ],
        },
        {
          titulo: 'Berserk',
          image: 'https://mangadex.org/covers/801513ba-a712-498c-8f57-cae55b38cc92/618fec71-9b45-4cc9-a66d-fecfd78d43cd.jpg',
          capitulos: [
            { numero: '376', titulo: 'Superfície Trêmula do Mar, e Sombra da Guerra Calamitosa' },
            { numero: '375', titulo: 'O Alvorecer Surge Através da Névoa Inflexível da Noite' },
            { numero: '374', titulo: 'A Fera Negra Adormecida está Aguardando a sua Hora?' },
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
                    <h1>Atualizações</h1>
                </div>
                <br />
                <CardList data={obrasData}/>
            </div>
        </>
    )
}

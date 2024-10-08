"use client"
import { Menu } from "@/components/Menu";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import style from './style.module.css';
import { useState } from "react";
import { Cards } from "@/components/Cards";
import Pesquisar from "@/components/Pesquisar";

export default function Obras() {

    const obrasData = [
        {
            image: 'https://mangadex.org/covers/a1c7c817-4e59-43b7-9365-09675a149a6f/c4bdbbc6-f6c1-4fe9-ab28-ff9ab44b6694.png',
            titulo: 'One Piece',
        },
        {
            image: "https://a-static.mlcdn.com.br/450x450/poster-cartaz-batman-a-piada-mortal-pop-arte-poster/poparteskins2/15938544114/bb3e16085364ca48b024042f6dc1548e.jpeg",
            titulo: "Batman: A Piada Mortal",
        },
        {
            image: "https://mangadex.org/covers/32d76d19-8a05-4db0-9fc2-e0b0648fe9d0/95c6aa66-fab2-4388-be95-d7890dc0598a.jpg",
            titulo: "Solo Leveling",
        },
        {
            image: "https://media.fstatic.com/xTq6vfyhx_pfWVOkNWI-2DSGwSA=/322x478/smart/filters:format(webp)/media/movies/covers/2011/04/9a4c1509d7e0707a25e1b70e92adc285.jpg",
            titulo: "As Aventuras de Tintim",
        },
        {
            image: "https://mangadex.org/covers/4ada20eb-085a-491a-8c49-477ab42014d7/69098388-a967-464f-8178-344aa9bd4b31.jpg",
            titulo: "The Beginning After the End",
        },
        {
            image: "https://mangadex.org/covers/e7eabe96-aa17-476f-b431-2497d5e9d060/69dea7d8-5bb2-4442-a907-f5095163f946.jpg",
            titulo: "Black Clover",
        },
        {
            image: "https://mangadex.org/covers/c52b2ce3-7f95-469c-96b0-479524fb7a1a/a2091dbc-4171-41b1-b74a-40b70ae36eec.png",
            titulo: "Jujutsu Kaisen",
        },
        {
            image: "https://mangadex.org/covers/fffbfac3-b7ad-41ee-9581-b4d90ecec941/b3276db6-f2fb-4b7e-96e8-2a093e82ccf2.jpg",
            titulo: "Grand Blue",
        },
        {
            image: "https://mangadex.org/covers/801513ba-a712-498c-8f57-cae55b38cc92/618fec71-9b45-4cc9-a66d-fecfd78d43cd.jpg",
            titulo: "Berserk",
        },
        {
            image: "https://mangadex.org/covers/e52d9403-3356-403b-b7bb-d7d6a420dd50/d2e604e1-d49a-4f48-89f9-6d8f3d4b912f.jpg",
            titulo: "Nanatsu no Taizai",
        },
        {
            image: "https://lh3.googleusercontent.com/proxy/XtXyVbB3z1PijE1i9BA3Whz-PoBh2xy07-Y1aJik2BlMngUkUBtczD0b5tFROS25NvB26J098IrLK6H9tvciSLhvQNqhFD-kSUkGMX_DNn-NNsxlwBQ0t9HgJ32_DrJy-HOUV2jcUHXRDepcjQw",
            titulo: "O Espetacular Homem-Aranha",
        },
        {
            image: "https://m.media-amazon.com/images/I/818KGgapfiL._SL1500_.jpg",
            titulo: "A Garota do Mar",
        },
        {
            image: "https://mangadex.org/covers/aa6c76f7-5f5f-46b6-a800-911145f81b9b/2d50161f-e715-4e4f-86bd-d38772823b39.jpg",
            titulo: "Sono Bisque Doll wa Koi o Suru",
        },
        {
            image: "https://m.media-amazon.com/images/I/81+-f0EqFlL._SL1500_.jpg",
            titulo: "Charlie Brown e sua Turma",
        },
        {
            image: "https://m.media-amazon.com/images/I/814zhAWOKBL._AC_UF1000,1000_QL80_.jpg",
            titulo: "Persépolis",
        },
        {
            image: "https://m.media-amazon.com/images/I/81dQUROWcHL._AC_UF1000,1000_QL80_.jpg",
            titulo: "Adulthood Is a Myth",
        },
        {
            image: 'https://mangadex.org/covers/34019331-7377-4e2c-837e-f6e1ab2b5ef7/4340fc00-5f2c-45a6-942e-a47731aa670f.jpg.512.jpg',
            titulo: 'Mokushiroku no Yonkishi',
        },
        {
              image: 'https://mangadex.org/covers/b5b21ca1-bba5-4b9a-8cd1-6248f731650b/80929257-30e2-4651-8410-c7464a7f6deb.jpg.512.jpg',
              titulo: 'Shuumatsu no Walküre',
        },
        {
              image: 'https://mangadex.org/covers/a77742b1-befd-49a4-bff5-1ad4e6b0ef7b/76dbf6aa-fa1b-4244-ad2c-1f3b53ea3e9f.jpg',
              titulo: 'Chainsaw Man',
        },
        {
              image: 'https://mangadex.org/covers/f7888782-0727-49b0-95ec-a3530c70f83b/d944daa1-abb5-49e6-b05a-766de534bd36.jpg',
              titulo: 'Hajime no Ippo',
        },
        {
              image: 'https://i.pinimg.com/564x/38/ff/36/38ff3647a9230e58664c796861c42c04.jpg',
              titulo: 'Turma da Mônica',
        },
        {
              image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRUmWNRb7evc2tv-HLO4lxQQiTJQBs947KK6mx4J-e8F-7ygzCz',
              titulo: 'Injustice: Deuses entre Nós',
        },
        {
              image: 'https://mangadex.org/covers/296cbc31-af1a-4b5b-a34b-fee2b4cad542/ad60795c-b36f-46b8-8fd4-bff289fe9c4b.jpg.512.jpg',
              titulo: '[Oshi no Ko]',
        },
    ];

    const obrasOrdenadas = [...obrasData].sort((a, b) => a.titulo.localeCompare(b.titulo));

    const letras = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const [letraSelecionada, setLetraSelecionada] = useState('');
    const [obrasFiltradas, setObrasFiltradas] = useState(obrasOrdenadas);
    const router = useRouter();

    const handleLetraClick = (letra: string) => {
        if (letra === letraSelecionada) {
            // Se a letra clicada já estiver selecionada, desmarcar a seleção
            setLetraSelecionada("");
            setObrasFiltradas(obrasOrdenadas); // Exibe todas as obras novamente
        } else {
            setLetraSelecionada(letra);
            // Filtra as obras com base na letra selecionada
            if (letra === "#") {
                setObrasFiltradas(obrasOrdenadas.filter(obra => !/^[A-Za-z]/.test(obra.titulo)));
            } else {
                setObrasFiltradas(obrasOrdenadas.filter(obra => obra.titulo.startsWith(letra)));
            }
        }
    };

    const voltar = () => {  
        router.back();
    }

    return(
        <>
            <Menu />
            <Pesquisar />
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>Todos os Quadrinhos</h1>
                </div>
                <br />
                <div className={style.listaContainer}>
                    <div className={style.lista}>
                        {letras.map((letra, index) => (
                            <div key={index} onClick={() => handleLetraClick(letra)}
                            className={letra === letraSelecionada ? style.letraSelecionada : style.letra}>
                                <p>{letra}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <Cards data={obrasFiltradas}/>
            </div>
        </>
    )
}
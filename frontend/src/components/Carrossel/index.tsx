"use client"
import { useEffect, useState } from "react";
import style from "./style.module.css";

export const Carrossel = () => {
    const [proximo, setproximo] = useState(0);

    const carrosselImages = [
        "https://mangadex.org/covers/a1c7c817-4e59-43b7-9365-09675a149a6f/c4bdbbc6-f6c1-4fe9-ab28-ff9ab44b6694.png",
        "https://mangadex.org/covers/a77742b1-befd-49a4-bff5-1ad4e6b0ef7b/76dbf6aa-fa1b-4244-ad2c-1f3b53ea3e9f.jpg",
        "https://mangadex.org/covers/f7888782-0727-49b0-95ec-a3530c70f83b/d944daa1-abb5-49e6-b05a-766de534bd36.jpg",
        "https://i.pinimg.com/564x/38/ff/36/38ff3647a9230e58664c796861c42c04.jpg",
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRUmWNRb7evc2tv-HLO4lxQQiTJQBs947KK6mx4J-e8F-7ygzCz"
    ];

    const obrasInfo = [
        {
            titulo: "One Piece",
            sinopse: "One Piece conta a história do jovem Monkey D. Luffy, que ganhou poderes de borracha depois de comer uma fruta do diabo. O enredo mostra as aventuras de Luffy e seu grupo, Os Piratas de Chapéu de Palha, em busca do One Piece, o tesouro mais procurado do mundo.",
            autor: "Eiichiro Oda",
            generos: ["Aventura", "Ação", "Comédia", "Drama", "Fantasia"],
        },
        {
            titulo: "Chainsaw Man",
            sinopse: "Denji é um adolescente que mora com Pochita, o Demônio da Motosserra. Por conta das dívidas que herdou de seu pai, ele vive na miséria, exterminando outros demônios com Pochita para pagar as contas. Até que, um dia, Denji é traído e morre.",
            autor: "Tatsuki Fujimoto",
            generos: ["Ação", "Comédia", "Demônios", "Horror", "Sobrenatural"]
        },
        {
            titulo: "Hajime no Ippo",
            sinopse: "Ippo Makunouchi tem 16 anos, mas nunca faz coisas da sua idade. Seus dias consistem em ajudar sua mãe na loja de aluguel de barcos de pescaria e estudar. Certo dia, Ippo apanha de uns garotos que o cercam a caminho de casa, mas é salvo por um grande lutador de Boxe.",
            autor: "George Morikawa",
            generos: ["Ação", "Comédia", "Drama", "Esporte", "Psicológico"]
        },
        {
            titulo: "Turma da Mônica",
            sinopse: "Turma da Mônica é uma série de histórias em quadrinhos e uma franquia de mídia produzida pela Maurício de Sousa Produções, criada pelo cartunista e empresário Mauricio de Sousa.",
            autor: "Maurício de Sousa",
            generos: ["Comédia", "Fantasia", "Ficção Científica", "Paródia"]
        },
        {
            titulo: "Injustice: Deuses entre Nós",
            sinopse: "Ao decidir governar o mundo em vez de salvá-lo e começar a impor a paz no planeta por qualquer meio necessário, o Homem de Aço se torna uma ameaça para todos que não concordam com sua nova visão de mundo, inclusive o herói que um dia havia sido um dos seus maiores aliados e amigo: O Batman.",
            autor: "Tom Taylor",
            generos: ["Ação", "Fantasia", "Ficção Científica", "Drama", "Psicológico"]
        }
    ];

    // Avançar para o próximo item
    const handleNext = () => {
        setproximo((anterior) => (anterior + 1) % carrosselImages.length);
    }

    // Voltar para o item anterior
    const handlePrev = () => {
        setproximo((anterior) => (anterior - 1 + carrosselImages.length) % carrosselImages.length);
    };

    useEffect(() => {
        const intervalo = setInterval(() => {
            setproximo((anterior) =>  
                (anterior + 1) % carrosselImages.length);
        }, 10000);
    
        return () => clearInterval(intervalo);
    }, [carrosselImages.length]);
    return(
        <>
        <div className={style.carrossel}>
          <div className={style.images} 
          style={{ transform: `translateX(-${proximo * 100 / carrosselImages.length}%)`}}>
            {carrosselImages.map((image, index) =>(
                <img key={index} src={image} alt={`Image ${index + 1}`} />
            ))}
          </div>
          <div className={style.obra}>
            <img src={carrosselImages[proximo]} alt={'Capa'} />
            <div className={style.informacoes}>
              <h1>{obrasInfo[proximo].titulo}</h1>
              <div className={style.generos}>
                {obrasInfo[proximo].generos.map((genero, index) => (
                    <div key={index}>
                        <p>{genero}</p>
                    </div>
                ))}
            </div>
            <p className={style.sinopse}>
                <strong>{obrasInfo[proximo].sinopse}</strong>
            </p>
            <br />
            <p>
                <strong>{obrasInfo[proximo].autor}</strong>
            </p>
            </div>
          </div>
          <div className={style.navigationContainer}>
            <button className={style.prevButton} onClick={handlePrev}>
                <i className="bi bi-chevron-left"></i>
            </button>
                <div className={style.progressContainer}>
                    {carrosselImages.map((_, index) => (
                        <div
                            key={index}
                            className={`${style.progressBar} ${proximo === index ? style.active : ''}`}
                        ></div>
                    ))}
                </div>
            <button className={style.nextButton} onClick={handleNext}>
                <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
        </>
    )
}

export default Carrossel;
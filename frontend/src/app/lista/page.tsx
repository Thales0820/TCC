"use client"
import { FaArrowLeft } from "react-icons/fa";
import style from './style.module.css';
import { useRouter } from "next/navigation";
import { Menu } from "@/components/Menu";
import { Cards } from "@/components/Cards";
import { useEffect, useState } from "react";
import Pesquisar from "@/components/Pesquisar";
import { ModalPerfil } from "@/components/ModalPerfil";
import { getLeituras, getObrasLista } from "../api/routes";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: number;
}

export default function Lista() {
    const router = useRouter();
    const [selecioneLeitura, setSelecioneLeitura] = useState<string>("Lendo");
    const [obrasData, setObrasData] = useState<any[]>([]);
    const [leituras, setLeituras] = useState<{ id: number, tipo: string }[]>([]);
    const [usuarioId, setUsuarioId] = useState<number | null>(null);

    useEffect(() => {
      const cookies = parseCookies();
      const token = cookies["obra.token"];
      
      if (token) {
        try {
          const decodedToken: TokenPayload = jwtDecode<TokenPayload>(token);
          setUsuarioId(decodedToken.sub);
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
        }
      }
    }, []);

    useEffect(() => {
      if (usuarioId !== null) {
        const fetchObras = async () => {
          try {
            const obras = await getObrasLista(Number(usuarioId))
            const leiturasData = await getLeituras()
            setObrasData(obras)
            setLeituras(leiturasData)
          } catch (error) {
            console.error("Erro ao buscar obras: ", error)
          }
        }
        fetchObras()
      }
    }, [usuarioId])

    const voltar = () => {
        router.back();
    }

    const handleLeituraClick = (leitura: string) => {
      setSelecioneLeitura(leitura)
    }

    const filtrarLeitura = obrasData.filter((obra) => obra.leitura === selecioneLeitura);

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
                  <div className={style.listagem}>
                    <div className={style.lista}>
                          {leituras.map((leitura) => (
                              <div key={leitura.id} onClick={() => handleLeituraClick(leitura.tipo)}
                                  className={`${style.leitura} ${selecioneLeitura === leitura.tipo ? style.selecionado : ''}`}>
                                  <p>{leitura.tipo}</p>
                              </div>
                          ))}
                      </div>
                  </div>
                </div>
                <Cards data={filtrarLeitura}/>
            </div>
        </>
    )
}
import { SlOptionsVertical } from "react-icons/sl";
import style from "./style.module.css";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { adicionarComentario, getComentariosPorObra } from "@/app/api/routes";
import { IoSend } from "react-icons/io5";
import axios from "axios";

interface ComentariosProps {
    obraId: number;
    userId: number | null; // O userId pode ser null caso o usuário não esteja logado.
}

interface Comentario {
    id: number;
    texto: string;
    usuario: {
        nome: string;
    };
    obra_id: number;
}

export const Comentarios: React.FC<ComentariosProps> = ({ obraId, userId }) => {
    const [novoComentario, setNovoComentario] = useState("")
    const [comentarios, setComentarios] = useState<Comentario[]>([])

    useEffect(() => {
        const fetchComentarios = async () => {
            const comentarios = await getComentariosPorObra(obraId);
            setComentarios(comentarios);
        };
    
        fetchComentarios();
    }, [obraId]);

    const enviarComentario = async () => {
        if (userId) {
            try {
                await adicionarComentario(userId, obraId, novoComentario);
                setNovoComentario("");
                const comentariosAtualizados = await getComentariosPorObra(obraId);
                setComentarios(comentariosAtualizados);
            } catch (error) {
                console.error("Erro ao enviar comentário:", error);
            }
        } else {
            alert("Você precisa estar logado para comentar.");
        }
    };

    console.log({ userId, obraId, texto: novoComentario });

    return(
        <>
            <div className={style.comentarios}>
                <h1>Comentários:</h1>
                <div className={style.novoComentario}>
                    <FaUser className={style.iconeUsuario} size={35}/>
                    <input type="text" placeholder="Faça seu Comentário" value={novoComentario} 
                        onChange={(e) => setNovoComentario(e.target.value)}/>
                    <IoSend onClick={enviarComentario} title={"Enviar Comentário"} size={25} 
                            className={style.enviar}/>
                </div>
                {comentarios.map((comentario) => (
                    <div key={comentario.id} className={style.comentario}>
                        <div className={style.iconeUsuarioComentario}>
                            <FaUser className={style.iconeUsuario} size={35} title={"Opções"}/>
                        </div>
                        <div className={style.conteudoComentario}>
                            <div className={style.usuario}>{comentario.usuario?.nome || "Desconhecido"}</div>
                            <div className={style.texto}>{comentario.texto}</div>
                        </div>
                        <div className={style.opcao}>
                            <SlOptionsVertical size={25}/>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
export default Comentarios
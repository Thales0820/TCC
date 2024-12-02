import { SlOptionsVertical } from "react-icons/sl";
import style from "./style.module.css";
import { FaRegEdit, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { adicionarComentario, getComentariosPorObra } from "@/app/api/routes";
import { IoSend, IoTrashSharp } from "react-icons/io5";
import axios from "axios";

interface ComentariosProps {
    obraId: number;
    userId: number | null; // O userId pode ser null caso o usuário não esteja logado.
}

interface Comentario {
    id: number;
    texto: string;
    usuario: {
        id: number;
        nome: string;
    };
    obra_id: number;
}

export const Comentarios: React.FC<ComentariosProps> = ({ obraId, userId }) => {
    const [novoComentario, setNovoComentario] = useState("")
    const [comentarios, setComentarios] = useState<Comentario[]>([])
    const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);
    const [emEdicao, setEmEdicao] = useState<number | null>(null);
    const [textoEditado, setTextoEditado] = useState<string>("");

    useEffect(() => {
        const fecharDropdown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
    
            // Verifique se o clique foi fora do menu e do ícone de opções
            if (!target.closest(`.${style.opcao}`) && !target.closest(`.${style.dropdown}`)) {
                setDropdownAberto(null);
            }
        };
    
        // Adiciona o evento de clique ao documento
        document.addEventListener("mousedown", fecharDropdown);
    
        return () => {
            // Remove o evento ao desmontar o componente
            document.removeEventListener("mousedown", fecharDropdown);
        };
    }, []);

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

    const ajustarAltura = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement; // Cast explícito
        e.target.style.height = "28px"; // Reseta a altura para calcular novamente
        e.target.style.height = `${e.target.scrollHeight}px`; // Ajusta para o conteúdo
    };    

    const alternarDropdown = (comentarioId: number) => {
        setDropdownAberto((prev) => (prev === comentarioId ? null : comentarioId));
    };

    const iniciarEdicao = (comentarioId: number, textoAtual: string) => {
        setEmEdicao(comentarioId);
        setTextoEditado(textoAtual);
    };
    
    const salvarEdicao = async (comentarioId: number) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/v1/comentarios/${comentarioId}`, { 
                texto: textoEditado,
                usuario_id: userId,
                obra_id: obraId 
            });
            setComentarios((prev) =>
                prev.map((comentario) =>
                    comentario.id === comentarioId ? { ...comentario, texto: textoEditado } : comentario
                )
            );
            setEmEdicao(null);
        } catch (error) {
            console.error("Erro ao salvar o comentário editado:", error);
        }
    };
    
    const cancelarEdicao = () => {
        setEmEdicao(null);
    };

    const excluirComentario = async (comentarioId: number) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/comentarios/${comentarioId}`);
            setComentarios((prev) => prev.filter((comentario) => comentario.id !== comentarioId));
            console.log(`Comentário ${comentarioId} excluído com sucesso!`);
        } catch (error) {
            console.error("Erro ao excluir o comentário:", error);
        }
    };

    return(
        <>
            <div className={style.comentarios}>
                <h1>Comentários:</h1>
                <div className={style.novoComentario}>
                    <FaUser className={style.iconeUsuario} />
                        <textarea placeholder="Faça seu Comentário" value={novoComentario} 
                        onChange={(e) => { setNovoComentario(e.target.value); ajustarAltura(e);}}/>
                    <IoSend onClick={enviarComentario} title={"Enviar Comentário"} className={style.enviar}/>
                </div>
                {comentarios.map((comentario) => (
                    <div key={comentario.id} className={style.comentario}>
                        <div className={style.iconeUsuarioComentario}>
                            <FaUser className={style.iconeUsuario} />
                        </div>
                        <div className={style.conteudoComentario}>
                            <div className={style.usuario}>{comentario.usuario?.nome || "Desconhecido"}</div>
                            <div className={style.texto}>
                                {emEdicao === comentario.id ? (
                                    <div>
                                        <textarea
                                            value={textoEditado}
                                            onChange={(e) => {setTextoEditado(e.target.value); ajustarAltura(e);}}
                                            className={style.inputEdicao}
                                        />
                                        <button className={style.buttonSalvar} onClick={() => salvarEdicao(comentario.id)}>Salvar</button>
                                        <button className={style.buttonCancelar} onClick={cancelarEdicao}>Cancelar</button>
                                    </div>
                                ) : (
                                    comentario.texto
                                )}
                            </div>
                        </div>
                        {comentario.usuario?.id === userId && (
                            <div className={style.opcao}>
                                <SlOptionsVertical size={25} title={"Opções"} 
                                    onClick={() => alternarDropdown(comentario.id)} />
                                {dropdownAberto === comentario.id && (
                                    <ul className={style.dropdown}>
                                        <li onClick={() => {iniciarEdicao(comentario.id, comentario.texto)
                                        setDropdownAberto(null)}} title="Editar">Editar <FaRegEdit /></li>
                                        <li title="Excluir" onClick={() => excluirComentario(comentario.id)}>Excluir <IoTrashSharp /></li>
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}
export default Comentarios
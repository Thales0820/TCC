import { BiSolidLike } from "react-icons/bi"
import style from "./style.module.css";
import { FaUser } from "react-icons/fa";

export const Comentarios = () => {
    return(
        <>
            <div className={style.comentarios}>
                <h1>Comentários:</h1>
                <div className={style.novoComentario}>
                    <FaUser className={style.iconeUsuario} size={35}/>
                    <input type="text" placeholder="Faça seu Comentário"/>
                </div>
                <div className={style.comentario}>
                    <div className={style.iconeUsuarioComentario}>
                        <FaUser className={style.iconeUsuario} size={35}/>
                    </div>
                    <div className={style.conteudoComentario}>
                        <div className={style.usuario}>Nome do Usuário</div>
                        <div className={style.texto}>
                            A arte desse quadrinho é muito bonita
                        </div>
                    </div>
                    <div className={style.like}>
                        <BiSolidLike size={25}/>
                    </div>
                </div>
                <div className={style.comentario}>
                    <div className={style.iconeUsuarioComentario}>
                        <FaUser className={style.iconeUsuario} size={35}/>
                    </div>
                    <div className={style.conteudoComentario}>
                        <div className={style.usuario}>Nome do Usuário</div>
                        <div className={style.texto}>
                            Os Arcos são muito profundos e tivemos a origem de tudo. Já o famoso arco da guerra não tem conversa foi absolutamente um show, perdas, consequências e espero que a obra só melhore
                        </div>
                    </div>
                    <div className={style.like}>
                        <BiSolidLike size={25}/>
                    </div>
                </div>
                <div className={style.comentario}>
                    <div className={style.iconeUsuarioComentario}>
                        <FaUser className={style.iconeUsuario} size={35}/>
                    </div>
                    <div className={style.conteudoComentario}>
                        <div className={style.usuario}>Nome do Usuário</div>
                        <div className={style.texto}>
                            A comédia continua legal e me surpreende em vários momentos, mas o problema que ainda continua, é os momentos que tentam ser sérios
                        </div>
                    </div>
                    <div className={style.like}>
                        <BiSolidLike size={25}/>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Comentarios
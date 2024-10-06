"use client"
import Link from 'next/link';
import style from './style.module.css';
import { useState } from 'react';

export default function Cadastro() {
    const [tipoUsuario, setTipoUsuario] = useState("");

    return(
        <>
            <div className={style.loginContainer}>
                <div className={style.logo}>
                    <img src="/images/logoDark.png" alt="Logo" />
                </div>
                <div className={style.content}>
                    <div className={style.imageSection}>
                        <img src="/images/Login.png" alt="Sobre" />
                    </div>
                    <div className={style.loginForm}>
                        <h2>Cadastro</h2>
                        <form>
                            <label htmlFor="nome">Nome</label>
                            <input type="text" id="nome" placeholder="Digite seu nome de Usúario" required/>
                            <label htmlFor="email">E_mail</label>
                            <input type="email" id="email" placeholder="exemplo@gmail.com" required/>
                            <label htmlFor="password">Senha</label>
                            <input type="password" id="password" placeholder="Digite sua Senha" required/>
                            <div className={style.rememberMe}>
                                <input type="checkbox" id="leitor" checked={tipoUsuario === "leitor"} 
                                onChange={() => setTipoUsuario("leitor")}/>
                                <label htmlFor="leitor">Leitor</label>
                                <input type="checkbox" id="autor" checked={tipoUsuario === "autor"} 
                                onChange={() => setTipoUsuario("autor")}/>
                                <label htmlFor="autor">Autor</label>
                            </div>
                            <Link href={"/login"} legacyBehavior>
                                <button type="submit">Cadastrar</button>
                            </Link>
                        </form>
                        <Link href={"/login"} legacyBehavior>
                            <a className={style.cadastro}>Já tem Conta? Faça Login</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import style from './style.module.css';
import { IoEyeOff, IoEye } from 'react-icons/io5';
//import { Toast } from '@/components/Toast';
//import { Loading } from '@/components/Loading';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const router = useRouter();

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha); // Alterna entre true e false
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita a recarga da página
        setErrorMessage(''); // Limpa mensagens de erro anteriores
        setLoading(true); // Ativa o estado de carregamento
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                
                // Armazena o token no cookie usando nookies
                setCookie(undefined, 'authToken', data.token, { path: '/' });
                
                // Redireciona para a página inicial
                router.push('/home');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'Erro no login. Tente novamente.');
                setToast(true); // Mostra toast de erro
            }
        } catch (error) {
            console.error('Erro ao fazer a solicitação:', error);
            setErrorMessage('Erro de conexão. Tente novamente mais tarde.');
            setToast(true); // Mostra toast de erro
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };
    return (
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
                        <h2>Login</h2>
                        {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="exemplo@gmail.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                            
                            <label htmlFor="password">Senha</label>
                            <div className={style.inputSenhaContainer}>
                                <input 
                                    type={mostrarSenha ? "text" : "password"} 
                                    id="password" 
                                    placeholder="Digite sua Senha" 
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required 
                                />
                                <span onClick={toggleMostrarSenha} className={style.iconeSenha}>
                                    {mostrarSenha ? <IoEyeOff size={20}/> : <IoEye size={20}/>}
                                </span>
                            </div>
                            <div className={style.rememberMe}>
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Lembre-se</label>
                            </div>
                            
                            <button type="submit">Entrar</button>
                        </form>
                        <Link href="/cadastro" legacyBehavior>
                            <a className={style.cadastro}>Não tem Conta? Cadastre-se</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
function setCookie(undefined: undefined, arg1: string, token: any, arg3: { path: string; }) {
    throw new Error('Function not implemented.');
}
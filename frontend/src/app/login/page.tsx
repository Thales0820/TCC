"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import style from './style.module.css';
import { IoEyeOff, IoEye } from 'react-icons/io5';
import axios from 'axios';
import { setCookie } from 'nookies';
import { Loading } from '@/components/Loading';
import { Toast } from '@/components/Toast';
import { useTheme } from '@/hooks/useTheme';
import { getUserIdFromToken } from '@/utils/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const router = useRouter();
    const { theme } = useTheme()

    const logoSrc = theme === "dark"
        ? "/images/logoDark.png"
        : "/images/logoLight.png";

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };
    // //metodo para ativar a conta
    // const handleAccountActivation = async () => {
    //     if (confirm("Tem certeza que deseja ativar sua conta novamente?")) {
    //         try {
    //             const userId = getUserIdFromToken();
    //             await axios.put(`http://127.0.0.1:8000/api/v1/users/${userId}/activate`);
    //             alert("Conta ativada com sucesso.");
    //             router.push("/dashboard"); // Redireciona para o painel ou página inicial
    //         } catch (error) {
    //             console.error("Erro ao ativar a conta:", error);
    //             alert("Ocorreu um erro ao tentar ativar a conta.");
    //         }
    //     }
    // };
    // //      

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/usuario/login', {
                email,
                senha,
            });

            // Verifica se o token está presente na resposta
            if (response.data && response.data.token) {
                // Armazena o token no cookie
                setCookie(undefined, 'obra.token', response.data.token, { path: '/' });
                console.log('Token recebido:', response.data.token); // Log do token
                router.push('/home'); // Redireciona para a página Home
            } else {
                setErrorMessage('Erro no login. Tente novamente.');
                setToast(true);
            }
        } catch (error) {
            console.error('Erro ao fazer a solicitação:', error);
            setErrorMessage('Senha ou Email Inválidos!.');
            setToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Loading loading={loading} />
            <Toast
                show={toast}
                message={errorMessage || 'Dados Inválidos'}
                colors='danger'
                onClose={() => { setToast(false); setErrorMessage(''); }}
            />
            <div className={style.loginContainer}>
                <div className={style.logo}>
                    <img src={logoSrc} alt="Logo" title="Indie Comics" key={logoSrc} />
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
                                    {mostrarSenha ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                                </span>
                            </div>
                            <Link href="http://127.0.0.1:8000/forgot-password" legacyBehavior>
                                <a className={style.resgate}>Esqueceu sua senha?</a>
                            </Link>
                            <button type="submit">Entrar</button>
                        </form>
                        {/* <button onClick={handleAccountActivation} className="btn btn-activate">
                            Ativar Conta
                        </button> */}
                        <Link href="/home" legacyBehavior>
                            <a className={style.link}>Acesse nossa página!</a>
                        </Link>
                        <Link href="/cadastro" legacyBehavior>
                            <a className={style.link}>Não tem Conta? Cadastre-se</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

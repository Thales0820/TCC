"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import style from './style.module.css'; // Importar os estilos
import { IoEye, IoEyeOff } from 'react-icons/io5';

const UpdateSenha = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmaSenha, setMostrarConfirmarSenha] = useState(false);
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    const toggleMostrarConfirmarSenha = () => {
        setMostrarConfirmarSenha(!mostrarConfirmaSenha);
    };

    useEffect(() => {
        if (!token || !email) {
            router.push('/');
        }
    }, [token, email, router]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/v1/usuarios/resetar-senha`, {
                token,
                email,
                nova_senha: senha,
                nova_senha_confirmation: confirmarSenha
            });

            setMessage('Senha alterada com sucesso'); // Mensagem de sucesso
            setError('');
            // Redirecionar após sucesso
            setTimeout(() => {
                router.push('/');
            }, 2000); // Espera 2 segundos antes de redirecionar
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || 'Erro ao atualizar a senha');
            } else {
                setError('Erro desconhecido');
            }
            setMessage('');
        }
    };

    return (
        <div className={style.container}>
            <div className={style.logo}>
                <img src="/images/logoDark.png" alt="Logo" />
            </div>
            <div className={style.loginForm}>
                <h2>Atualizar Senha</h2>
                <form onSubmit={handleSubmit}>
                    <div className={style.inputSenhaContainer}>
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="Digite sua nova senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                        <span onClick={toggleMostrarSenha} className={style.iconeSenha}>
                            {mostrarSenha ? <IoEyeOff size={20}/> : <IoEye size={20}/>}
                        </span>
                    </div>
                    <div className={style.inputSenhaContainer}>
                        <input
                            type={mostrarConfirmaSenha ? "text" : "password"}
                            placeholder="Confirme sua nova senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                        />
                        <span onClick={toggleMostrarConfirmarSenha} className={style.iconeSenha}>
                            {mostrarConfirmaSenha ? <IoEyeOff size={20}/> : <IoEye size={20}/>}
                        </span>
                    </div>
                    <button type="submit" className={style.button}>
                        Atualizar
                    </button>
                </form>
            </div>
            {message && <p className={style.message}>{message}</p>}
            {error && <p className={style.error}>{error}</p>}
        </div>
    );
};

export default UpdateSenha;

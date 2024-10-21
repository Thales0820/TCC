"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import styles from './style.module.css'; // Importar os estilos

const UpdateSenha = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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
        <div className={styles.container}>
            <h2>Atualizar Senha</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Digite sua nova senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Confirme sua nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>
                    Atualizar Senha
                </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default UpdateSenha;

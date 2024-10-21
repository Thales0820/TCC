"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './style.module.css'; // Importar os estilos

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/usuario/verificar-email', { email });
            setMessage('Link de recuperação enviado com sucesso. Verifique seu e-mail.');
            setError('');

            // Redirecionar para a página de atualização de senha, passando o token e o e-mail
            setTimeout(() => {
                router.push(`/updateSenha?token=${response.data.token}&email=${email}`);
            }, 2000); // Espera 2 segundos antes de redirecionar
        } catch (err) {
            setError('Erro ao verificar o e-mail. Verifique se o e-mail está correto.');
            setMessage('');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Recuperação de Senha</h2>
            <form onSubmit={handlePasswordReset}>
                <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>
                    Enviar Link de Recuperação
                </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default PasswordReset;

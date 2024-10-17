"use client"
import { useState } from 'react';

const RecoverPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:8000/api/password/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            setMessage('Um link de recuperação de senha foi enviado para seu e-mail.');
        } else {
            setMessage('Ocorreu um erro. Verifique seu e-mail.');
        }
    };

    return (
        <div>
            <h1>Recuperar Senha</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail"
                    required
                />
                <button type="submit">Enviar Link de Recuperação</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RecoverPassword;

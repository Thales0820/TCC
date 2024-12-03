"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserIdFromToken } from "@/utils/auth";
import axios from "axios";
import styles from './style.module.css'; // Importe o CSS

// Definindo a interface para o usuário
interface User {
    nome: string;
    email: string;
    // Adicione outros campos conforme necessário
}

const UserSettings = () => {
    const router = useRouter();
    const [userData, setUserData] = useState<User | null>(null);  // Armazena os dados do usuário com o tipo definido
    const [loading, setLoading] = useState(true);    // Controle de carregamento

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/"); // Redireciona para a home se não autenticado
            return;
        }

        const userIdFromToken = getUserIdFromToken();
        if (!userIdFromToken) {
            alert("Token inválido ou expirado.");
            router.push("/"); // Redireciona para a home se o token for inválido
            return;
        }

        // Função para buscar os dados do usuário
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/usuarios/${userIdFromToken}`);
                setUserData(response.data);  // Definindo os dados no estado
            } catch (error) {
                console.error("Erro ao buscar os dados do usuário:", error);
                alert("Ocorreu um erro ao carregar os dados do usuário.");
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };

        fetchUserData();
    }, [router]);

    const handleAccountDeletion = async () => {
        if (confirm("Tem certeza que deseja excluir sua conta? Essa ação é irreversível.")) {
            try {
                const userId = getUserIdFromToken();
                await axios.put(`http://127.0.0.1:8000/api/v1/users/${userId}/disable`);
                alert("Conta excluída com sucesso.");
                router.push("/home"); // Redireciona após excluir a conta
            } catch (error) {
                console.error("Erro ao excluir a conta:", error);
                alert("Ocorreu um erro ao tentar excluir a conta.");
            }
        }
    };

    const handleAccountDisable = async () => {
        if (confirm("Tem certeza que deseja desativar sua conta? Você pode reativá-la a qualquer momento.")) {
            try {
                const userId = getUserIdFromToken();
                await axios.put(`http://127.0.0.1:8000/api/v1/users/${userId}/disable`);
                alert("Conta desativada com sucesso.");
                router.push("/home"); // Redireciona após desativar a conta
            } catch (error) {
                console.error("Erro ao desativar a conta:", error);
                alert("Ocorreu um erro ao tentar desativar a conta.");
            }
        }
    };

    return (
        <div className={styles['settings-container']}>
            {loading ? (
                <p>Carregando dados do usuário...</p> // Mensagem de carregamento
            ) : (
                <>
                    <h1 className={styles['title']}>Configurações da Conta</h1>
                    <div className={styles['user-info']}>
                        <p><strong>Nome:</strong> {userData?.nome}</p>
                        <p><strong>Email:</strong> {userData?.email}</p>
                    </div>
                    <button onClick={handleAccountDisable} className={`${styles.button} ${styles['btn-disable']}`}>
                        Desativar Conta
                    </button>
                    <button onClick={handleAccountDeletion} className={`${styles.button} ${styles['btn-delete']}`}>
                        Excluir Conta
                    </button>
                </>
            )}
        </div>
    );
};

export default UserSettings;

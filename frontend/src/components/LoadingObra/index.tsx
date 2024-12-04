"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./style.module.css"; // Certifique-se de adicionar estilos para o loader e a mensagem

interface LoadingRedirectProps {
    isLoading: boolean;
    message?: string;
    delay?: number; // Tempo em milissegundos antes de redirecionar
}

const LoadingRedirect: React.FC<LoadingRedirectProps> = ({
    isLoading,
    message = "Obra criada com sucesso!",
    delay = 2000,
}) => {
    const [showMessage, setShowMessage] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                router.push("http://localhost:3000/minhas-obras"); // URL fixa
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [isLoading, delay, router]);

    return (
        <div className={style.loadingContainer}>
            {isLoading ? (
                <div className={style.loader}></div>
            ) : showMessage ? (
                <p className={style.successMessage}>{message}</p>
            ) : null}
        </div>
    );
};

export default LoadingRedirect;

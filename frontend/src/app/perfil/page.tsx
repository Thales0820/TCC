"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getUserIdFromToken } from "@/utils/auth"; // Função para obter o ID do usuário autenticado
import { useRouter } from "next/navigation"; // Navegação com Next.js
import styles from "./style.module.css";

interface Perfil {
  id: number;
  tipo: string;
}

interface Usuario {
  id: string;
  nome: string;
  foto_perfil: string | null;
  email: string;
  banner: string | null;
  perfil: Perfil;
}

const BASE_URL = "http://127.0.0.1:8000";

const PerfilPage = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Função auxiliar para construir URLs de imagem
  const getImageUrl = (path: string | null, defaultImage: string, prefix: string) => {
    if (!path) return `${BASE_URL}/storage/images/${defaultImage}`;
    return path.startsWith(prefix)
      ? `${BASE_URL}/${path.replace(/^\/+/, "")}`
      : `${BASE_URL}/storage/${path.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const userId = getUserIdFromToken();

        if (!userId) {
          throw new Error("Usuário não autenticado");
        }

        const response = await axios.get(`${BASE_URL}/api/v1/usuarios/${userId}`);
        setUsuario(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setError("Erro ao carregar perfil. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (error || !usuario) {
    return <div className={styles.error}>{error || "Erro ao carregar perfil."}</div>;
  }

  const bannerUrl = getImageUrl(usuario.banner, "default-banner.jpg", "imageBanner");
  const fotoPerfilUrl = getImageUrl(usuario.foto_perfil, "default-profile.jpg", "imagesUser");

  return (
    <div className={styles.container}>
      {/* Banner */}
      <div
        className={styles.banner}
        style={{
          backgroundImage: `url(${bannerUrl})`,
        }}
      ></div>

      {/* Informações do Perfil */}
      <div className={styles.profileInfo}>
        {/* Foto de Perfil */}
        <div className={styles.profileImageContainer}>
          <img
            src={fotoPerfilUrl}
            alt={`Foto de ${usuario.nome}`}
            className={styles.profileImage}
          />
        </div>

        {/* Detalhes do Usuário */}
        <div className={styles.userDetails}>
          <p className={styles.userName}>{usuario.nome}</p>
          <p className={styles.profession}>{usuario.perfil.tipo}</p>
          <p className={styles.email}>Email: {usuario.email}</p>
        </div>
      </div>

      {/* Botão para editar o perfil */}
      <button
        className={styles.editButton}
        onClick={() => router.push(`/editar/${usuario.id}`)}
      >
        Editar Perfil
      </button>
    </div>
  );
};

export default PerfilPage;

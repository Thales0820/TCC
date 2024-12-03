"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import { isAuthenticated, getUserIdFromToken } from "@/utils/auth";

interface Usuario {
    nome: string;
    email: string;
    foto_perfil: string;
    banner: string;
    senha: string;
    perfil_id: string;
}

const EditarUsuario = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const { id } = params;

    const [usuario, setUsuario] = useState<Usuario>({
        nome: "",
        email: "",
        foto_perfil: "",
        banner: "",
        senha: "",
        perfil_id: "",
    });
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [fotoPerfilPreview, setFotoPerfilPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }

        const verifyOwnership = async () => {
            const loggedUserId = getUserIdFromToken();
            if (!loggedUserId || loggedUserId !== id) {
                setIsOwner(false);
            } else {
                setIsOwner(true);
            }
        };

        const fetchData = async () => {
            try {
                const usuarioResponse = await axios.get(`http://127.0.0.1:8000/api/v1/usuarios/${id}`);
                setUsuario(usuarioResponse.data);
                setFotoPerfilPreview(usuarioResponse.data.foto_perfil);
                setBannerPreview(usuarioResponse.data.banner);
            } catch (error) {
                console.error("Erro ao carregar os dados:", error);
                alert("Erro ao carregar os dados.");
            } finally {
                setLoading(false);
            }
        };

        verifyOwnership();
        fetchData();
    }, [id, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUsuario((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            if (name === "foto_perfil") {
                setFotoPerfilFile(file);
                setFotoPerfilPreview(URL.createObjectURL(file));
            }
            if (name === "banner") {
                setBannerFile(file);
                setBannerPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("nome", usuario.nome);

        if (fotoPerfilFile) formData.append("foto_perfil", fotoPerfilFile);
        if (bannerFile) formData.append("banner", bannerFile);

        try {
            await axios.post(`http://127.0.0.1:8000/api/v1/usuarios/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Usuário atualizado com sucesso!");
            router.push("/perfil");
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            alert("Erro ao atualizar os dados.");
        }
    };

    if (loading) return <p className={styles.loading}>Carregando...</p>;

    if (isOwner === false) {
        return (
            <div className={styles.notOwnerContainer}>
                <p className={styles.errorMessage}>
                    Você não tem permissão para editar este perfil.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className={styles.homeButton}
                >
                    Voltar para Home
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Editar Usuário</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nome:</label>
                    <input
                        type="text"
                        name="nome"
                        value={usuario.nome}
                        onChange={handleInputChange}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Foto de Perfil:</label>
                    <input
                        type="file"
                        name="foto_perfil"
                        onChange={handleFileChange}
                        accept="image/*"
                        className={styles.fileInput}
                    />
                    {fotoPerfilPreview && (
                        <img
                            src={fotoPerfilPreview}
                            alt="Foto de Perfil"
                            className={styles.previewImage}
                        />
                    )}
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Banner:</label>
                    <input
                        type="file"
                        name="banner"
                        onChange={handleFileChange}
                        accept="image/*"
                        className={styles.fileInput}
                    />
                    {bannerPreview && (
                        <img
                            src={bannerPreview}
                            alt="Banner"
                            className={styles.previewBanner}
                        />
                    )}
                </div>
                <button type="submit" className={styles.submitButton}>
                    Salvar
                </button>
            </form>
        </div>
    );
};

export default EditarUsuario;

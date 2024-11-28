"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";

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
    const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [fotoPerfilPreview, setFotoPerfilPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usuarioResponse = await axios.get(`http://127.0.0.1:8000/api/v1/usuarios/${id}`);
                setUsuario(usuarioResponse.data);
                setFotoPerfilPreview(usuarioResponse.data.foto_perfil); // Mostra a foto de perfil existente
                setBannerPreview(usuarioResponse.data.banner); // Mostra o banner existente
            } catch (error) {
                console.error("Erro ao carregar os dados:", error);
                alert("Erro ao carregar os dados.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

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
                setFotoPerfilPreview(URL.createObjectURL(file)); // Atualiza a pré-visualização
            }
            if (name === "banner") {
                setBannerFile(file);
                setBannerPreview(URL.createObjectURL(file)); // Atualiza a pré-visualização
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
                    {fotoPerfilPreview && (
                        <img
                            src={fotoPerfilPreview}
                            alt="Foto de Perfil"
                            className={styles.previewImage}
                        />
                    )}
                    <input
                        type="file"
                        name="foto_perfil"
                        onChange={handleFileChange}
                        accept="image/*"
                        className={styles.fileInput}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Banner:</label>
                    {bannerPreview && (
                        <img
                            src={bannerPreview}
                            alt="Banner"
                            className={styles.previewImage}
                        />
                    )}
                    <input
                        type="file"
                        name="banner"
                        onChange={handleFileChange}
                        accept="image/*"
                        className={styles.fileInput}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Salvar
                </button>
            </form>
        </div>
    );
};

export default EditarUsuario;

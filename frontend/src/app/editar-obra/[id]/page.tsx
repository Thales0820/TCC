"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { getUserIdFromToken, isAuthenticated } from "@/utils/auth";
import style from "./style.module.css";
import Cookies from "js-cookie";

interface Tipo {
    id: number;
    nome: string;
}

interface Estado {
    id: number;
    nome: string;
}

interface ObraInfo {
    id: string;
    titulo: string;
    sinopse: string;
    capa: string | null;
    tipo: Tipo;
    estado: Estado;
    usuario: {
        autor_id: string;
        nome: string;
        foto_perfil: string;
    };
}

export default function EditarObra({ params }: { params: { id: string } }) {
    const [obra, setObra] = useState<ObraInfo | null>(null);
    const [tipos, setTipos] = useState<Tipo[]>([]);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [capa, setCapa] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const cookies = parseCookies();
                const token = cookies["obra.token"];

                const obraRes = await axios.get(`http://127.0.0.1:8000/api/v1/obras/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const obraData = obraRes.data;

                if (obraData.usuario.autor_id.toString() !== userId.toString()) {
                    alert("Você não tem permissão para acessar esta obra.");
                    router.push("/");
                    return;
                }

                const [tiposRes, estadosRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/v1/tipos", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://127.0.0.1:8000/api/v1/estados", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setObra(obraData);
                setTipos(tiposRes.data);
                setEstados(estadosRes.data);
            } catch (error: any) {
                console.error("Erro ao carregar dados:", error.message || error);
                alert("Erro ao carregar os dados. Tente novamente.");
                router.push("/");
            }
        };

        fetchData();
    }, [params.id, router]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        if (!obra) return;

        const { name, value } = e.target;

        setObra((prev) => {
            if (!prev) return null;
            if (name === "tipo") {
                return { ...prev, tipo: { ...prev.tipo, id: Number(value) } };
            } else if (name === "estado") {
                return { ...prev, estado: { ...prev.estado, id: Number(value) } };
            } else {
                return { ...prev, [name]: value };
            }
        });
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCapa(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!obra) return;

        setIsLoading(true);

        try {
            const formData = new FormData();
            if (obra.titulo?.trim()) formData.append("titulo", obra.titulo);
            if (obra.sinopse?.trim()) formData.append("sinopse", obra.sinopse);
            if (obra.tipo?.id) formData.append("tipo_id", obra.tipo.id.toString()); // Envia ID como string
            if (obra.estado?.id) formData.append("estado_id", obra.estado.id.toString()); // Envia ID como string
            if (capa) formData.append("capa", capa);

            const response = await axios.post(
                `http://127.0.0.1:8000/api/v1/obras/${obra.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("obra.token")}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("Dados atualizados com sucesso!");
                router.push(`/obra/${obra.id}`);
            } else {
                alert("Erro ao atualizar a obra.");
            }
        } catch (error: any) {
            console.error("Erro ao atualizar a obra:", error.message || error);
            alert("Erro ao salvar as alterações. Verifique os campos e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };


    if (!obra) return <p>Carregando...</p>;

    return (
        <div className={style.container}>
            <h1 className={style.titulo}>Editar Obra</h1>
            <form onSubmit={handleSubmit} className={style.form}>
                <div className={style.formGroup}>
                    <label>Título:</label>
                    <input
                        type="text"
                        name="titulo"
                        value={obra.titulo || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={style.formGroup}>
                    <label>Sinopse:</label>
                    <textarea
                        name="sinopse"
                        value={obra.sinopse || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={style.formGroup}>
                    <label>Tipo:</label>
                    <select
                        name="tipo"
                        value={obra.tipo?.id || ""}
                        onChange={handleInputChange}
                    >
                        <option value="">Selecione um tipo</option>
                        {tipos.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={style.formGroup}>
                    <label>Estado:</label>
                    <select
                        name="estado"
                        value={obra.estado?.id || ""}
                        onChange={handleInputChange}
                    >
                        <option value="">Selecione um estado</option>
                        {estados.map((estado) => (
                            <option key={estado.id} value={estado.id}>
                                {estado.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={style.formGroup}>
                    <label>Capa:</label>
                    <input
                        type="file"
                        name="capa"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    {(capa || obra.capa) && (
                        <div className={style.capaPreview}>
                            <p>Preview da capa:</p>
                            <img
                                src={capa ? URL.createObjectURL(capa) : obra.capa || ""}
                                alt="Capa"
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className={style.submitButton} disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
            </form>
        </div>
    );
}

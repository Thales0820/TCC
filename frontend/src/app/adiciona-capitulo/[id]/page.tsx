"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './style.module.css';
import { FaArrowLeft } from 'react-icons/fa';
import { isAuthenticated } from "@/utils/auth";

const SortableItem = ({
    value,
    index,
    onDragStart,
    onDragOver,
    onDrop,
    onImageClick,
}: {
    value: string;
    index: number;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDrop: () => void;
    onImageClick: (image: string) => void;
}) => {
    const handleTouchStart = () => onDragStart(index);
    const handleTouchMove = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target instanceof HTMLElement) {
            const newIndex = parseInt(target.dataset.index || "-1", 10);
            if (!isNaN(newIndex)) {
                onDragOver(newIndex);
            }
        }
    };
    const handleTouchEnd = () => onDrop();

    return (
        <div
            className={style.imageWrapper}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver(index);
            }}
            onDrop={onDrop}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => onImageClick(value)}
            data-index={index}
        >
            <img src={value} alt="Página" className={style.imageThumbnail} />
        </div>
    );
};

export default function AdicionarCapitulo({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const searchParams = useSearchParams();
    const obraNome = searchParams.get("obraNome") || "a obra";
    const [imagens, setImagens] = useState<File[]>([]);
    const [imagensURLs, setImagensURLs] = useState<string[]>([]);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        titulo: "",
        numero: "",
        data_publicacao: new Date().toISOString().split("T")[0],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
        }
        if (!id) {
            router.push('/home');
        }
    }, [id]);

    const handleImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        setImagens((oldFiles) => [...oldFiles, ...newFiles]);

        const newURLs = newFiles.map((file) => URL.createObjectURL(file));
        setImagensURLs((oldURLs) => [...oldURLs, ...newURLs]);
    };

    const handleDragStart = (index: number) => {
        setDraggingIndex(index);
    };

    const handleDragOver = (index: number) => {
        if (draggingIndex === null) return;
        if (index !== draggingIndex) {
            const newURLs = [...imagensURLs];
            const [draggedItem] = newURLs.splice(draggingIndex, 1);
            newURLs.splice(index, 0, draggedItem);
            setDraggingIndex(index);
            setImagensURLs(newURLs);

            const newFiles = [...imagens];
            const [draggedFile] = newFiles.splice(draggingIndex, 1);
            newFiles.splice(index, 0, draggedFile);
            setImagens(newFiles);
        }
    };

    const handleDrop = () => {
        setDraggingIndex(null);
    };

    const handleImageClick = (image: string) => {
        setImagemSelecionada(image);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setImagemSelecionada(null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        // Verificar se o número do capítulo é negativo
        if (parseInt(formData.numero) <= 0) {
            alert("O número do capítulo deve ser um número positivo.");
            setIsSubmitting(false);
            return;
        }

        try {
            const form = new FormData();
            form.append("titulo", formData.titulo);
            form.append("numero", formData.numero);
            form.append("data_publicacao", formData.data_publicacao);
            form.append("obra_id", id);

            const response = await axios.post(`http://127.0.0.1:8000/api/v1/capitulos`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const capituloId = response.data?.id;
            if (!capituloId) {
                console.error("Erro ao obter ID do capítulo.");
                return;
            }

            for (let i = 0; i < imagens.length; i++) {
                const formPagina = new FormData();
                formPagina.append("capitulo_id", capituloId);
                formPagina.append("numero", `${i + 1}`);
                formPagina.append("imagem", imagens[i]);

                await axios.post(`http://127.0.0.1:8000/api/v1/paginas`, formPagina, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            router.push(`/capitulo/${capituloId}`);
        } catch (error) {
            console.error("Erro ao criar capítulo ou enviar imagens:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={style.container}>
            <div className={style.titulo}>
                <FaArrowLeft onClick={() => router.back()} className={style.icone} title="Voltar" />
                <h1>Adicionando Capítulo a Obra</h1>
            </div>
            <form className={style.form} onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label htmlFor="titulo">Título:</label>
                    <input type="text" id="titulo" name="titulo" value={formData.titulo} required
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} />
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="numero">Número do Capítulo:</label>
                    <input type="number" id="numero" name="numero" value={formData.numero} min="1" required
                        onChange={(e) => {
                            const value = e.target.value;
                            if (parseInt(value) < 1) {
                                setFormData({ ...formData, numero: "1" });
                            } else {
                                setFormData({ ...formData, numero: value });
                            }
                        }}/>
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="data_publicacao">Data de Publicação:</label>
                    <input type="date" id="data_publicacao" name="data_publicacao" value={formData.data_publicacao}
                        onChange={(e) => setFormData({ ...formData, data_publicacao: e.target.value })} required />
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="imagens">Imagens do Capítulo:</label>
                    <input type="file" id="imagens" name="imagens" onChange={handleImages} multiple
                        accept="image/*" className={style.fileInputStyled}/>
                </div>

                <div className={style.imagesGrid}>
                    {imagensURLs.map((value, index) => (
                        <SortableItem key={`item-${index}`} value={value} index={index}
                            onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
                            onImageClick={handleImageClick} />
                    ))}
                </div>
                <div className={style.divBotao}>
                    <button type="submit" disabled={isSubmitting} className={style.submitButton}>
                        {isSubmitting ? "Enviando..." : "Adicionar Capítulo"}
                    </button>
                </div>
            </form>
            <br />
            {modalOpen && (
                <div className={style.modal} onClick={closeModal}>
                    <img src={imagemSelecionada!} alt="Página Ampliada" className={style.modalImage} />
                </div>
            )}
        </div>
    );
}


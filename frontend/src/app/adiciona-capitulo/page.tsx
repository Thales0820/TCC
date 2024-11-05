"use client";
import React, { useState } from "react";
import style from "./style.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Componente para renderizar cada imagem (Página)
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
}) => (
    <div
        className={style.imageWrapper}
        draggable
        onDragStart={() => onDragStart(index)}
        onDragOver={(e) => {
            e.preventDefault();
            onDragOver(index);
        }}
        onDrop={onDrop}
        onClick={() => onImageClick(value)}
    >
        <img src={value} alt="Página" className={style.imageThumbnail} />
    </div>
);

export default function AdicionaCapitulo() {
    const router = useRouter();
    const [imagens, setImagens] = useState<string[]>([]);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);

    // Função para lidar com o upload e exibir miniaturas das imagens carregadas
    const handleImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const imagensCarregadas = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );
        setImagens((oldImages) => [...oldImages, ...imagensCarregadas]);
    };

    // Funções de arrastar e soltar para reordenar imagens
    const handleDragStart = (index: number) => {
        setDraggingIndex(index);
    };

    const handleDragOver = (index: number) => {
        if (draggingIndex === null) return;
        if (index !== draggingIndex) {
            const newImagens = [...imagens];
            const [draggedItem] = newImagens.splice(draggingIndex, 1);
            newImagens.splice(index, 0, draggedItem);
            setDraggingIndex(index);
            setImagens(newImagens);
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

    // Função para voltar à página anterior
    const voltar = () => {
        router.back();
    };

    return (
        <div className={style.container}>
            <div className={style.titulo}>
                <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                <h1>Adicionando Capítulo</h1>
            </div>
            <br />
            <form className={style.form}>
                <div className={style.formGroup}>
                    <label>Título:</label>
                    <input type="text" placeholder="Titulo do Capitulo" />
                </div>
                <div className={style.formGroup}>
                    <label>Número:</label>
                    <input type="number" placeholder="Cap. " />
                </div>
                <div className={style.formGroup}>
                    <label>Páginas:</label>
                    <input
                        type="file"
                        multiple
                        className={style.fileInputStyled}
                        onChange={handleImages}
                    />
                </div>
                <div className={style.imagesGrid}>
                    {imagens.map((value, index) => (
                        <SortableItem
                            key={`item-${index}`}
                            value={value}
                            index={index}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onImageClick={handleImageClick}
                        />
                    ))}
                </div>
                <div className={style.divBotao}>
                    <button className={style.submitButton}>Lançar Capítulo</button>
                </div>
            </form>
            {modalOpen && (
                <div className={style.modal} onClick={closeModal}>
                    <img src={imagemSelecionada!} alt="Página Ampliada" className={style.modalImage} />
                </div>
            )}
        </div>
    );
}

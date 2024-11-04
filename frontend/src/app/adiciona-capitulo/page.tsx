"use client";
import React, { useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import style from "./style.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Função customizada para mover elementos dentro de um array
function moveArrayItem(array: string[], fromIndex: number, toIndex: number) {
    const item = array[fromIndex];
    const newArray = array.filter((_, index) => index !== fromIndex);
    newArray.splice(toIndex, 0, item);
    return newArray;
}

// Componente para renderizar cada imagem (Página)
const SortableItem = SortableElement(({ value, onImageClick }: { value: string; 
                    onImageClick: (image: string) => void }) => {         
    console.log("SortableItem renderizado com a imagem:", value);           
    return (
        <div className={style.imageWrapper}
        onClick={() => {
            console.log("Imagem Clicada!"); onImageClick(value); // Chama a função recebida
        }}
    >
        <img src={value} alt="Página" className={style.imageThumbnail} />
    </div>            
    )
});

// Componente para renderizar a lista de imagens ordenáveis
const SortableList = SortableContainer(({ items, onImageClick }: { items: string[]; 
                    onImageClick: (image: string) => void }) => (
    <div className={style.imagesGrid}>
        {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value} onImageClick={onImageClick} />
        ))}
    </div>
));

export default function AdicionaCapitulo() {
    const router = useRouter();
    const [imagens, setImagens] = useState<string[]>([]);
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

    // Função para lidar com a reorganização das imagens
    const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
        setImagens((oldImages) => moveArrayItem(oldImages, oldIndex, newIndex));
    };

    const handleImageClick = (image: string) => {
        console.log("Abrindo modal para imagem:", image); // Confirmação da abertura do modal
        setImagemSelecionada(image);
        setModalOpen(true);
        console.log(`Modal abrindo: ${modalOpen}`)
    };

    const closeModal = () => {
        console.log("Fechando modal.");
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
                <SortableList items={imagens} onSortEnd={onSortEnd} onImageClick={handleImageClick} axis="xy" />
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

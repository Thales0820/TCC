import { useEffect, useState } from 'react';
import style from './style.module.css'
import { getGeneros } from '@/app/api/routes';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selecionaGenero: string[]; // Gêneros para o checklist
    onSelectGenre: (selectedGenres: string[]) => void;
};

export const ModalGenero: React.FC<ModalProps> = ({ isOpen, onClose, selecionaGenero, onSelectGenre }) => {
    const [generos, setGeneros] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            getGeneros()
                .then((data) => setGeneros(data)).catch((error) => {
                    setError('Erro ao carregar Gêneros')
                    console.log(error)
                })
        }
    }, [isOpen])

    if (!isOpen) return null;

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    };

    const limparGeneros = () => {
        onSelectGenre([]); // Reseta o array de gêneros selecionados
    };

    return(
        <>
            <div className={style.modalFundo} onClick={onClose}>
                <div className={style.modal} onClick={handleContentClick}>
                    <h2 className={style.titulo}>Selecione os Gêneros</h2>
                    <div className={style.checklistContainer}>
                    {generos.map((genero) => (
                        <label key={genero} className={style.checkboxItem}>
                            <input
                                type="checkbox"
                                checked={selecionaGenero.includes(genero)}
                                onChange={() => {
                                    const updatedGenres = selecionaGenero.includes(genero)
                                            ? selecionaGenero.filter(g => g !== genero) // Desmarcar
                                            : [...selecionaGenero, genero]; // Marcar
                                        onSelectGenre(updatedGenres);
                                }}
                            />
                            {genero}
                        </label>
                    ))}
                    </div>
                    <div className={style.controle}>
                        <button onClick={onClose} className={style.botao}>Confirmar</button>
                        <button onClick={limparGeneros} className={style.botao}>Limpar</button>
                    </div>
                </div>
            </div>
        </>
    )
}
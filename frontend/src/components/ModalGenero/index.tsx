import style from './style.module.css'

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selecionaGenero: string[]; // Gêneros para o checklist
    onSelectGenre: (selectedGenres: string[]) => void;
};

const genres = [
    "Ação",
    "Aventura",
    "Romance",
    "Comédia",
    "Drama",
    "Terror",
    "Policial",
    "Psicológico",
    "Ficção Psicológica",
    "Fantasia",
    "Sobrenatural",
    "Mistério",
    "Político",
    "Social",
    "Slice of Life",
    "Ficção Científica",
];

export const ModalGenero: React.FC<ModalProps> = ({ isOpen, onClose, selecionaGenero, onSelectGenre }) => {

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
                    <button className={style.closeButton} onClick={onClose}>
                        X
                    </button>
                    <h2 className={style.titulo}>Selecione os Gêneros</h2>
                    <div className={style.checklistContainer}>
                    {genres.map((genre) => (
                        <label key={genre} className={style.checkboxItem}>
                            <input
                                type="checkbox"
                                checked={selecionaGenero.includes(genre)}
                                onChange={() => {
                                    const updatedGenres = selecionaGenero.includes(genre)
                                            ? selecionaGenero.filter(g => g !== genre) // Desmarcar
                                            : [...selecionaGenero, genre]; // Marcar
                                        onSelectGenre(updatedGenres);
                                }}
                            />
                            {genre}
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
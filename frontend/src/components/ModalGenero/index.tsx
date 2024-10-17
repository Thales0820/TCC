// ModalGenero.tsx
import React, { useState } from 'react';
import style from './style.module.css';

// Defina a interface Genero
interface Genero {
  id: string;
  nome: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selecionaGenero: string[];
  onSelectGenre: (selected: string[]) => void;
  generos: Genero[]; // Adicione esta linha para incluir generos
}

export const ModalGenero: React.FC<ModalProps> = ({ isOpen, onClose, selecionaGenero, onSelectGenre, generos }) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(selecionaGenero);

  const handleGenreToggle = (id: string) => {
    setSelectedGenres((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(g => g !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleConfirm = () => {
    onSelectGenre(selectedGenres);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={style.modal}>
      <h2>Selecionar Gêneros</h2>
      <div className={style.genreList}>
        {generos.map((genero) => (
          <div key={genero.id}>
            <input
              type="checkbox"
              id={genero.id}
              checked={selectedGenres.includes(genero.id)}
              onChange={() => handleGenreToggle(genero.id)}
            />
            <label htmlFor={genero.id}>{genero.nome}</label>
          </div>
        ))}
      </div>
      <button onClick={handleConfirm}>Confirmar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

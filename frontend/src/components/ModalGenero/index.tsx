
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

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const limparGeneros = () => {
    setSelectedGenres([]);
  };

  if (!isOpen) return null;

  return (
    <div className={style.modalFundo} onClick={onClose}>
      <div className={style.modal} onClick={handleContentClick}>
        <h2 className={style.titulo}>Selecionar Gêneros</h2>
        <div className={style.checklistContainer}>
          {generos.map((genero) => (
            <label key={genero.id} className={style.checkboxItem}>
              <input
                type="checkbox"
                id={genero.id}
                checked={selectedGenres.includes(genero.id)}
                onChange={() => handleGenreToggle(genero.id)}
              />
              {genero.nome}
            </label>
          ))}
        </div>
        <div className={style.controle}>
          <button onClick={handleConfirm} className={style.botao}>Confirmar</button>
          <button onClick={limparGeneros} className={style.botao}>Limpar</button>
        </div>
      </div>
    </div>
  );
  
};

import React, { useState, useEffect } from 'react';
import style from './style.module.css';

interface Genero {
  id: string;
  nome: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selecionaGenero: string[]; // Gêneros selecionados passados como array de strings
  onSelectGenre: (selected: string[]) => void; // Função para passar os gêneros selecionados de volta
  generos: Genero[]; // Lista de gêneros disponíveis
}

export const ModalGenero: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  selecionaGenero,
  onSelectGenre,
  generos,
}) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Atualiza os gêneros selecionados ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setSelectedGenres(selecionaGenero);
    }
  }, [isOpen, selecionaGenero]);

  const handleGenreToggle = (id: string) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((g) => g !== id)
        : [...prevSelected, id]
    );
  };

  const handleConfirm = () => {
    onSelectGenre(selectedGenres); // Passa os gêneros selecionados de volta para o componente pai
    onClose(); // Fecha o modal
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Impede o clique de fechar o modal ao clicar dentro do conteúdo
  };

  const limparGeneros = () => {
    setSelectedGenres([]); // Limpa a seleção
  };

  if (!isOpen) return null; // Não renderiza o modal se não estiver aberto

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
        <br />
        <div className={style.controle}>
          <button onClick={handleConfirm} className={style.botao}>Confirmar</button>
          <button onClick={limparGeneros} className={style.botao}>Limpar</button>
        </div>
      </div>
    </div>
  );
};

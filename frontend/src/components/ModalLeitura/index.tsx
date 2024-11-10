import React, { useEffect, useState } from 'react';
import style from './style.module.css'
import { addToLista, getLeituras } from '@/app/api/routes';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    obraId: number;
    usuarioId: number | null;
};

export const ModalLeitura: React.FC<ModalProps> = ({ isOpen, onClose, obraId, usuarioId }) => {
    const [leituras, setLeituras] = useState<{ id: number; tipo: string }[]>([]);
    const [leituraSelecionada, setLeituraSelecionada] = useState<number | null>(null);

    useEffect(() => {
        const fetchLeituras = async () => {
            try {
                const data = await getLeituras();
                //console.log('Dados da API:', data); // Verifique se os dados são retornados aqui
                setLeituras(data)
            } catch (error) {
                console.error('Erro ao buscar leituras:', error);
            }
        };

        if (isOpen && usuarioId) {
            fetchLeituras();
        }
    }, [isOpen, usuarioId]);

    const handleConfirm = async () => {
        if (!usuarioId) {
            console.error('Usuário não autenticado');
            return;
        }
        if (leituraSelecionada) {
            try {
                console.log('Enviando dados:', { usuarioId, obraId, leituraSelecionada });
                await addToLista(usuarioId, obraId, leituraSelecionada);
                alert('Obra adicionada à lista de leitura com sucesso!');
                onClose();
            } catch (error) {
                console.error('Erro ao adicionar à lista:', error);
            }
        } else {
            alert("Selecione alguma opção antes de Confirmar");
        }
    };

    if (!isOpen) return null;

    const handleClickInsideModal = (event: React.MouseEvent) => {
        event.stopPropagation(); // Impede que o clique no modal feche o modal
    };

    return(
        <>
            <div className={style.modalFundo} onClick={onClose}>
                <div className={style.modal} onClick={handleClickInsideModal}>
                    <h2 className={style.titulo}>Selecione para Adicionar a sua Lista</h2>
                    <div className={style.checklistContainer}>
                        {leituras.map((leitura) => (
                            <label key={leitura.id} className={style.checkboxItem}>
                                <input type="radio" name="status" value={leitura.id} 
                                    checked={leituraSelecionada === leitura.id} 
                                    onChange={() => setLeituraSelecionada(leitura.id)}
                                />
                                {leitura.tipo}
                            </label>
                        ))}
                    </div>
                    <div className={style.controle}>
                        <button onClick={handleConfirm} className={style.botao}>Confirmar</button>
                        <button onClick={onClose} className={style.botao}>Remover da Lista</button>
                    </div>
                </div>
            </div>
        </>
    )
}

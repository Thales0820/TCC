import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import { addToLista, deletarLista, getLeituras, updateLista } from '@/app/api/routes';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    obraId: number;
    usuarioId: number | null;
    listaId?: number;
    leituraAtual?: number;
};

export const ModalLeitura: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    obraId,
    usuarioId,
    listaId = null,
    leituraAtual = null,
}) => {
    const [leituras, setLeituras] = useState<{ id: number; tipo: string }[]>([]);
    const [leituraSelecionada, setLeituraSelecionada] = useState<number | null>(leituraAtual);

    useEffect(() => {
        const fetchLeituras = async () => {
            try {
                const data = await getLeituras();
                setLeituras(data);
            } catch (error) {
                console.error('Erro ao buscar leituras:', error);
            }
        };

        if (isOpen && usuarioId) {
            fetchLeituras();
            setLeituraSelecionada(leituraAtual);
        }
    }, [isOpen, usuarioId, leituraAtual]);

    const handleConfirm = async () => {
        if (!usuarioId || leituraSelecionada === null) {
            alert("Selecione uma opção antes de Confirmar");
            return;
        }
        try {
            if (listaId) {
                await updateLista(listaId, leituraSelecionada);
                alert('Leitura atualizada com sucesso!');
            } else {
                await addToLista(usuarioId, obraId, leituraSelecionada);
                alert('Obra adicionada à lista de leitura com sucesso!');
            }
            onClose();
        } catch (error) {
            console.error('Erro ao salvar leitura:', error);
        }
    };

    const handleDelete = async () => {
        try {
            if (listaId) {
                await deletarLista(listaId);
                alert('Obra retirada da lista de leitura com sucesso!');
            }
            onClose()
        } catch (error) {
            console.error("Erro ao tentar excluir a obra da lista:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={style.modalFundo} onClick={onClose}>
            <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={style.titulo}>Selecione para Adicionar a sua Lista</h2>
                <div className={style.checklistContainer}>
                    {leituras.map((leitura) => (
                        <label key={leitura.id} className={style.checkboxItem}>
                            <input
                                type="radio"
                                name="status"
                                value={leitura.id}
                                checked={leituraSelecionada === leitura.id}
                                onChange={() => setLeituraSelecionada(leitura.id)}
                            />
                            {leitura.tipo}
                        </label>
                    ))}
                </div>
                <div className={style.controle}>
                    <button onClick={handleConfirm} className={style.botao}>Confirmar</button>
                    <button onClick={handleDelete} className={`${style.botao} ${style.excluir}`}>Remover da Lista</button>
                </div>
            </div>
        </div>
    );
};
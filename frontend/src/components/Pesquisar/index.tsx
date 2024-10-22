"use client"
import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.css";
import { FaSearch } from "react-icons/fa";

interface Obra {
    id: number;
    titulo: string;
    capa: string;
}

export const Pesquisar = () => {
    const [pesquisarQuery, setPesquisarQuery] = useState<string>("");
    const [sugestoes, setSugestoes] = useState<Obra[]>([]);
    const [obrasList, setObrasList] = useState<Obra[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const suggestionListRef = useRef<HTMLUListElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Função para buscar as obras da API
    const fetchObras = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/obras");
            if (response.ok) {
                const data = await response.json();
                setObrasList(data);
            } else {
                console.error("Erro ao buscar obras:", response.statusText);
            }
        } catch (error) {
            console.error("Erro ao buscar obras:", error);
        }
    };

    // Carrega a lista de obras ao montar o componente
    useEffect(() => {
        fetchObras();
    }, []);

    // Filtra as sugestões conforme o usuário digita
    useEffect(() => {
        if (pesquisarQuery.length > 0) {
            const filtrarSugestoes = obrasList.filter(obra =>
                obra.titulo.toLowerCase().startsWith(pesquisarQuery.toLowerCase())
            );
            setSugestoes(filtrarSugestoes);
            setActiveSuggestionIndex(-1);
        } else {
            setSugestoes([]);
            setActiveSuggestionIndex(-1);
        }
    }, [pesquisarQuery, obrasList]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchInputRef.current && !searchInputRef.current.contains(event.target as Node) &&
                suggestionListRef.current && !suggestionListRef.current.contains(event.target as Node)
            ) {
                setPesquisarQuery("");  // Limpa o campo de pesquisa
                setSugestoes([]);        // Limpa as sugestões
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPesquisarQuery(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (sugestoes.length > 0) {
            if (e.key === "ArrowDown") {
                setActiveSuggestionIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % sugestoes.length;
                    scrollSuggestionIntoView(nextIndex);
                    return nextIndex;
                });
            } else if (e.key === "ArrowUp") {
                setActiveSuggestionIndex((prevIndex) => {
                    const nextIndex = (prevIndex - 1 + sugestoes.length) % sugestoes.length;
                    scrollSuggestionIntoView(nextIndex);
                    return nextIndex;
                });
            } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
                setPesquisarQuery(sugestoes[activeSuggestionIndex].titulo);
                setSugestoes([]);
            }
        }
    };

    const scrollSuggestionIntoView = (index: number) => {
        const suggestionList = suggestionListRef.current;
        if (suggestionList) {
            const selectedItem = suggestionList.children[index] as HTMLElement;
            if (selectedItem) {
                selectedItem.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }
    };

    return (
        <>
        <div className={style.pesquisarContainer}>
            <form className={style.pesquisar} onSubmit={(e) => e.preventDefault()}>
                <input
                    type="search"
                    value={pesquisarQuery}
                    ref={searchInputRef}
                    aria-label="Pesquisar"
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Pesquisar..."
                    className={style.pesquisarInput}
                />
                <div className={style.divBotao}>
                    <button type="submit" className={style.pesquisarBotao}><FaSearch size={20} /></button>
                </div>
                {sugestoes.length > 0 && (
                    <ul className={style.sugestoesLista} ref={suggestionListRef}>
                        {sugestoes.map((obra, index) => (
                            <li
                                key={obra.id}
                                onClick={() => {
                                    setPesquisarQuery(obra.titulo);
                                    setSugestoes([]);
                                }}
                                className={`${style.sugestaoItem} ${index === activeSuggestionIndex ? style.sugestaoAtiva : ""}`}
                            >
                                {obra.titulo}
                                <img src={`http://localhost:8000/${obra.capa}`} alt={`Capa de ${obra.titulo}`} className={style.imagemSugestao}/>
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
        </>
    );
}

export default Pesquisar;

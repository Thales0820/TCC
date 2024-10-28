"use client";
import { useEffect, useState } from "react";
import { Menu } from "@/components/Menu";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import style from './style.module.css';
import { Cards } from "@/components/Cards";
import { ModalPerfil } from "@/components/ModalPerfil";
import { getEstados, getTipos } from "../api/routes";
import { FiltroGenero } from "@/components/FiltroGenero";

interface Genero {
  id: number;
  nome: string;
}

interface Obra {
  id: number;
  capa: string;
  titulo: string;
  tipo_id: string; // Mantém como string
  estado_id: string; // Mantém como string
  generos: Genero[];
}

export default function Pesquisar() {
  const router = useRouter();
  const [obrasData, setObrasData] = useState<Obra[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selecioneGenero, setSelecioneGenero] = useState<string[]>([]);
  const [tipoObra, setTipoObra] = useState<string>(""); // Mantém como string
  const [estadoObra, setEstadoObra] = useState<string>(""); // Mantém como string
  const [pesquisar, setPesquisar] = useState("");
  const [tiposObra, setTiposObra] = useState<string[]>([]);
  const [estadosObra, setEstadosObra] = useState<string[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const identificarGenero = (selectedGenres: string[]) => {
    setSelecioneGenero(selectedGenres);
  };

  const handleFilter = () => {
    return obrasData.filter(obra => {
      const matchesSearchTerm = obra.titulo.toLowerCase().includes(pesquisar.toLowerCase());
      const matchesTipo = tipoObra === "" || obra.tipo_id === tipoObra; // Comparação
      const matchesEstado = estadoObra === "" || obra.estado_id === estadoObra; // Comparação
      const matchesGenero = 
        selecioneGenero.length === 0 ||
        obra.generos.some(g => selecioneGenero.includes(g.nome));

      console.log(`Obra: ${obra.titulo}, Matches: ${matchesSearchTerm}, ${matchesTipo}, ${matchesEstado}, ${matchesGenero}`);
  
      return matchesSearchTerm && matchesTipo && matchesEstado && matchesGenero;
    });
  };

  const filtroObras = handleFilter();

  const voltar = () => {
    router.back();
  };

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/obras");
        const data = await response.json();
        console.log("Dados das obras:", data); // Verifique os dados aqui
        setObrasData(data);
      } catch (error) {
        console.error("Erro ao buscar obras:", error);
      }
    };
  
    fetchObras();
  }, []);

  useEffect(() => {
    const loadTiposEEstados = async () => {
      try {
        const tipos = await getTipos();
        const estados = await getEstados();
        setTiposObra(tipos);
        setEstadosObra(estados);
      } catch (error) {
        console.error("Erro ao buscar tipos e estados:", error);
      }
    };

    loadTiposEEstados();
  }, []);

  return (
    <>
      <Menu />
      <ModalPerfil />
      <div className={style.container}>
        <div className={style.titulo}>
          <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
          <h1>Pesquisa Avançada</h1>
        </div>
        <div className={style.pesquisaContainer}>
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className={style.pesquisa}
            value={pesquisar} 
            onChange={(e) => setPesquisar(e.target.value)} 
          />

          <select className={style.select} value={tipoObra} onChange={(e) => setTipoObra(e.target.value)}>
            <option value="">Tipo da Obra</option>
            {tiposObra.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>

          <select className={style.select} value={estadoObra} onChange={(e) => setEstadoObra(e.target.value)}>
            <option value="">Estado da Obra</option>
            {estadosObra.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>

          <button className={style.generos} onClick={handleOpenModal}>Selecione Gêneros</button>
        </div>
        <Cards data={filtroObras} />
      </div>
      <FiltroGenero 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        selecionaGenero={selecioneGenero}
        onSelectGenre={identificarGenero}
      />
    </>
  );
}

"use client"
import { useEffect, useState } from "react";
import { Menu } from "@/components/Menu";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import style from './style.module.css';
import { Cards } from "@/components/Cards";
import { ModalPerfil } from "@/components/ModalPerfil";
import { getEstados, getTipos } from "../api/routes";
import { FiltroGenero } from "@/components/FiltroGenero";

interface Obra {
  image: string;
  titulo: string;
  tipo: string;
  estado: string;
  genero: string[];
}

export default function Pesquisar() {

  const obrasData: Obra[] = [
    {
      image: "https://a-static.mlcdn.com.br/450x450/poster-cartaz-batman-a-piada-mortal-pop-arte-poster/poparteskins2/15938544114/bb3e16085364ca48b024042f6dc1548e.jpeg",
      titulo: "Batman: A Piada Mortal",
      tipo: "Super-heróis",
      estado: "Finalizado",
      genero: ["Ação", "Policial", "Terror", "Psicológico", "Drama", "Ficção Psicológica"]
    },
    {
      image: "https://mangadex.org/covers/32d76d19-8a05-4db0-9fc2-e0b0648fe9d0/95c6aa66-fab2-4388-be95-d7890dc0598a.jpg",
      titulo: "Solo Leveling",
      tipo: "Manhwa",
      estado: "Finalizado",
      genero: ["Fantasia", "Ação", "Aventura", "Sobrenatural", "Drama"]
    },
    {
      image: "https://media.fstatic.com/xTq6vfyhx_pfWVOkNWI-2DSGwSA=/322x478/smart/filters:format(webp)/media/movies/covers/2011/04/9a4c1509d7e0707a25e1b70e92adc285.jpg",
      titulo: "As Aventuras de Tintim",
      tipo: "Banda Desenhada",
      estado: "Finalizado",
      genero: ["Aventura", "Mistério", "Comédia", "Político", "Social"]
    },
    {
      image: "https://mangadex.org/covers/4ada20eb-085a-491a-8c49-477ab42014d7/69098388-a967-464f-8178-344aa9bd4b31.jpg",
      titulo: "The Beginning After the End",
      tipo: "Manhwa",
      estado: "Publicando",
      genero: ["Fantasia", "Aventura", "Ação", "Drama", "Romance"]
    },
    {
      image: "https://lh3.googleusercontent.com/proxy/XtXyVbB3z1PijE1i9BA3Whz-PoBh2xy07-Y1aJik2BlMngUkUBtczD0b5tFROS25NvB26J098IrLK6H9tvciSLhvQNqhFD-kSUkGMX_DNn-NNsxlwBQ0t9HgJ32_DrJy-HOUV2jcUHXRDepcjQw",
      titulo: "O Espetacular Homem-Aranha",
      tipo: "Super-heróis",
      estado: "Finalizado",
      genero: ["Ação", "Aventura", "Drama", "Romance", "Comédia"]
    },
    {
      image: "https://m.media-amazon.com/images/I/818KGgapfiL._SL1500_.jpg",
      titulo: "A Garota do Mar",
      tipo: "Graphic Novels",
      estado: "Publicando",
      genero: ["Romance", "Fantasia", "Aventura", "Drama"]
    },
    {
      image: "https://mangadex.org/covers/aa6c76f7-5f5f-46b6-a800-911145f81b9b/2d50161f-e715-4e4f-86bd-d38772823b39.jpg",
      titulo: "Sono Bisque Doll wa Koi o Suru",
      tipo: "Mangá",
      estado: "Pausado",
      genero: ["Comédia", "Romance", "Slice of Life", "Drama"]
    },
    {
      image: "https://m.media-amazon.com/images/I/81+-f0EqFlL._SL1500_.jpg",
      titulo: "Charlie Brown e sua Turma",
      tipo: "Histórias Infantis",
      estado: "Publicando",
      genero: ["Comédia", "Slice of Life", "Drama"]
    },
    {
      image: "https://m.media-amazon.com/images/I/814zhAWOKBL._AC_UF1000,1000_QL80_.jpg",
      titulo: "Persépolis",
      tipo: "Documentais",
      estado: "Cancelado",
      genero: ["Drama", "Político", "Social"]
    },
    {
      image: "https://m.media-amazon.com/images/I/81dQUROWcHL._AC_UF1000,1000_QL80_.jpg",
      titulo: "Adulthood Is a Myth",
      tipo: "Graphic Novels",
      estado: "Finalizado",
      genero: ["Comédia", "Slice of Life", "Romance"]
    },
  ];

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selecioneGenero, setSelecioneGenero] = useState<string[]>([]);
  const [tipoObra, setTipoObra] = useState("");
  const [estadoObra, setEstadoObra] = useState("");
  const [pesquisar, setPesquisar] = useState("");
  const [tiposObra, setTiposObra] = useState<string[]>([]);  // Armazena os tipos de obra
  const [estadosObra, setEstadosObra] = useState<string[]>([]);  // Armazena os estados de obra

  // Função para abrir o modal de gêneros
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
      const matchesTipo = tipoObra === "" || obra.tipo === tipoObra;
      const matchesEstado = estadoObra === "" || obra.estado === estadoObra;
      const matchesGenero = selecioneGenero.length === 0 || obra.genero.some(g => selecioneGenero.includes(g));
      return matchesSearchTerm && matchesTipo && matchesEstado && matchesGenero;
    });
  };

  const filtroObras = handleFilter();

  const voltar = () => {
    router.back();
  };

  // useEffect para buscar os tipos e estados de obra da API
  useEffect(() => {
    const loadTiposEEstados = async () => {
      try {
        const tipos = await getTipos();
        const estados = await getEstados();
        setTiposObra(tipos);   // Armazena os tipos de obra
        setEstadosObra(estados); // Armazena os estados de obra
      } catch (error) {
        console.error("Erro ao buscar tipos e estados:", error);
      }
    };

    loadTiposEEstados(); // Carrega as informações ao montar o componente
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
          <input type="text" placeholder="Pesquisar..." className={style.pesquisa} 
                 value={pesquisar} onChange={(e) => setPesquisar(e.target.value)} />
          
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
      <FiltroGenero isOpen={isModalOpen} onClose={handleCloseModal} selecionaGenero={selecioneGenero} 
                   onSelectGenre={identificarGenero}>
      </FiltroGenero>
    </>
  );
}
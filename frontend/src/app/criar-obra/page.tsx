"use client";
import { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import style from './style.module.css';
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { ModalGenero } from "@/components/ModalGenero";
import Cookies from 'js-cookie';
import { verificaTokenExpirado, isAuthenticated } from '@/utils/auth';
import { parseCookies } from "nookies";

interface Usuario {
    id: string;
    nome: string;
    perfil: {
        id: string;
        tipo: string;
    };
}

interface Tipo {
    id: string;
    nome: string;
}

interface Estado {
    id: string;
    nome: string;
}

interface Genero {
    id: string;
    nome: string;
}

interface TokenPayload {
    sub: string; // ID do usuário no token
}

export default function CriarObra() {
    const [titulo, setTitulo] = useState('');
    const [capa, setCapa] = useState<File | null>(null);
    const [sinopse, setSinopse] = useState('');
    const [dataPublicacao, setDataPublicacao] = useState(new Date().toISOString().substring(0, 10));
    const [autorId, setAutorId] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [estadoId, setEstadoId] = useState('');
    const [generoSelecionados, setGeneroSelecionados] = useState<Genero[]>([]);
    const [tipos, setTipos] = useState<Tipo[]>([]);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [generos, setGeneros] = useState<Genero[]>([]);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [nomeAutor, setNomeAutor] = useState('');
    const [capaPreview, setCapaPreview] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const obraId = searchParams.get("id");
    const [imagemModalAberto, setImagemModalAberto] = useState(false); // Controle do modal

    const handleCapaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCapa(file);

        // Gerar URL de preview
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setCapaPreview(fileURL);
        } else {
            setCapaPreview(null);
        }
    };

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies['obra.token'];

        // Verifica se o token existe e se é válido
        if (token && isAuthenticated() && !verificaTokenExpirado(token)) {
            const decodedToken: TokenPayload = jwtDecode<TokenPayload>(token); // Usando jwtDecode com a importação correta
            const userId = decodedToken.sub; // Obtendo o ID do usuário a partir do token

            const fetchUserAndOptions = async () => {
                try {
                    console.log("ID do usuário:", userId);

                    // Obtendo informações do usuário autenticado
                    const res = await fetch(`http://127.0.0.1:8000/api/v1/usuarios/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!res.ok) {
                        throw new Error("Erro ao buscar dados do usuário.");
                    }

                    const usuario: Usuario = await res.json();

                    // Verifica se o usuário é um autor
                    if (!usuario.perfil || usuario.perfil.tipo !== 'Autor') {
                        router.push('/home');
                        return;
                    }

                    setAutorId(usuario.id);
                    setNomeAutor(usuario.nome); // Armazenar o nome do autor

                    // Carrega tipos, estados e gêneros
                    const [tiposRes, estadosRes, generosRes] = await Promise.all([
                        fetch('http://127.0.0.1:8000/api/v1/tipos', { headers: { Authorization: `Bearer ${token}` } }),
                        fetch('http://127.0.0.1:8000/api/v1/estados', { headers: { Authorization: `Bearer ${token}` } }),
                        fetch('http://127.0.0.1:8000/api/v1/generos', { headers: { Authorization: `Bearer ${token}` } })
                    ]);

                    if (!tiposRes.ok || !estadosRes.ok || !generosRes.ok) {
                        throw new Error("Erro ao buscar dados de tipos, estados ou gêneros.");
                    }

                    const tipos = await tiposRes.json();
                    const estados = await estadosRes.json();
                    const generos = await generosRes.json();

                    setTipos(tipos);
                    setEstados(estados);
                    setGeneros(generos);
                } catch (error) {
                    console.error('Erro ao carregar dados:', error);
                    setError('Erro ao carregar dados');
                }
            };

            fetchUserAndOptions();
        } else {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        if (obraId) {
            const fetchObra = async () => {
                try {
                    const token = Cookies.get("obra.token");
                    const response = await axios.get(`http://127.0.0.1:8000/api/v1/obras/${obraId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const obra = response.data;
    
                    const tipoCorrespondente = tipos.find((tipo) => tipo.nome === obra.tipo);
                    const estadoCorrespondente = estados.find((estado) => estado.nome === obra.estado);
    
                    setTitulo(obra.titulo);
                    setSinopse(obra.sinopse);
                    setDataPublicacao(obra.data_publicacao);
                    setTipoId(tipoCorrespondente?.id || "");
                    setEstadoId(estadoCorrespondente?.id || "");
                    setGeneroSelecionados(obra.generos);
                    setCapaPreview(`http://127.0.0.1:8000/${obra.capa}`); // Caminho da capa para preview
                } catch (error) {
                    console.error("Erro ao carregar obra:", error);
                }
            };
    
            if (obraId && tipos.length && estados.length) {
                fetchObra();
            }
        }
    }, [obraId, tipos, estados]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
    
        const formData = new FormData();
        formData.append("titulo", titulo);
        if (capa) {
            formData.append("capa", capa);
        }
        formData.append("sinopse", sinopse);
        formData.append("data_publicacao", dataPublicacao);
        formData.append("autor_id", autorId);
        formData.append("tipo_id", tipoId);
        formData.append("estado_id", estadoId);
    
        generoSelecionados.forEach((genero) => {
            formData.append("generos[]", genero.id);
        });
    
        try {
            const token = Cookies.get("obra.token");
            if (obraId) {
                // Atualiza obra existente
                const response = await axios.put(
                    `http://127.0.0.1:8000/api/v1/obras/${obraId}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Obra atualizada com sucesso:", response.data);
            } else {
                // Cria nova obra
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/v1/obras",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Obra criada com sucesso:", response.data);
            }
            resetForm();
            router.push("/minhas-obras");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                setError(
                    "Erro ao salvar obra: " + (error.response.data.message || error.message)
                );
            } else {
                setError("Erro inesperado: " + (error as Error).message);
            }
            console.error("Erro ao salvar obra:", error);
        }
    };    

    const resetForm = () => {
        setTitulo('');
        setCapa(null);
        setSinopse('');
        setDataPublicacao(new Date().toISOString().substring(0, 10));
        setTipoId('');
        setEstadoId('');
        setGeneroSelecionados([]);
    };

    const voltar = () => {
        router.back();
    };

    console.log('Generos da Obra:', generoSelecionados)
    //console.log('Teste3:', generoSelecionados)
    
    return (
        <>
            <div className={style.container}>
                <div className={style.titulo}>
                    <FaArrowLeft onClick={voltar} className={style.icone} title="Voltar" />
                    <h1>{obraId ? "Editando Obra" : "Criando Obra"}</h1>
                </div>
                <br />
                {error && (
                    <div role="alert" className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}
                <br />
                <form onSubmit={handleSubmit} className={style.form}>
                    <div className={style.inputs}>
                        <div className={style.formGroup}>
                            <label>Título:</label>
                            <input type="text" placeholder="Digite o Nome da Obra" value={titulo} 
                            onChange={(e) => setTitulo(e.target.value)} required />
                        </div>
                        <div className={style.formGroup}>
                            <label>Capa:</label>
                            <div className={style.capa}>
                                <input type="file" className={style.fileInputStyled} 
                                onChange={(e) => { setCapa(e.target.files ? e.target.files[0] : null);
                                setCapaPreview(e.target.files ? URL.createObjectURL(e.target.files[0]) : null);}}/>
                                {capaPreview && (
                                    <img src={capaPreview} alt="Capa da Obra" className={style.previewImagem} 
                                        onClick={() => setImagemModalAberto(true)} title="Clique para Ver"/>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={style.formGroup}>
                        <input  type="hidden" value={nomeAutor} disabled /> {/* Exibe o nome do autor */}
                    </div>
                    <div className={style.inputs}>
                        <div className={style.formGroup}>
                            <label>Tipo:</label>
                            <select value={tipoId} onChange={(e) => setTipoId(e.target.value)} required>
                                <option value="">Selecione um tipo</option>
                                {tipos.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className={style.formGroup}>
                            <label>Estado:</label>
                            <select value={estadoId} onChange={(e) => setEstadoId(e.target.value)} required>
                                <option value="">Selecione um estado</option>
                                {estados.map((estado) => (
                                    <option key={estado.id} value={estado.id}>{estado.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={style.inputs}>
                        <div className={style.formGroup}>
                            <label>Data de Publicação:</label>
                            <input type="date" value={dataPublicacao} 
                                   onChange={(e) => setDataPublicacao(e.target.value)}/>
                        </div>
                        <div className={`${style.formGroup} ${style.generosContainer}`}>
                            <label>Gêneros:</label>
                            <button
                                type="button"
                                className={style.generosButton}
                                onClick={() => setModalOpen(true)}
                            >
                                Selecionar Gêneros
                            </button>
                        </div>
                    </div>
                    <div className={style.formGroup}>
                        <label>Sinopse:</label>
                        <textarea value={sinopse} placeholder="Digite a Sinopse da Obra"
                        onChange={(e) => setSinopse(e.target.value)} required />
                    </div>
                    <div className={style.botao}>
                        <button type="submit" className={style.submitButton}>
                            {obraId ? "Salvar Alterações" : "Criar Obra"}
                        </button>
                    </div>
                </form>
                <ModalGenero
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    selecionaGenero={generoSelecionados
                      .map((g) => {
                        const generoEncontrado = generos.find((gen) => gen.nome === g); // Comparação correta
                        return generoEncontrado?.id || ''; // Retorna ID
                      })
                      .filter((id) => id !== '')} // Remove IDs inválidos
                    onSelectGenre={(selected) => {
                      const selecionados = generos
                        .filter((g) => selected.includes(g.id)) // Filtra objetos `Genero`
                        .map((g) => g.nome); // Extrai nomes dos gêneros
                      setGeneroSelecionados(selecionados); // Atualiza o estado
                    }}
                    generos={generos}
                    />
                {imagemModalAberto && (
                    <div className={style.modal} onClick={() => setImagemModalAberto(false)} >
                        <img src={capaPreview!} alt="Visualizar Capa" className={style.modalImage} />
                    </div>
                )}
            </div>
            <br />
        </>
    );
}
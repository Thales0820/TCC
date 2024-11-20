"use client";
import { useState, useEffect } from "react";
import axios from 'axios';
import style from './style.module.css';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { useTheme } from "@/hooks/useTheme";

export default function CadastroUsuario() {
    // Definindo estados para os campos
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState<File | null>(null); // Arquivo da foto
    const [perfilId, setPerfilId] = useState(''); // ID do perfil
    const [perfis, setPerfis] = useState([]); // Lista de perfis a serem carregados da API
    const [error, setError] = useState(''); // Erros
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const router = useRouter();
    const {theme} = useTheme()

    const logoSrc = theme === "dark" 
    ? "/images/logoDark.png" 
    : "/images/logoLight.png";

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha); // Alterna entre true e false
    };

    // Manuseio de mudança de foto de perfil
    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFotoPerfil(e.target.files[0]);
        }
    }

    // Função de envio do formulário
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
    
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('senha', senha);
        if (fotoPerfil) {
            formData.append('foto_perfil', fotoPerfil);
        }
        formData.append('perfil_id', perfilId);
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/usuarios', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Usuário cadastrado com sucesso:', response.data);
    
            // Aqui você deve receber o token do servidor
            const token = response.data.token; // Ajuste isso conforme a resposta do seu backend
            if (token) {
                // Armazenar o token no localStorage ou cookies
                localStorage.setItem('token', token); // Armazenando no localStorage
            }
    
            // Limpar os campos do formulário após sucesso
            setNome('');
            setEmail('');
            setSenha('');
            setFotoPerfil(null);
            setPerfilId('');
            setError(''); // Limpar mensagens de erro
    
            (e.target as HTMLFormElement).reset();
            router.push('/login'); // Redireciona para a página inicial após cadastro bem-sucedido
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const message = error.response?.data.message || 'Erro ao cadastrar usuário';
                setError(message);
            } else {
                setError('Erro inesperado: ' + (error as Error).message);
            }
            console.error('Erro ao cadastrar usuário:', error);
        }
    };
    
    // Buscar os perfis disponíveis na API
    const fetchPerfis = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/perfils');
            setPerfis(response.data);
        } catch (error) {
            console.error('Erro ao buscar perfis:', error);
            setError('Erro ao buscar perfis');
        }
    };

    // Chamar a função de buscar perfis quando o componente for carregado
    useEffect(() => {
        fetchPerfis();
    }, []);

    return (
        <>
            <div className={style.loginContainer}>
                <div className={style.logo}>
                    <img src={logoSrc} alt="Logo" title="Indie Comics" key={logoSrc}/>
                </div>
                <div className={style.content}>
                    <div className={style.imageSection}>
                        <img src="/images/Login.png" alt="Sobre" />
                    </div>
                    <div className={style.loginForm}>
                        <h2>Cadastro</h2>
                        {error && (
                            <div role="alert" className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className={style.form}>
                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                placeholder="Digite seu nome de Usuário"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="exemplo@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="senha">Senha</label>
                            <div className={style.inputSenhaContainer}>
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    id="senha"
                                    value={senha}
                                    placeholder="Digite sua Senha"
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                                <span onClick={toggleMostrarSenha} className={style.iconeSenha}>
                                    {mostrarSenha ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                                </span>
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="fotoPerfil">Foto de Perfil</label>
                                <input
                                    type="file"
                                    id="fotoPerfil"
                                    accept="image/*"
                                    onChange={handleFotoChange}
                                    className={style.fileInputStyled}
                                />
                            </div>
                            <div className={style.rememberMe}>
                                {perfis.map((perfil: any) => (
                                    <div key={perfil.id}>
                                        <input
                                            type="checkbox"
                                            id={`perfil-${perfil.id}`}
                                            checked={perfilId === perfil.id}
                                            onChange={() => setPerfilId(perfil.id)}
                                        />
                                        <label htmlFor={`perfil-${perfil.id}`}>{perfil.tipo}</label>
                                    </div>
                                ))}
                            </div>
                            <button type="submit">Cadastrar</button>
                        </form>
                        <Link href="/login" legacyBehavior>
                            <a className={style.cadastro}>Já tem Conta? Faça Login</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

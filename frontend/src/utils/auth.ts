import { parseCookies } from 'nookies';

interface DecodedToken {
  exp: number;
  [key: string]: any; // Para acomodar outras propriedades do token, se necessário
}

export const isAuthenticated = () => {
  const cookies = parseCookies();
  const token = cookies['obra.token'];
  
  // Verifica se o token existe e se não está expirado
  return token && !verificaTokenExpirado(token);
};

export const verificaTokenExpirado = (token: string | undefined): boolean => {
  if (!token) return true; // Se não houver token, considera como expirado

  try {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
    
    // Se o token tiver uma propriedade de expiração
    if (decodedToken && decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
      return decodedToken.exp < currentTime; // Verifica se o token está expirado
    }
    return false; // Se não houver expiração, o token é válido
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return true; // Se houver erro ao decodificar, considere o token como expirado
  }
};
function jwtDecode<T>(token: string): DecodedToken {
  throw new Error('Function not implemented.');
}


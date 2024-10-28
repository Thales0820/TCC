import { parseCookies } from 'nookies';
import { jwtDecode } from 'jwt-decode'; // Importa jwtDecode como named export

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const isAuthenticated = () => {
  const cookies = parseCookies();
  const token = cookies['obra.token'];
  
  return token && !verificaTokenExpirado(token);
};

export const verificaTokenExpirado = (token: string | undefined): boolean => {
  if (!token) return true;

  try {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
    
    if (decodedToken && decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    }
    return false;
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return true;
  }
};

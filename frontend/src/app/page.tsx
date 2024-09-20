// app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/home'); // Certifique-se de que está redirecionando para o caminho correto
  return null; // Não retorna nada, pois o redirecionamento ocorre
}

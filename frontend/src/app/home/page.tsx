"use client";
async function getObras() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/obras", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao buscar as obras");
  }

  return res.json();
}

export default async function Home() {
  const obras = await getObras();

  return (
    <div>
      <h1>Bem-vindo à página Home</h1>
      <ul>
        {obras.map((obra: any) => (
          <li key={obra.id}>
            <strong>Título:</strong> {obra.titulo}, <strong>Autor:</strong>{" "}
            {obra.usuario ? obra.usuario.nome : "Autor não encontrado"},
            <strong>Likes:</strong> {obra.likes}
          </li>
        ))}
      </ul>
    </div>
  );
}

document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    nombre: e.target.nombre.value,
    edad: e.target.edad.value,
  };

  const respuesta = await fetch(
    "https://api.github.com/repos/neodat1/encuesta-proyecto/contents/responses.json",
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  const json = await respuesta.json();
  const contenido = atob(json.content);
  const lista = JSON.parse(contenido);
  lista.push(datos);

  await fetch("https://api.github.com/repos/neodat1/encuesta-proyecto/contents/responses.json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer AQUÍ_SU_TOKEN_PERSONAL",
    },
    body: JSON.stringify({
      message: "Agregar respuesta",
      content: btoa(JSON.stringify(lista, null, 2)),
      sha: json.sha,
    }),
  });

  alert("¡Datos guardados!");
});

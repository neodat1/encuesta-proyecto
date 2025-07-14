document.getElementById('formulario').addEventListener('submit', async (e) => {
  e.preventDefault();

  const datos = {
    nombre: formulario.nombre.value,
    edad: formulario.edad.value,
    fecha: new Date().toISOString()
  };

  const archivo = 'responses-temp.json';
  const url = `https://api.github.com/repos/neodat1/encuesta-proyecto/contents/${archivo}`;

  const nuevoContenido = {
    mensaje: "Guardar temporalmente",
    content: btoa(JSON.stringify([datos])),
    committer: {
      name: "Encuesta Bot",
      email: "bot@example.com"
    }
  };

  try {
    const res = await fetch(url);
    const json = await res.json();
    nuevoContenido.sha = json.sha;
  } catch (err) {
    // No existe archivo, se crea nuevo
  }

  const respuesta = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`, // NO exponga token aquí
      Accept: 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(nuevoContenido)
  });

  if (respuesta.ok) {
    alert('Datos guardados correctamente');
  } else {
    alert('Error al guardar');
  }
});

document.getElementById('formulario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: formulario.nombre.value,
        edad: formulario.edad.value,
        fecha: new Date().toISOString()
    };

    const repo = "encuesta-proyecto";
    const owner = "neodat1";
    const archivo = "responses-temp.json"; // Archivo temporal que activa el flujo
    const token = process.env.GH_TOKEN;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${archivo}`;

    const nuevoContenido = Buffer.from(JSON.stringify(datos, null, 2)).toString('base64');

    try {
        // Verificamos si el archivo ya existe para obtener el SHA
        const resp = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        const existe = resp.status === 200;
        let sha = null;

        if (existe) {
            const json = await resp.json();
            sha = json.sha;
        }

        // Subir el nuevo archivo (o reemplazar si ya existía)
        const subida = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json"
            },
            body: JSON.stringify({
                message: "Nueva respuesta temporal",
                content: nuevoContenido,
                sha: sha
            })
        });

        if (subida.ok) {
            alert("¡Datos guardados!");
        } else {
            alert("Error al guardar los datos");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error.");
    }
});

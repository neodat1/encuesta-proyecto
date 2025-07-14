const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
        nombre: formulario.nombre.value,
        edad: formulario.edad.value,
        fecha: new Date().toISOString()
    };

    const repo = "encuesta-proyecto";
    const owner = "neodat1";
    const archivo = "responses.json";
    const token = "ghp_XoSMFjaMNWdLtW0sj20UCac13NqMH0TSRU2";  // ⚠️ Token aquí

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${archivo}`;

    try {
        // 1. Obtener contenido actual
        const respuesta = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        const contenido = await respuesta.json();
        const sha = contenido.sha;
        const actual = JSON.parse(atob(contenido.content));

        // 2. Agregar nueva entrada
        actual.push(datos);

        // 3. Subir nuevo contenido
        const nuevoContenido = btoa(JSON.stringify(actual, null, 2));

        const subir = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json"
            },
            body: JSON.stringify({
                message: "Agregar nueva respuesta",
                content: nuevoContenido,
                sha: sha
            })
        });

        if (subir.ok) {
            alert("✅ Datos enviados correctamente");
            formulario.reset();
        } else {
            alert("❌ Error al guardar en GitHub");
        }

    } catch (error) {
        console.error(error);
        alert("❌ Error en la operación");
    }
});

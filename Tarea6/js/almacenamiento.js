/**
 * DEBES ACTUALIZAR LA SIGUIENTE URL DE myjson.com  
 * añade el indicado en la tarea.
 */
let urlJSON = "https://api.myjson.com/bins/bitdq"; // REEMPLAZA POR TU URL

async function leerDatosDelJSON() {
    let response = await fetch(urlJSON);
    
    if(response.status != 200 ) return [];

    let arreglo =  await response.json()
    console.log(arreglo);
    return arreglo;
}

//se debe mandar siempre todo el arreglo de alumnos
//porque reemplaza el anterior archivo por el nuevo
function guardarEnJSON(datos) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open('PUT', urlJSON);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    // 4. Enviar solicitud a la red
    xhr.send([JSON.stringify(datos)]);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
        } else {
             console.log(xhr.responseText); // Significa que fue existoso
        }
    };
}
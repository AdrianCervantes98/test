/***********************************/
//       ACTUALIZACIÓN DE CONTENIDO EN EL DOM
/************************************/

let ventanaAdd = document.getElementById('modelId');
let ventanaBorrar = document.querySelector("#ventanaBorrar");
let formulario = ventanaAdd.querySelector('form');
let btCrear = document.getElementById("btCrear");
let btCloseModal = ventanaAdd.querySelector("button.close");
let btCloseErase = ventanaBorrar.querySelector("button.close");
let btSearch = document.getElementById("btBuscar");

inicializarEventos();


/***
 * En esta funcion se inicializan los eventos generales
 */
function inicializarEventos(){
    btCrear.addEventListener("click",updateFoto);
    formulario.querySelector('.radioB').onclick = updateFoto;
    formulario.onsubmit = submitForm;
    document.getElementById("respuestaBorrar").addEventListener('click', confirmRemove );
    //TODO-2d: eventListener al boton verde para que aparezcan los radio buttons
    btCrear.addEventListener("click", () => {
        formulario.querySelector(".radioB").hidden = false
        formulario.reset();
    });

    //TODO-3b: handler para el boton de buscar para la función clicBuscarAlumnos()
    
    //btSearch.addEventListener("click", clicBuscarAlumnos);
}


function confirmRemove(){
    console.log(event);
    //TODO-1b: esto se debe mandar llamar solo si se presionó el boton de borrar btBorrarAlumno, 
    //y cerrar ventana
    if(event.target.id == "btBorrarAlumno"){
        removeAlumno(this.dataset.id);
        btCloseErase.click();  
    }
    else
    btCloseErase.click();

}


/**
 * Actualizar la foto en la ventana Modal de añadir/editar
 */
function updateFoto(){
    console.log("updateFoto");
   let src = "https://randomuser.me/api/portraits/" 
   + (formulario.querySelector('input:checked').value == "F" ? "women" :
        "men") + "/" + contId+ ".jpg";
    ventanaAdd.querySelector('img').src = src;
}

/**
 * MOSTRAR A UN ALUMNO EN EL DOM
 * en caso de que no se requiera mandar true o no mandar el segundo argumento
 * en caso de que no se requiera clonar mandar false
 */
function renderAlumno(alumno, clonar) {
    //console.log(alumno);
    let model;

    if(clonar == undefined || clonar){
        model  = document.getElementById("modelo").cloneNode(true);
    }else{
        model = document.getElementById("al_"+alumno.id);
    }

    model.id = "al_" + alumno.id;
    model.hidden = false;
    model.querySelector(".nombre").textContent = alumno.nombre;
    model.querySelector(".carrera").textContent = "carrera: " + alumno.carrera;
    model.querySelector(".edad").textContent = "Edad: " + alumno.edad;
    model.querySelector(".calificación").textContent = "Calificación: " + alumno.calificación;
    model.querySelector("img").src = "https://randomuser.me/api/portraits/" + (alumno.sexo == "F" ? "women" :
        "men") + "/" + alumno.id + ".jpg";
    let btnRemove=model.querySelector('.btn.remove');
    btnRemove.onclick= ()=>clicRemoveAlumno(btnRemove);
    
    //TODO-2a: Asignar el evento de clicEditAlumno al boton de editar (lápiz) 
    model.querySelector('.btn.edit').onclick= clicEditAlumno;
    model.querySelector(".btn.edit").addEventListener("click", ()=> ventanaAdd.querySelector(".modal-title").innerHTML = "Editar Alumno");
    lista.appendChild(model);
    //console.log("Añadido ...");
}

/**
 * AL SOMETER FORMULARIO
 */

function submitForm(){
    console.log("fomulario submit");
    let nombre = formulario.querySelector('input.nombre').value;
    let edad = formulario.querySelector('input.edad').value;
    let carrera = formulario.querySelector('input.carrera').value;
    let cal = formulario.querySelector('input.calificación').value;
    let sexo = formulario.querySelector('input:checked').value;

    //TODO-2c: 5 PUNTOS: identifica si es modo edicion o modo creación 
    // se puede saber si estan o no ocultos los radio buttons
    // MANDA LLAMAR A updateAlumno(id, alumno) de alumnos.js, para ello debes crear el alumno primero
    //añadir solo si es creación
    if(formulario.querySelector(".radioB").hidden == false){
        añadirAlumno(nombre,carrera,edad,cal,sexo);
        formulario.reset();
        btCloseModal.click();
        return false;
    } else{
        let id = ventanaAdd.dataset.id;
        let updatedAl = new Alumno(nombre,carrera,edad,cal,sexo);
        updatedAl.id = id;
        updateAlumno(id, updatedAl);
        btCloseModal.click();
        contId--;
        location.reload();
    }
    
}

function eliminarAlumnoDOM(domID){
    document.getElementById(domID).remove();
}

 function clicRemoveAlumno(btnRemove){
   
    //obtener el elemento div con clase media más cercano al boton
    let alumnoCard = btnRemove.closest(".media");
    //Obtener el id
    let id = Number(alumnoCard.id.split('_').pop());
    console.log("borrar elemento "+ id);
    mostrarVentanaBorrar(id);
   
    
}

//TODO-2b: completa lo indicado
function clicEditAlumno(){
    //obten el id y solicita el objeto con getAlumno(id) de alumnos.js
    let id = this.closest(".media.col-8.mt-2").id.split("_").pop();
    let alToEdit = getAlumno(id);
    //llena todos los valores de la ventana modal (incluidos la parte del sexo)
    formulario.querySelector("input.nombre").value = alToEdit.nombre;
    formulario.querySelector("input.carrera").value = alToEdit.carrera;
    formulario.querySelector("input.edad").value = alToEdit.edad;
    formulario.querySelector("input.calificación").value = alToEdit.calificación;
    //oculta los radio buttons (radioB) para que no cambien la foto
    ventanaAdd.querySelector("img").src = "https://randomuser.me/api/portraits/" 
    + (alToEdit.sexo == "F" ? "women" : "men") + "/" + alToEdit.id+ ".jpg";
    formulario.querySelector(`input[value = "${alToEdit.sexo}"]`).checked = true;
    formulario.querySelector(".radioB").hidden = true;
    ventanaAdd.dataset.id = id;
    
    $("#modelId").modal("show"); //mostrar el modal, esto es JQuery
    
}


function mostrarVentanaBorrar(id){
    //si da aceptar se manda llamar
    console.log("Borrar id ="+id);
    let btRespuesta = document.getElementById("respuestaBorrar");
    btRespuesta.dataset.id= id;
    console.log(btRespuesta);
    
    //TODO-1a: clonar los datos y ponerlos en la ventana modal de borrado en la sección de info-alumno
    
    let vent = ventanaBorrar.querySelector(".modal-body.info-alumno");
    vent.innerHTML = "";
    let model = document.getElementById("al_"+id).cloneNode(true);    
    model.querySelector(".botones-edicion").hidden = true;
    vent.append(model);
    model.id="";
    
    
    document.querySelector("#btnVentanaBorrar").click(); //dar clic al boton oculto que abre la ventana de confirmación

}


function clicBuscarAlumnos(){
    //TODO-3c:
    //obtner caracteristicas y datos a buscar
    //si no se busca nada mostrar todos los alumnos
    //LLAMAR A filtrarAlumnos() guardarlo en un arreglo
    //mostrar solo alumnos que cumplen con las caracteristicas
}

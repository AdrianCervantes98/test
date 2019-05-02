'use strict';
/***********************************/
//          LÓGICA DEL NEGOCIO (DATOS EN EL ARREGLO DE ALUMNOS)
/************************************/

/**
 * VARIABLES GLOBALES
 */
let contId = 0; 
let alumnos = [];
inicializar();


/*******CONSTRUCTOR ALUMNO****/

function Alumno(nombre, carrera, edad, calificación, sexo) {
    this.id = contId++;
    this.nombre = nombre;
    this.carrera = carrera;
    this.edad = edad;
    this.calificación = calificación;
    this.sexo = sexo;
}

/*******INICIALIZAR ALUMNOS***********/
 async function inicializar() {
    alumnos = await leerDatosDelJSON();
    if(alumnos.length==0){ //si ocurrió un error al cargar el JSON
        alumnos = [];
        console.log("DEBES CAMBIAR LA URL DE ALMACENAMIENTO.JS!!!!");
        alumnos.push(new Alumno("Alicia", "ISC", 20, 95, "F"));
        alumnos.push(new Alumno("Alberto", "ISI", 22, 87, "M"));
        alumnos.push(new Alumno("Miriam", "ISC", 23, 92, "F"));
    }else{
        //update contId, máximo valor de id +1
        contId = Math.max.apply(Math, alumnos.map(al=>al.id));
        contId++;
    }

    let lista = document.getElementById("lista");
    for (let i = 0; i < alumnos.length; i++) {
        renderAlumno(alumnos[i]);
    }
    lista.children[0].hidden = true;
    lista.children[1].hidden = true;
   
}

/**
 *  AÑADIR A UN ALUMNO AL ARREGLO Y AL DOM SI SU NOMBRE ES DIFERENTE
 */
function añadirAlumno(nombre, carrera, edad, calificación, sexo) {
    console.log("Entra a añadir alumno");
    let al = alumnos.find(alumno => alumno.nombre.toUpperCase() == nombre.toUpperCase());
    if (!al) {
        console.log("Añadiendo alumno ...");
        let alumno = new Alumno(nombre, carrera, edad, calificación, sexo);
        alumnos.push(alumno);
        renderAlumno(alumno);
        guardarEnJSON(alumnos); //esto guarda a todos los alumnos en el JSON en el servidor
    } else {
        let htmlAlert =
            `<div class=" col-8 alert alert-warning alert-dismissible fade show" role="alert" >
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <strong class="nota-alert">Alumno ya existe</strong> 
                        </div>`;
        lista.insertAdjacentHTML('beforebegin', htmlAlert);

    }
}

/** ELIMINAR ALUMNO */
function removeAlumno(id) {
    let pos = alumnos.findIndex(al=> al.id == id);
    if(pos>=0){
        eliminarAlumnoDOM('al_'+alumnos[pos].id);
        alumnos.splice(pos,1);
        console.log("alumno eliminado " + id);
        guardarEnJSON(alumnos); //esta línea al finalizar la tarea no debe estar comentada, solo comentala para hacer pruebas sin que se borren los datos en el JSON
    }else{
        alert(`Alumno con id = ${id} no existe!`);
    }
    
}

/***OBTENER DATOS DE ALUMNO ******/
function getAlumno(id){
    //TODO-2b:  regresa el objeto del alumno con el id indicado
    return alumnos[alumnos.findIndex(a=> a.id==id)];
}


/***ACTUALIZAR DATOS DE ALUMNO */
function updateAlumno(id, alumno) {
    //TODO-2c: 15 PUNTOS
    //actualiza los datos siempre que el nombre no exista EN UN ID DIFERENTE de lo contrario 
    //OJO: QUE EL NOMBRE NO EXISTA EN UN ID DIFERENTE
    //SI NO MUESTRA UN MENSAJE DE QUE NOMBRE YA EXISTE  (basate en el de añadirAlumno())
    //GUARDAR LOS DATOS EN EL JSON  Y MANDA LLAMAR RENDERIZAR  renderAlumno(alumno, false)
    let find = alumnos.find(xd => xd.nombre.toUpperCase() == alumno.nombre.toUpperCase() && xd.id != id);
    if(!find){
        let i = alumnos.findIndex(l => l.id == id);
        alumnos[i] = alumno;
        guardarEnJSON(alumnos);
        renderAlumno(alumno, false);
        
    } else{
        let htmlAlert =
            `<div class=" col-8 alert alert-warning alert-dismissible fade show" role="alert" >
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <strong class="nota-alert">Nombre ya existe</strong> 
                        </div>`;
        lista.insertAdjacentHTML('beforebegin', htmlAlert);
    }
}

//TODO-3a
function filtrarAlumnos(name, degree, grade){ //falta poner argumentos
    //debe regresar un arreglo de alumn((os que CUMPLEN CON TODAS las especificaciones de la búsqueda  
    let filteredArray =  new Array();
    if(name){
        let fName = document.getElementById("searchNombre").value;
        for (let i = 0; i < alumnos.length ; i++){
            if(alumnos[i].nombre.toUpperCase().includes(fName.toUpperCase())){
                filteredArray.push(alumnos[i]);
            }
        }
    }
    if(degree){
        let fDegree = document.getElementById("searchCarrera").value;
        for (let i = 0; i < alumnos.length ; i++){
            if(alumnos[k].carrera.toUpperCase().includes(fDegree.toUpperCase())){
                filteredArray.push(alumnos[i]);
            }
        }
    }
    if(grade){
        let fMinGrade = document.getElementById("minCalif").value;
        let fMaxGrade = document.getElementById("maxCalif").value;
        for (let i = 0; i < alumnos.length ; i++){
            if(parseFloat(fMinGrade) != NaN && parseFloat(fMaxGrade) != NaN){
                if(parseFloat(alumnos[i].calificación) < parseFloat(fMinGrade) || parseFloat(alumnos[i].calificación) > parseFloat(fMaxGrade)){
                    filteredArray.push(alumnos[i]);
                }
            }else if(parseFloat(fMinGrade) != NaN){
                if(parseFloat(alumnos[i].calificación) < parseFloat(fMinGrade)){
                    filteredArray.push(alumnos[i]);
                }
            }else if(parseFloat(fMaxGrade) != NaN){
                if(parseFloat(alumnos[i].calificación) > parseFloat(fMaxGrade)){
                    filteredArray.push(alumnos[i]);
                }
            }
        }
    }
    return filteredArray; 
}


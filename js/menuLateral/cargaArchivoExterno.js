//CARGA DE ARCHIVOS EXTERNOS:
/* Se puede realizar desde el input de selección "Examinar"; o arrastrando el archivo al div "zonaArrastrar" */
var tamanoMaximoArchivo = 99999999;

//1º FUNCIÓN PARA CARGAR ARCHIVOS DESDE EL INPUT "Examinar"
function CargarArchivoExternoExaminar(evt) {
  var files = evt.target.files; // FileList object
  //Recorrer todos los archivos cargados a la vez:
  for (var i = 0, f; f = files[i]; i++) {
    //A) Comprobar el tamaño del fichero y sólo permitir la carga si es menor de lo indicado en la variable "tamanoMaximoArchivo":
    if (f.size < tamanoMaximoArchivo){
      //B) Comprobar el tipo de formato del archivo:
      if (f.name.indexOf('.geojson')!= -1){
        //Creación del lector de archivos:
        var reader = new FileReader();
        reader.readAsBinaryString(f);
        //Ejecución del lector de archivos:
        reader.onload = (function(theFile) {
          return function(e) {
            var data = JSON.parse(e.target.result);
            var nombreArchivo = theFile.name;
            //Ejecutar la función cargarCapa():
            CargarCapa('geojson','','','menuBusqueda',data,nombreArchivo);
          };
        })(f);
      } else {
        alert("No es un archivo Geojson.");
      }
    } else {
      alert("Archivo demasiado pesado.");
    }
  }
}

//Añadir el "listener" al cuadro de selección de archivo a cargar:
document.getElementById('selectorArchivos').addEventListener('change', CargarArchivoExternoExaminar, false);

//2º FUNCIÓN PARA CARGAR ARCHIVOS AL ARRASTRARLOS AL DIV "zonaArrastrar"
function CargarArchivoExternoArrastrar(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var files = evt.dataTransfer.files;
  //Recorrer todos los archivos cargados a la vez:
  for (var i = 0, f; f = files[i]; i++) {
    //A) Comprobar el tamaño del fichero y sólo permitir la carga si es menor de lo indicado en la variable "tamanoMaximoArchivo":
    if (f.size < tamanoMaximoArchivo){
      //B) Comprobar el tipo de formato del archivo:
      if (f.name.indexOf('.geojson')!= -1){
        //Creación del lector de archivos:
        var reader = new FileReader();
        reader.readAsBinaryString(f);
        //Ejecución del lector de archivos:
        reader.onload = (function(theFile) {
          return function(e) {
            var data = JSON.parse(e.target.result);
            var nombreArchivo = theFile.name;
            //Ejecutar la función cargarCapa():
            CargarCapa('geojson','','','menuBusqueda',data,nombreArchivo);
          };
        })(f);
      } else {
        alert("No es un geojson.");
      }
    } else {
      alert("Archivo demasiado pesado");
    }
  }
}

//Función necesaria para que no se habra una ventana nueva con la lectura del archivo cargado:
function GestionCargaArchivoExternoArrastrar(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

//Añadir los "listeners" al div para arrastrar archivos:
document.getElementById('zonaArrastrar').addEventListener('dragover', GestionCargaArchivoExternoArrastrar, false);
document.getElementById('zonaArrastrar').addEventListener('drop', CargarArchivoExternoArrastrar, false);

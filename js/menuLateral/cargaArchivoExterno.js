//CARGA DE ARCHIVOS EXTERNOS:
/* Se puede realizar desde el input de selección "Examinar"; o arrastrando el archivo al div "zonaArrastrar" */
var tamanoMaximoArchivo = 99999999;

//1º FUNCIÓN PARA CARGAR ARCHIVOS DESDE EL INPUT "Examinar"
function CargarArchivoExternoExaminar(evt) {
  var files = evt.target.files; // FileList object
    console.log(files);
  //Recorrer todos los archivos cargados a la vez:
  for (var i = 0, f; f = files[i]; i++) {

    //A) Comprobar el tamaño del fichero y sólo permitir la carga si es menor de lo indicado en la variable "tamanoMaximoArchivo":
    if (f.size < tamanoMaximoArchivo){
      //B) Comprobar el tipo de formato del archivo:
      //B1) Archivo geojson
      if (f.name.indexOf('.geojson')!= -1){
        //Creación del lector de archivos:
        var reader = new FileReader();
        reader.readAsBinaryString(f);
        //Ejecución del lector de archivos:
        reader.onload = (function(theFile) {
          return function(e) {
            var data = JSON.parse(e.target.result);
            //Crear el nombre que se utilizará para la capa (quitando la extensión):
            var nombreArchivoConExtension = theFile.name;
            var nombreArchivo = nombreArchivoConExtension.slice(0, nombreArchivoConExtension.indexOf('.'));
            //Ejecutar la función cargarCapa():
            console.log(data);
            CargarCapa('geojson','','','menuBusqueda',data,nombreArchivo);
          };
        })(f);
        //B2) Archivo zip (6 o 7 archivos para shapefile comprimidos)
      } else if ((f.name.indexOf('.zip')!= -1) && (f.type == "application/zip")) {
        //Crear el nombre que se utilizará para la capa (quitando la extensión):
        var nombreArchivoConExtension = f.name;
        var nombreArchivo = nombreArchivoConExtension.slice(0, nombreArchivoConExtension.indexOf('.'));
        //Se ejecuta la función para convertir desde .zip (con los 7 archivos del shp comprimidos) hasta geojson:
        loadshp({
          url: f,
          encoding: 'UTF-8',
          EPSG: 4326
        }, function(data) {
          console.log(data);
        //Ejecutar la función cargarCapa(), siendo el tipo de archivo geojson:
          CargarCapa('geojson','','','menuBusqueda',data,nombreArchivo);
      });
      } else {
        alert("No es un formato de archivo válido (geojson, shapefile).");
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
      //B1) Archivo geojson
      if (f.name.indexOf('.geojson')!= -1){
        //Creación del lector de archivos:
        var reader = new FileReader();
        reader.readAsBinaryString(f);
        //Ejecución del lector de archivos:
        reader.onload = (function(theFile) {
          return function(e) {
            var data = JSON.parse(e.target.result);
            //Crear el nombre que se utilizará para la capa (quitando la extensión):
            var nombreArchivoConExtension = theFile.name;
            var nombreArchivo = nombreArchivoConExtension.slice(0, nombreArchivoConExtension.indexOf('.'));
            //Ejecutar la función cargarCapa():
            CargarCapa('geojson','','','menuBusqueda',data,nombreArchivo);
          };
        })(f);
        //B2) Archivo zip (6 o 7 archivos para shapefile comprimidos)
      } else if ((f.name.indexOf('.zip')!= -1) && (f.type == "application/zip")) {
        //Crear el nombre que se utilizará para la capa (quitando la extensión):
        var nombreArchivoConExtension = f.name;
        var nombreArchivo = nombreArchivoConExtension.slice(0, nombreArchivoConExtension.indexOf('.'));
        //Se ejecuta la función para convertir desde .zip (con los 7 archivos del shp comprimidos) hasta geojson:
        loadshp({
          url: f,
          encoding: 'UTF-8',
          EPSG: 4326
        }, function(data) {
          console.log(data);
        //Ejecutar la función cargarCapa(), siendo el tipo de archivo geojson:
          CargarCapa('geojson','','','menuBusqueda',data,nombreArchivo);
        });
      } else {
        alert("No es un formato de archivo válido (geojson, shapefile).");
      }
    } else {
      alert("Archivo demasiado pesado.");
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

function handleFileSelect(evt) {

    var files = evt.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      if (f.name.indexOf('.geojson')!= -1){
        console.log("Sí es un geojson.");

        var reader = new FileReader();

        // Read in the image file as a data URL.
        reader.readAsBinaryString(f);

    // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {

          console.log(e.target.result);
          var data = JSON.parse(e.target.result);
          var nombreArchivo = theFile.name;
          console.log(data);
          console.log(nombreArchivo);
          AnadirGeojson(data,nombreArchivo);
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = [escape(theFile.name)].join('');
          document.getElementById('list').insertBefore(span, null);
        };
      })(f);





      } else {
        console.log("No es un geojson.");
      }
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);

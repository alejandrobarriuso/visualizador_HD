//Array de temáticas con sus capas a cargar:
var arrayObjetosTematicas = [
  {
    "id": "Arq",
    "nombre": "Arqueología",
    "nombre_en": "Archeology",
    "color_fondo": "#FFB299",
    "color_letra_borde": "#DF3A2C",
    "capas": [
      {
        "nombre": "Carbono 14",
        "nombre_en": "Radiocarbon data",
        "tipo": "wms",
        "ruta": "http://www.idearqueologia.org/idearq/wms?",
        "id": "idearq_c14"
      },{
        "nombre": "Arte rupestre levantino",
        "nombre_en": "Levantine cave art sets",
        "tipo": "wms",
        "ruta": "http://www.idearqueologia.org/idearq/wms?",
        "id": "idearq_cprl"
      },{
        "nombre": "Isótopos",
        "nombre_en": "Isotopes",
        "tipo": "wms",
        "ruta": "http://www.idearqueologia.org/idearq/wms?",
        "id": "idearq_dimp"
      }
    ]
  }, {
    "id": "His",
    "nombre": "Historia",
    "nombre_en": "History",
    "color_fondo": "#FFFF99",
    "color_letra_borde": "#F3AB00",
    "capas": [
      {
        "nombre": "HISDIMAD Ferrocarriles",
        "nombre_en": "HISDIMAD Railways",
        "tipo": "wms",
        "ruta": "http://idehistoricamadrid.org/USIG/services/WMS_Facundo/mapserver/WMSServer?",
        "id": "11"
      },{
        "nombre": "HISDIMAD Vías Públicas",
        "nombre_en": "HISDIMAD Public Roads",
        "tipo": "wms",
        "ruta": "http://idehistoricamadrid.org/USIG/services/WMS_Facundo/mapserver/WMSServer?",
        "id": "17"
      }
    ]
  }, {
    "id": "Dem",
    "nombre": "Demografía",
    "nombre_en": "Demography",
    "color_fondo": "#AAEEC8",
    "color_letra_borde": "#008A47",
    "capas": [
    ]
  }, {
    "id": "Pol",
    "nombre": "Políticas públicas",
    "nombre_en": "Public politics",
    "color_fondo": "#E9A5E9",
    "color_letra_borde": "#7D3280",
    "capas": [
      {
        "nombre": "SIGMAYORES Centros de Servicios Sociales",
        "nombre_en": "SIGMAYORES Social Service Centres",
        "tipo": "wms",
        "ruta": "http://www.sigmayores.csic.es/ArcGIS/services/Rec-Sociales/MapServer/WMSServer?",
        "id": "US.socialService"
      },{
        "nombre": "SIGMAYORES Residencias",
        "nombre_en": "SIGMAYORES Housing",
        "tipo": "wms",
        "ruta": "http://www.sigmayores.csic.es/ArcGIS/services/Rec-Sociales/MapServer/WMSServer?",
        "id": "US.housing"
      },{
        "nombre": "SIGMAYORES Centros INSS",
        "nombre_en": "SIGMAYORES Specialized Administration Offices",
        "tipo": "wms",
        "ruta": "http://www.sigmayores.csic.es/ArcGIS/services/Rec-Sociales/MapServer/WMSServer?",
        "id": "US.specializedAdministrationOffice"
      },{
        "nombre": "SIGMAYORES Centros de día",
        "nombre_en": "SIGMAYORES Specialized Service Of Social Protection",
        "tipo": "wms",
        "ruta": "http://www.sigmayores.csic.es/ArcGIS/services/Rec-Sociales/MapServer/WMSServer?",
        "id": "US.specializedServiceOfSocialProtection"
      },{
        "nombre": "SIGMAYORES Consultorios",
        "nombre_en": "SIGMAYORES General Medical Services",
        "tipo": "wms",
        "ruta": "http://www.sigmayores.csic.es/ArcGIS/services/Rec-Sanitarios/MapServer/WMSServer?",
        "id": "US.generalMedicalService"
      },{
        "nombre": "SIGMAYORES Centros de salud",
        "nombre_en": "SIGMAYORES Specialized Medical Services",
        "tipo": "wms",
        "ruta": "http://www.sigmayores.csic.es/ArcGIS/services/Rec-Sanitarios/MapServer/WMSServer?",
        "id": "US.specializedMedicalService"
      },{
        "nombre": "SIGMAYORES Hospitales",
        "nombre_en": "SIGMAYORES Hospital Services",
        "tipo": "wms",
        "ruta": "http://www.sigmayores.csic.es/ArcGIS/services/Rec-Sanitarios/MapServer/WMSServer?",
        "id": "US.hospitalService"
      }
    ]
  }, {
    "id": "Eco",
    "nombre": "Economía y Geografía Aplicadas",
    "nombre_en": "Applied Economy and Geography",
    "color_fondo": "#B9DAF7",
    "color_letra_borde": "#006DB4",
    "capas": [
    ]
  }, {
    "id": "Arq",
    "nombre": "Arqueología",
    "nombre_en": "Archeology",
    "color_fondo": "#FFB299",
    "color_letra_borde": "#DF3A2C",
    "capas": [
    
    ]
  }, {
    "id": "His",
    "nombre": "Historia",
    "nombre_en": "History",
    "color_fondo": "#FFFF99",
    "color_letra_borde": "#F3AB00",
    "capas": [

    ]
  }, {
    "id": "Dem",
    "nombre": "Demografía",
    "nombre_en": "Demography",
    "color_fondo": "#AAEEC8",
    "color_letra_borde": "#008A47",
    "capas": [
    ]
  }, {
    "id": "Pol",
    "nombre": "Políticas públicas",
    "nombre_en": "Public politics",
    "color_fondo": "#E9A5E9",
    "color_letra_borde": "#7D3280",
    "capas": [

    ]
  }, {
    "id": "Eco",
    "nombre": "Economía y Geografía Aplicadas",
    "nombre_en": "Applied Economy and Geography",
    "color_fondo": "#B9DAF7",
    "color_letra_borde": "#006DB4",
    "capas": [
    ]
  }
];

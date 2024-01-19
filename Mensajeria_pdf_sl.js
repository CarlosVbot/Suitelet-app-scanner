/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * //TODO: Update line newPdfFile.folder = 10096;
 */
define(
    [
      "N/https",
      "N/record",
      "N/search",
      "N/encode",
      "N/format",
      "N/runtime",
      "N/render",
      "N/file",
      "N/url",
      'N/task',
    ],
    /**
   * @param{https} https
   * @param{record} record
   * @param{search} search
   * @param{encode} encode
   * @param{format} format
   * @param{runtime} runtime
   * @param{render} render
   * @param{render} render
   * @param{file} file
   * @param{url} url
   */
    (https, record, search, encode, format, runtime, render, file, url, task) => {
      /**
           * Defines the Suitelet script trigger point.
           * @param {Object} scriptContext
           * @param {ServerRequest} scriptContext.request - Incoming request
           * @param {ServerResponse} scriptContext.response - Suitelet response
           * @since 2015.2
           */
      const onRequest = scriptContext => {
        if (scriptContext.request.method === "GET") {
          try {
            var response = scriptContext.response;
            var Mensaje_id = scriptContext.request.parameters.Mensaje_id;
            log.debug("Mensaje_id", Mensaje_id);
           
               var info_obj =  obtener_informacion(Mensaje_id)
              var info = info_obj.respuesta;
               var info_detalle = info_obj.detalle;
                  var content = '' 
                  content += crear_head(info)
                  content += crear_body(info)
                  content += crear_footer(info)

                  var fechaString = info[0].fecha;

                  var partesFecha = fechaString.split('/');

                  var dia = parseInt(partesFecha[0], 10);
                  var mes = parseInt(partesFecha[1], 10);
                  var año = parseInt(partesFecha[2], 10);
                  
                  var date = new Date(año, mes - 1, dia);
 
                  log.debug("date", date);

                  var pdfFile = render.xmlToPdf({
                    xmlString: content
                });
                  var day = date.getDate();
                  var month = date.getMonth() + 1;
                  var year = date.getFullYear();

                  pdfFile.folder = 19711;
                  pdfFile.name =  info[0].mensajero + '-' + year+'-' +month+'-' +day+ '-'+'ID'+ Mensaje_id +".pdf";
                  var PDFID = pdfFile.save();

                  var Mensajeria = record.load({
                    type: 'customrecord_sm_mensajeria',
                    id: Mensaje_id,
                    isDynamic: true,
                });

                Mensajeria.setValue({
                  fieldId: 'custrecord_sm_document_list',
                  value: PDFID
              });
                 Mensajeria.save();

                 manifiesto_update_date(Mensaje_id)
  
  
            var invoicePdf = response.renderPdf({
              xmlString: content,
            });
          } catch (e) {
            log.error("Error onRequest()", e);
          }
        }
      };
  
      function crear_head(info) {
        var estilo = crear_estilo();
        var head;
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"] 
      var date = new Date();
      var day = date.getDate();
      var mounth = date.getMonth();
      var year = date.getFullYear();


        var fecha_hoy = day + " de " + meses[mounth] + " del " + year;
        log.debug("fecha_hoy", fecha_hoy);
        head = `<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
        <pdf>
        <head>
        <macrolist>
        <macro id="myfooter">
        <table style= " width: 100%;">
         <tr >
         <td style= "  border: none;" ><p style = "text-align: center; width: 100%; font-size: 9px;" ><b>Firma</b></p></td>
         </tr>
         <tr style= "  border: none; margin-top 30px;">
         <td style= "  border: none; " ><p style = "text-align: center; width: 100%; font-size: 9px;" ><b>_____________________________________</b></p></td>
          </tr>
         <tr >
         <td style= "  border: none;" ><p style = "text-align: center; width: 100%; font-size: 9px;" ><b>${info[0].mensajero}</b></p></td>
        </tr>
        <tr >
        <td style= "  border: none;" ><p style = "text-align: right; width: 100%; font-size: 9px;" ><b>${info.length}</b></p></td>
       </tr>
       <tr >
       <td style= "  border: none;" ><p style = "text-align: right; width: 100%; font-size: 9px;" ><b>SC-P-EXP002-F01/REV00</b></p></td>
      </tr>
      <tr >
      <td style= "  border: none;" ><p style = "text-align: right; width: 100%; font-size: 9px;" ><b>Fecha de impresion: ${fecha_hoy}</b></p></td>
     </tr>
    </table>
 
        </macro>
        </macrolist>
        <style>
        `
  
        head += estilo;
        head += `</style>

        </head>`
  
        log.debug("head", head);
        return head ;
      }
  
      function crear_estilo() {
        var estilo = `  
              
        `
        return estilo;
      }
  
      function crear_body(info){
          var tabla = crear_body_tablas(info);
          let imagen= file.load({id:98590});
          let urlAux= imagen.url;
          let urlAux1=urlAux.split('&');
          let url='';
          url=urlAux1.join('&amp;');
          //var url = 'https://6237355-sb2.app.netsuite.com/core/media/media.nl?id=160216&c=6237355_SB2&h=KI8-zQB_ZajAlFPRfKaT3Unsnj8oEJr4UEEdU7kqtQjAim9o';
         // var  urlarray  = url.split('&')
         // var correct = urlarray[0] +'&amp;'+ urlarray[1] +'&amp;'+urlarray[2]
          log.debug("url", url);
          var body = `<body footer="myfooter"  footer-height="26mm" >
          <table style= " width: 100%;">
          <tr >
          <td style= "  border: none;" ><img style= " width: 25%; height: 25%;" src="${url}"></img></td>
          <td style= "  border: none;" ><p style = "text-align: left; width: 100%; font-size: 25px;" ><b>Servicios Ambientales Mexicanos, S.A. de C.V.</b></p></td>
          </tr>
          <tr >
          <td style= "  border: none;" colspan = "2"><p style = "text-align: center; width: 100%; font-size: 18px;" ><b>Relación de Cartas</b></p></td>
          </tr>
          <tr >
          <td style= "  border: none;" colspan = "2"><p style = "text-align: center; width: 100%; font-size: 15px;" ><b></b></p></td>
          </tr>
          </table>`;
          body += tabla;
          body += `</body>`;
          log.debug("body", body);
          return  body;
      }

      function crear_body_tablas(info){

        var tabla ='';

        for(var i = 0; i < info.length; i++){
            var cliente = info[i].cliente;
            var cliente_amp = cliente.replace("&", "&amp;");
          tabla += ` <tr   >
          <td  ><p style = "text-align: center;width: 100%; font-size: 10px;" >${info[i].carta}</p></td>
          <td ><p style = "text-align: center;width: 100%; font-size: 10px;">${cliente_amp}</p></td>

          <td ><p style = "text-align: center;width: 100%; font-size: 10px;">${info[i].location}</p></td>
          <td ><p style = "text-align: center;width: 100%; font-size: 10px;">${info[i].cargamento}</p></td>

          </tr>
          `
        }


      var tabla_select = `
      <table style= "width: 50%;">
      <tr  >
      <td  ><p style = "text-align: center;width: 100%;" ><b>${info[0].padre}</b> </p></td>
      <td  ><p style = "text-align: center;width: 100%;" ><b>${info[0].fecha}</b> </p></td>
      <td  ><p style = "text-align: center;width: 100%;" ><b>${info[0].mensajero}</b> </p></td>
      </tr>
      </table> 
          <table style= "width: 100%;">
          <tr  style=" border-bottom: 1px;" >
              <td  ><p style = "text-align: center;width: 100%;" ><b>Carta</b> </p></td>
              <td ><p style = "text-align: center;width: 100%;"><b>Cliente</b></p></td>
 
              <td ><p style = "text-align: center;width: 100%;"><b>Destinatario</b></p></td>
              <td ><p style = "text-align: center;width: 100%;"><b>Cargamento</b></p></td>

          </tr>
          ${tabla}
          </table> 
         `
          return tabla_select;
      }
  
      function crear_footer() {
          var footer = `
          </pdf>
          `
          
          log.debug("footer", footer);
          return footer;
      }
  
      function obtener_informacion(id){
        try {

          var customrecord_sm_detalle_mensajeriaSearchObj = search.create({
            type: "customrecord_sm_detalle_mensajeria",
            filters:
            [
               ["custrecord_sm_sublista_padre.internalidnumber","equalto",id]
            ],
            columns:
            [
               "internalid",
               "custrecord_sm_perfil_reg",
               "custrecord_sm_carta_reg",
               "custrecord_sm_cliente",
               "custrecord_sm_location_reg",
               "custrecord_sm_cragamento_reg",
               "custrecord_sm_manifiesto",
               "custrecord_sm_clase_reg",
                "custrecord_sm_remplazo_txt",
               "custrecord_sm_sublista_padre",
               search.createColumn({
                  name: "custrecord_sm_mensajero_name",
                  join: "CUSTRECORD_SM_SUBLISTA_PADRE"
               }),
               search.createColumn({
                  name: "custrecord_sm_fecha_reg",
                  join: "CUSTRECORD_SM_SUBLISTA_PADRE"
               }),
               search.createColumn({
                  name: "contact",
                  join: "CUSTRECORD_SM_CLIENTE"
               })
            ]
         });
        var respuesta = []
            var array_control = []
         var array_respuesta_detalle = []
         customrecord_sm_detalle_mensajeriaSearchObj.run().each(function(result){
             var nombre = result.getText({name: 'custrecord_sm_carta_reg'})
             var remplazo = result.getValue({name: 'custrecord_sm_remplazo_txt'})
             if(remplazo){
                    nombre =  remplazo
             }
             if(array_control.indexOf(result.getValue({name: 'custrecord_sm_carta_reg'})) == -1){
                 respuesta.push({
                     id: result.getValue({name: 'internalid'}),
                     carta: nombre,
                     cliente: result.getText({name: 'custrecord_sm_cliente'}),
                     location: result.getText({name: 'custrecord_sm_location_reg'}),
                     cargamento: result.getText({name: 'custrecord_sm_cragamento_reg'}),
                     perfil: result.getValue({name: 'custrecord_sm_perfil_reg'}),
                     manifiesto: result.getValue({name: 'custrecord_sm_manifiesto'}),
                     mensajero: result.getText({name: 'custrecord_sm_mensajero_name', join: "CUSTRECORD_SM_SUBLISTA_PADRE"}),
                     fecha: result.getValue({name: 'custrecord_sm_fecha_reg', join: "CUSTRECORD_SM_SUBLISTA_PADRE"}),
                     padre : result.getText({name: 'custrecord_sm_sublista_padre'}),

                 })
                    array_control.push(result.getValue({name: 'custrecord_sm_carta_reg'}))
             }
             array_respuesta_detalle.push({
                 id: result.getValue({name: 'internalid'}),
                 carta: nombre,
                 cliente: result.getText({name: 'custrecord_sm_cliente'}),
                 location: result.getText({name: 'custrecord_sm_location_reg'}),
                 cargamento: result.getText({name: 'custrecord_sm_cragamento_reg'}),
                 perfil: result.getValue({name: 'custrecord_sm_perfil_reg'}),
                 manifiesto: result.getValue({name: 'custrecord_sm_manifiesto'}),
                 mensajero: result.getText({name: 'custrecord_sm_mensajero_name', join: "CUSTRECORD_SM_SUBLISTA_PADRE"}),
                 fecha: result.getValue({name: 'custrecord_sm_fecha_reg', join: "CUSTRECORD_SM_SUBLISTA_PADRE"}),
                 padre : result.getText({name: 'custrecord_sm_sublista_padre'}),

             })
            return true;
         });
         log.debug("respuesta", respuesta);
            log.debug("array_respuesta_detalle", array_respuesta_detalle);
          return {
              respuesta: respuesta,
                detalle: array_respuesta_detalle
          };
  
        } catch (error) {
          log.debug("error", error);
        }
      }

      function manifiesto_update_date(Mensaje_id){
        try {


            var mrTask = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_sm_map_date_manifiest' ,
                deploymentId: 'customdeploy_sm_map_date_manifiest',
                params: {
                    custscript_sm_mensajeria_id:  Mensaje_id
                }
            });

            var mrTaskId = mrTask.submit();
         

        } catch (error) {
          log.debug("error", error);
        }
      }
  
      return { onRequest };
    }
  );
  
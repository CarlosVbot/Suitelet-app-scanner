/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */

 define(
    [
      "N/ui/serverWidget",
      "N/search",
      "N/https",
      "N/record",
      "N/url",
      "N/runtime",
      "N/redirect",
        "N/format",
      "N/task"
    ],
    function(serverWidget, search, https, record, url, runtime, redirect, format, task) {
      function onRequest(context) {
        try {
            if (context.request.parameters.imprimir_id){
                var form = serverWidget.createForm({
                    title: "Cartas creadas correctamente"
                });
                var data_record = record.load({
                    type: "customrecord_sm_data_json_mensajeria",
                    id: context.request.parameters.imprimir_id
                });

                var data_string = data_record.getValue("custrecord_sm_str_data_json");
                log.debug("data_string", data_string)

                var data_json = JSON.parse(data_string);

                var lista_cartas = data_json.cartas;

                var Mensaje = record.create({
                    type: "customrecord_sm_mensajeria",
                    isDynamic: true
                });

                Mensaje.setValue({
                    fieldId: "custrecord_sm_mensajero_name",
                    value: data_json.mensajero
                });
                log.debug("lista_cartas.mensajero", data_json.mensajero)

                var fecha_string = data_json.fecha;
                var date_ = new Date(fecha_string);
                var fecha_t = fecha_string.split("T");
                var fecha_n = fecha_t[0];

                var fecha_arr = fecha_n.split("-");
                var fecha = fecha_arr[2] + "/" + fecha_arr[1] + "/" + fecha_arr[0];
                log.debug("lista_cartas.fecha11", fecha)
                var fecha_format = format.parse({
                    value: date_,
                    type: format.Type.DATE
                });

                Mensaje.setValue({
                    fieldId: "custrecord_sm_fecha_reg",
                    value: fecha_format
                });


                var Mensaje_id = Mensaje.save();

                for (var i = 0; i < lista_cartas.length; i++) {
                    var mensaje_detalle = record.create({
                        type: "customrecord_sm_detalle_mensajeria",
                        isDynamic: true
                    });
                    mensaje_detalle.setValue({
                        fieldId: "custrecord_sm_sublista_padre",
                        value: Mensaje_id
                    });
                    mensaje_detalle.setValue({
                        fieldId: "custrecord_sm_carta_reg",
                        value: lista_cartas[i].carta
                    });
                    mensaje_detalle.setValue({
                        fieldId: "custrecord_sm_cliente",
                        value: lista_cartas[i].cliente
                    });
                    mensaje_detalle.setValue({
                        fieldId: "custrecord_sm_location_reg",
                        value: lista_cartas[i].destinatario
                    });
                    mensaje_detalle.setValue({
                        fieldId: "custrecord_sm_cragamento_reg",
                        value: lista_cartas[i].cargamento
                    });
                    mensaje_detalle.setValue({
                        fieldId: "custrecord_sm_manifiesto",
                        value: lista_cartas[i].manifiesto
                    });
                    mensaje_detalle.setValue({
                        fieldId: "custrecord_sm_clase_reg",
                        value: lista_cartas[i].clase
                    });
                    mensaje_detalle.setValue({
                        fieldId: "custrecord_sm_perfil_reg",
                        value: lista_cartas[i].perfil
                    });
                    if(lista_cartas[i].remplazo){
                        mensaje_detalle.setValue({
                            fieldId: "custrecord_sm_remplazo_txt",
                            value: lista_cartas[i].remplazo
                        });
                    }

                    var mensaje_detalle_id = mensaje_detalle.save();

                }
                var registro = form.addField({
                    id: "custpage_reg_carta",
                    type: serverWidget.FieldType.INTEGER,
                    label: "Registro de cartas",
                });

                registro.defaultValue = Mensaje_id;
                registro.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });

                form.clientScriptModulePath = "./mensajeri_cs.js";
                form.addButton({
                    id: "custom_gl_recibir",
                    label: "Imprimir",
                    functionName: "Imprimir()"
                });
                context.response.writePage(form);
            }
            if (!context.request.parameters.imprimir_id) {
              var typeScript = context.request.parameters.typescript;

            var form = serverWidget.createForm({
              title: "Documentos Mensajeria"
            });
            
            var sublist = form.addSublist({
              id: "custpage_lista_cartas",
              type: serverWidget.SublistType.INLINEEDITOR,
              label: "Cartas"
            });

            form.addField({
              id: "custpage_abc_text",
              type: serverWidget.FieldType.LONGTEXT,
              label: "Escaner area"
            });

            var box = form.addField({
              id: "custpage_check_box",
              type: serverWidget.FieldType.CHECKBOX,
              label: "Modo recepcion"
            });

            if(typeScript){
              box.defaultValue = 'T';
            }

            form.clientScriptModulePath = "./mensajeri_cs.js";

            if(!typeScript){
              form.addButton({
                id: "custom_gl_recibir",
                label: "Procesar",
                functionName: "procesar()"
              });

              form.addField({
                id: "custpage_mensajero",
                type: serverWidget.FieldType.SELECT,
                label: "Mensajero",
                source: "customrecord_sm_mensajeria_nombre"
              });
  
             
            }
            form.addField({
              id: "custpage_date",
              type: serverWidget.FieldType.DATE,
              label: "Fecha"
            });
  
            sublist.addField({
              id: "custpage_barcode",
              type: serverWidget.FieldType.SELECT,
              label: "Carta",
              source: "customrecord_mr23_cartas"
            });
            sublist.addField({
              id: "custpage_cliente",
              type: serverWidget.FieldType.SELECT,
              label: "Cliente",
              source: "customer"
            });

            sublist.addField({
              id: "custpage_destinatario",
              type: serverWidget.FieldType.SELECT,
              label: "Destinatario",
              source: "vendor"
            });
            sublist.addField({
              id: "custpage_cargamento",
              type: serverWidget.FieldType.SELECT,
              label: "Cargamento",
              source: "salesorder"
            });
            sublist.addField({
              id: "custpage_manifiestos",
              type: serverWidget.FieldType.SELECT,
              label: "Manifiestos",
              source: "customrecord_mr23_manifiesto"
            });
            sublist.addField({
              id: "custpage_clase",
              type: serverWidget.FieldType.SELECT,
              label: "Clase",
              source: "classification"
            });
            sublist.addField({
              id: "custpage_perfil",
              type: serverWidget.FieldType.SELECT,
              label: "Perfil",
              source: "lotnumberedinventoryitem"
            });
                sublist.addField({
                    id: "custpage_remplazo",
                    type: serverWidget.FieldType.TEXT,
                    label: "Remplazo"
                });
            context.response.writePage(form);
          }
        } catch (error) {
          log.debug({ title: "error- sl", details: error });
        }
      }

  
      return {
        onRequest: onRequest
      };
    }
  );
  
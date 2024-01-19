/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(
    [
        "N/search",
        "N/ui/message",
        "N/record",
        "N/currentRecord",
        "N/url",
        "N/https"
    ],
    function(search, message, record, currentRecord, url, https) {
        function pageInit(context) {
            try {
                var records = context.currentRecord;
                document.addEventListener("keydown", function(event) {
                    var inputElement = document.getElementById("custpage_abc_text");
                    inputElement.focus();
                    var key = event.key;
                    if (key == "Enter") {
                        event.preventDefault();
                        var nombre = records.getValue({ fieldId: "custpage_abc_text" });
                        var check = records.getValue({ fieldId: "custpage_check_box" });
                        var fecha_sl = records.getText({ fieldId: "custpage_date" });
                        var existe = no_duplicar_cartas(nombre);
                        if (existe && !check) {
                            var check_lista = comprobar_lista(nombre);
                            if (!check_lista) {
                                var info = Buscar(nombre);

                                for (var i = 0; i < info.length; i++) {
                                    var info_select = info[i];
                                    if (check) {
                                        var ie_detalle = Buscar_mensaje(info_select.interalid);
                                        if (ie_detalle == false) {
                                            message
                                                .create({
                                                    type: message.Type.ERROR,
                                                    title: "Error",
                                                    message: "Mensjae no encontrado"
                                                })
                                                .show({ duration: 5000 });
                                            return false;
                                        }
                                        var marcar_val = marcar(
                                            ie_detalle,
                                            info_select.perfil,
                                            info_select.mani,
                                            fecha_sl
                                        );
                                        console.log("marcar_val", marcar_val);
                                        if (!marcar_val) {
                                            message
                                                .create({
                                                    type: message.Type.ERROR,
                                                    title: "Error",
                                                    message: "Error al marcar recibido"
                                                })
                                                .show({ duration: 5000 });
                                            return false;
                                        }
                                    }
                                    if (info) {
                                        records.selectNewLine({
                                            sublistId: "custpage_lista_cartas"
                                        });
                                        records.setCurrentSublistValue({
                                            sublistId: "custpage_lista_cartas",
                                            fieldId: "custpage_barcode",
                                            value: info_select.mensaje_detalle_id
                                        });
                                        records.setCurrentSublistValue({
                                            sublistId: "custpage_lista_cartas",
                                            fieldId: "custpage_cliente",
                                            value: info_select.cliente
                                        });
                                        records.setCurrentSublistValue({
                                            sublistId: "custpage_lista_cartas",
                                            fieldId: "custpage_destinatario",
                                            value: info_select.destino
                                        });
                                        records.setCurrentSublistValue({
                                            sublistId: "custpage_lista_cartas",
                                            fieldId: "custpage_cargamento",
                                            value: info_select.cargamento
                                        });
                                        records.setCurrentSublistValue({
                                            sublistId: "custpage_lista_cartas",
                                            fieldId: "custpage_manifiestos",
                                            value: info_select.mani
                                        });
                                        records.setCurrentSublistValue({
                                            sublistId: "custpage_lista_cartas",
                                            fieldId: "custpage_clase",
                                            value: info_select.clase
                                        });
                                        records.setCurrentSublistValue({
                                            sublistId: "custpage_lista_cartas",
                                            fieldId: "custpage_perfil",
                                            value: info_select.perfil
                                        });
                                        records.setCurrentSublistValue({
                                            sublistId: "custpage_lista_cartas",
                                            fieldId: "custpage_remplazo",
                                            value: info_select.remplazo
                                        });
                                        records.commitLine({ sublistId: "custpage_lista_cartas" });
                                    } else {
                                        message
                                            .create({
                                                type: message.Type.ERROR,
                                                title: "Error",
                                                message: "Carta no encontrada"
                                            })
                                            .show({ duration: 10000 });
                                    }
                                }
                                inputElement.focus();
                                records.setValue({ fieldId: "custpage_abc_text", value: "" });
                            } else {
                                message
                                    .create({
                                        type: message.Type.ERROR,
                                        title: "Error",
                                        message: "Carta en lista"
                                    })
                                    .show({ duration: 10000 });
                                records.setValue({ fieldId: "custpage_abc_text", value: "" });
                            }
                        } else if (check) {
                            var info = Buscar(nombre);

                            for (var i = 0; i < info.length; i++) {
                                var info_select = info[i];
                                if (check) {
                                    var ie_detalle = Buscar_mensaje(info_select.interalid);
                                    if (ie_detalle == false) {
                                        message
                                            .create({
                                                type: message.Type.ERROR,
                                                title: "Error",
                                                message: "Mensjae no encontrado"
                                            })
                                            .show({ duration: 5000 });
                                        return false;
                                    }
                                    var marcar_val = marcar(
                                        ie_detalle,
                                        info_select.perfil,
                                        info_select.mani,
                                        fecha_sl
                                    );
                                    console.log("marcar_val", marcar_val);
                                    if (!marcar_val) {
                                        message
                                            .create({
                                                type: message.Type.ERROR,
                                                title: "Error",
                                                message: "Error al marcar recibido"
                                            })
                                            .show({ duration: 5000 });
                                        return false;
                                    }
                                }
                                if (info) {
                                    records.selectNewLine({ sublistId: "custpage_lista_cartas" });
                                    records.setCurrentSublistValue({
                                        sublistId: "custpage_lista_cartas",
                                        fieldId: "custpage_barcode",
                                        value: info_select.mensaje_detalle_id
                                    });
                                    records.setCurrentSublistValue({
                                        sublistId: "custpage_lista_cartas",
                                        fieldId: "custpage_cliente",
                                        value: info_select.cliente
                                    });
                                    records.setCurrentSublistValue({
                                        sublistId: "custpage_lista_cartas",
                                        fieldId: "custpage_destinatario",
                                        value: info_select.destino
                                    });
                                    records.setCurrentSublistValue({
                                        sublistId: "custpage_lista_cartas",
                                        fieldId: "custpage_cargamento",
                                        value: info_select.cargamento
                                    });
                                    records.setCurrentSublistValue({
                                        sublistId: "custpage_lista_cartas",
                                        fieldId: "custpage_manifiestos",
                                        value: info_select.mani
                                    });
                                    records.setCurrentSublistValue({
                                        sublistId: "custpage_lista_cartas",
                                        fieldId: "custpage_clase",
                                        value: info_select.clase
                                    });
                                    records.setCurrentSublistValue({
                                        sublistId: "custpage_lista_cartas",
                                        fieldId: "custpage_perfil",
                                        value: info_select.perfil
                                    });
                                    records.commitLine({ sublistId: "custpage_lista_cartas" });
                                } else {
                                    message
                                        .create({
                                            type: message.Type.ERROR,
                                            title: "Error",
                                            message: "Carta no encontrada"
                                        })
                                        .show({ duration: 10000 });
                                }
                            }
                            inputElement.focus();
                            records.setValue({ fieldId: "custpage_abc_text", value: "" });
                        } else {
                            message
                                .create({
                                    type: message.Type.ERROR,
                                    title: "Error",
                                    message: "Ya existe carta registrada"
                                })
                                .show({ duration: 10000 });
                            records.setValue({ fieldId: "custpage_abc_text", value: "" });
                        }
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }

        function procesar() {
            try {

                var records = currentRecord.get();

                var numlines = records.getLineCount({
                    sublistId: "custpage_lista_cartas"
                });
                var mensajero = records.getValue({ fieldId: "custpage_mensajero" });
                var fecha = records.getValue({ fieldId: "custpage_date" });

                if (!mensajero) {
                    message
                        .create({
                            type: message.Type.ERROR,
                            title: "Error",
                            message: "Seleccione un mensajero"
                        })
                        .show({ duration: 10000 });
                    return false;
                }

                if (!fecha) {
                    message
                        .create({
                            type: message.Type.ERROR,
                            title: "Error",
                            message: "Seleccione una fecha"
                        })
                        .show({ duration: 10000 });
                    return false;
                }

                if (numlines < 1) {
                    message
                        .create({
                            type: message.Type.ERROR,
                            title: "Error",
                            message: "No hay lineas en la lista"
                        })
                        .show({ duration: 10000 });
                    return false;
                }

                var arrLines = [];
                for (var i = 0; i < numlines; i++) {
                    arrLines.push({
                        carta: records.getSublistValue({
                            sublistId: "custpage_lista_cartas",
                            fieldId: "custpage_barcode",
                            line: i
                        }),
                        cliente: records.getSublistValue({
                            sublistId: "custpage_lista_cartas",
                            fieldId: "custpage_cliente",
                            line: i
                        }),
                        destinatario: records.getSublistValue({
                            sublistId: "custpage_lista_cartas",
                            fieldId: "custpage_destinatario",
                            line: i
                        }),
                        cargamento: records.getSublistValue({
                            sublistId: "custpage_lista_cartas",
                            fieldId: "custpage_cargamento",
                            line: i
                        }),
                        manifiesto: records.getSublistValue({
                            sublistId: "custpage_lista_cartas",
                            fieldId: "custpage_manifiestos",
                            line: i
                        }),
                        clase: records.getSublistValue({
                            sublistId: "custpage_lista_cartas",
                            fieldId: "custpage_clase",
                            line: i
                        }),
                        perfil: records.getSublistValue({
                            sublistId: "custpage_lista_cartas",
                            fieldId: "custpage_perfil",
                            line: i
                        }),
                        remplazo: records.getSublistValue({
                            sublistId: "custpage_lista_cartas",
                            fieldId: "custpage_remplazo",
                            line: i
                        })
                    });
                }
                var objdata = {
                    mensajero: mensajero,
                    fecha: fecha,
                    cartas: arrLines
                };

                var objdata_string = JSON.stringify(objdata);

                var Mensaje = record.create({
                    type: "customrecord_sm_data_json_mensajeria",
                    isDynamic: true
                });

                Mensaje.setValue({
                    fieldId: "custrecord_sm_str_data_json",
                    value: objdata_string
                });

                var Mensaje_id = Mensaje.save();

                var suiteletURL = url.resolveScript({
                    scriptId: "customscript_sm_mensajeria_sl",
                    deploymentId: "customdeploy_sm_mensajeria_sl",
                    returnExternalUrl: false,
                    params: {
                        imprimir_id: Mensaje_id
                    }
                });
                window.location.href = suiteletURL;

            }catch (e) {
                console.log(error);
            }
        }

        function Imprimir() {
            try {
                var records = currentRecord.get();

                var registro = records.getValue({ fieldId: "custpage_reg_carta" });


                var suiteletURL = url.resolveScript({
                    scriptId: "customscript_sm_creador_pdf_mensajeria",
                    deploymentId: "customdeploy_sm_creador_pdf_mensajeria",
                    returnExternalUrl: false,
                    params: {
                        Mensaje_id: registro
                    }
                });

                window.open(suiteletURL);
            } catch (error) {
                message
                    .create({
                        type: message.Type.ERROR,
                        title: "Error",
                        message: error.message
                    })
                    .show({ duration: 10000 });

                console.log(error);
            }
        }

        function Buscar(name) {
            try {
                var customrecord_mr23_carta_detallesSearchObj = search.create({
                    type: "customrecord_mr23_carta_detalles",
                    filters: [
                        ["custrecord_cartadetalle_id", "anyof", name],
                        "OR",
                        ["custrecord_cartadetalle_id.custrecord_sm_remplazo_campos", "is", name],
                    ],
                    columns: [
                        "internalid",
                        "custrecord_cartadetalle_id",
                        "custrecord_cartadetalle_manifiesto",
                        "custrecord_cartadetalle_perfil",
                        "custrecord_cartadetalles_archivo",
                        "custrecord_perfilproceso",
                        "custrecord_claseproceso",
                        "custrecord_tratamiento",
                        search.createColumn({
                            name: "custrecord_carta_clase",
                            join: "CUSTRECORD_CARTADETALLE_ID"
                        }),
                        search.createColumn({
                            name: "custrecord_carta_cliente",
                            join: "CUSTRECORD_CARTADETALLE_ID"
                        }),
                        search.createColumn({
                            name: "custrecord_carta_destino",
                            join: "CUSTRECORD_CARTADETALLE_ID"
                        }),
                        search.createColumn({
                            name: "custrecord_carta_cargamento",
                            join: "CUSTRECORD_CARTADETALLE_ID"
                        }),
                        search.createColumn({
                            name: "custrecord_carta_fecha",
                            join: "CUSTRECORD_CARTADETALLE_ID"
                        }),
                        search.createColumn({
                            name: "custrecord_carta_clase",
                            join: "CUSTRECORD_CARTADETALLE_ID"
                        }),
                        search.createColumn({
                            name: "custrecord_sm_remplazo_campos",
                            join: "CUSTRECORD_CARTADETALLE_ID"
                        }),
                    ]
                });
                var searchResultCount = customrecord_mr23_carta_detallesSearchObj.runPaged()
                    .count;
                if (searchResultCount == 0) {
                    return false;
                }

                var respuestaarr = [];
                customrecord_mr23_carta_detallesSearchObj.run().each(function(result) {
                    var respuesta = {};
                    respuesta.cliente_txt = result.getText({
                        name: "custrecord_carta_cliente",
                        join: "CUSTRECORD_CARTADETALLE_ID"
                    });
                    respuesta.cliente = result.getValue({
                        name: "custrecord_carta_cliente",
                        join: "CUSTRECORD_CARTADETALLE_ID"
                    });
                    respuesta.destino_txt = result.getText({
                        name: "custrecord_carta_destino",
                        join: "CUSTRECORD_CARTADETALLE_ID"
                    });
                    respuesta.destino = result.getValue({
                        name: "custrecord_carta_destino",
                        join: "CUSTRECORD_CARTADETALLE_ID"
                    });
                    respuesta.cargamento_txt = result.getText({
                        name: "custrecord_carta_cargamento",
                        join: "CUSTRECORD_CARTADETALLE_ID"
                    });
                    respuesta.cargamento = result.getValue({
                        name: "custrecord_carta_cargamento",
                        join: "CUSTRECORD_CARTADETALLE_ID"
                    });
                    respuesta.mani_txt = result.getText({
                        name: "custrecord_cartadetalle_manifiesto"
                    });
                    respuesta.mani = result.getValue({
                        name: "custrecord_cartadetalle_manifiesto"
                    });
                    respuesta.clase = result.getValue({
                        name: "custrecord_carta_clase",
                        join: "CUSTRECORD_CARTADETALLE_ID"
                    });
                    respuesta.clase_txt = result.getText({
                        name: "custrecord_carta_clase",
                        join: "CUSTRECORD_CARTADETALLE_ID"
                    });
                    respuesta.mensaje_detalle_id = result.getValue({
                        name: "custrecord_cartadetalle_id"
                    });
                    respuesta.perfil = result.getValue({
                        name: "custrecord_cartadetalle_perfil"
                    });
                    respuesta.interalid = result.getValue({
                        name: "custrecord_cartadetalle_id"
                    });
                    respuesta.remplazo = result.getValue({
                        name: "custrecord_sm_remplazo_campos",
                        join: "CUSTRECORD_CARTADETALLE_ID"
                    });
                    respuestaarr.push(respuesta);
                    return true;
                });
                console.log('respuestaarr'+respuestaarr);
                return respuestaarr;
            } catch (error) {
                console.log(error);
            }
        }

        function fieldChanged(context) {
            try {
                var currentRecord = context.currentRecord;
                var check = currentRecord.getValue({ fieldId: "custpage_check_box" });

                if (context.fieldId == "custpage_check_box") {
                    if (check) {
                        var suiteletURL = url.resolveScript({
                            scriptId: "customscript_sm_mensajeria_sl",
                            deploymentId: "customdeploy_sm_mensajeria_sl",
                            returnExternalUrl: false,
                            params: {
                                typescript: "T"
                            }
                        });
                        window.location.href = suiteletURL;
                    } else {
                        var suiteletURL = url.resolveScript({
                            scriptId: "customscript_sm_mensajeria_sl",
                            deploymentId: "customdeploy_sm_mensajeria_sl",
                            returnExternalUrl: false
                        });
                        window.location.href = suiteletURL;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        function Buscar_mensaje(name) {
            try {
                var customrecord_sm_detalle_mensajeriaSearchObj = search.create({
                    type: "customrecord_sm_detalle_mensajeria",
                    filters: [
                        ["custrecord_sm_carta_reg", "anyof", name],
                        "AND",
                        ["custrecord_sm_completado_detalle", "is", "F"]
                    ],
                    columns: ["internalid"]
                });
                var internalid;

                customrecord_sm_detalle_mensajeriaSearchObj
                    .run()
                    .each(function(result) {
                        internalid = result.getValue({ name: "internalid" });

                        return true;
                    });

                return internalid;
            } catch (error) {
                console.log(error);
                return false;
            }
        }

        function marcar(id_detalle, perfil, mani, fecha_sl) {
            try {

                var detalle = record.load({
                    type: "customrecord_sm_detalle_mensajeria",
                    id: id_detalle,
                    isDynamic: true
                });
                detalle.setValue({
                    fieldId: "custrecord_sm_completado_detalle",
                    value: true
                });
                detalle.save();

                var customrecord_mr23_manifiesto_detallesSearchObj = search.create({
                    type: "customrecord_mr23_manifiesto_detalles",
                    filters: [
                        ["custrecord_mr23_mandat_perfil", "anyof", perfil],
                        "AND",
                        ["custrecord_mr23_mandat_idman", "anyof", mani]
                    ],
                    columns: ["internalid"]
                });
                var internalids = [];
                customrecord_mr23_manifiesto_detallesSearchObj
                    .run()
                    .each(function(result) {
                        internalids.push(result.getValue({ name: "internalid" }))
                        return true;
                    });
                var fechaString = fecha_sl;

                var partesFecha = fechaString.split("/");

                var dia = parseInt(partesFecha[0], 10);
                var mes = parseInt(partesFecha[1], 10);
                var año = parseInt(partesFecha[2], 10);

                var fecha = new Date(año, mes - 1, dia);

                for(var i = 0; i < internalids.length; i++){
                    var detalle_mani = record.load({
                        type: "customrecord_mr23_manifiesto_detalles",
                        id: internalids[i],
                        isDynamic: true
                    });
                    detalle_mani.setValue({
                        fieldId: "custrecord_sm_completado_ar",
                        value: true
                    });
                    detalle_mani.setValue({
                        fieldId: "custrecord_mr23_mandat_fechaentregacli",
                        value: fecha
                    });
                    detalle_mani.save();
                }


                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        }

        function no_duplicar_cartas(carta) {
            try {
                var customrecord_sm_detalle_mensajeriaSearchObj = search.create({
                    type: "customrecord_sm_detalle_mensajeria",
                    filters: [["custrecord_sm_carta_reg", "anyof", carta]],
                    columns: [
                        search.createColumn({
                            name: "scriptid",
                            sort: search.Sort.ASC
                        }),
                        "custrecord_sm_carta_reg",
                        "custrecord_sm_cliente",
                        "custrecord_sm_location_reg",
                        "custrecord_sm_cragamento_reg",
                        "custrecord_sm_manifiesto",
                        "custrecord_sm_clase_reg",
                        "custrecord_sm_sublista_padre",
                        "custrecord_sm_perfil_reg"
                    ]
                });
                var searchResultCount = customrecord_sm_detalle_mensajeriaSearchObj.runPaged()
                    .count;

                if (searchResultCount == 0) {
                    return true;
                }
                return false;
            } catch (e) {
                console.log(e);
            }
        }

        function comprobar_lista(carta) {
            try {
                var records = currentRecord.get();
                var numlines = records.getLineCount({
                    sublistId: "custpage_lista_cartas"
                });

                for (var i = 0; i < numlines; i++) {
                    var cartas_linea = records.getSublistValue({
                        sublistId: "custpage_lista_cartas",
                        fieldId: "custpage_barcode",
                        line: i
                    });
                    if (cartas_linea == carta) {
                        return true;
                    }
                }

                return false;
            } catch (e) {
                console.log(e);
            }
        }

        return {
            pageInit: pageInit,
            Imprimir: Imprimir,
            fieldChanged: fieldChanged,
            procesar: procesar
        };
    }
);

const description = ["Cateto opuesto sobre hipotenusa", "Cateto adyacente sobre hipotenusa", "Cateto opuesto sobre cateto adyacente"];
var chart = null; //variable para almacenar el grafico
$(document).ready(function () {
    inputFocus();
    clickAction();        

});
function messageBox(param, object) {
    var angulo = $(object).parent().text();
    var title = "Cálculo del " + angulo;
    var numDescription = 0;
    $("#messageBox .message").children().remove();
    if (param == "notAngulo") {
        $("#messageBox .message").append(
            "<h5>Alerta</h5>" +
            "<p>Seleccione el tipo de ángulo por calcular</p>"
        );
    }
    else if (param == "errorAngulo") {
        $("#messageBox .message").append(
            "<h5>Alerta</h5>" +
            "<p>El grado debe ser superior a 0° inferior a 360° </p>"
        );
    }
    else if (param == "emptyAngulo") {
        $("#messageBox .message").append(
            "<h5>Alerta</h5>" +
            "<p>No hay nada que calcular</p>"
        );
    }
    else if (param == "errorArea") {
        $("#messageBox .message").append(
            "<h5>Alerta</h5>" +
            "<p>El radio debe estar entre los valores 1 a 2600 </p>"
        );
    }
    $("#messageBox").addClass("active");
    setTimeout(function () {
        $("#messageBox").removeClass("active");
        setTimeout(function () {
            $("#messageBox .message").children().remove();
        },350);
    },15000)
}
function inputFocus() {
    $(".mainBody .boxBody .boxRow .inputBox input").focus(function () {
        $(this).parent().addClass("focus");
    });
    $(".mainBody .boxBody .boxRow .inputBox input").blur(function () {
        $(this).parent().removeClass("focus");
    });
}
function clickAction() {
    $(".mainBody .boxBody .boxRow-1 .row input").click(function () {
        $(".mainBody .boxBody .boxRow-1 .row input").removeClass("active");
        $(this).addClass("active");
        //Se verifica que radio button se selecciono para modificar el placeholder
        if ($(this).val() == "Seno" || $(this).val() == "Coseno" || $(this).val() == "Tangente") {
            $(".mainBody .boxBody .boxRow-2 .inputBox input").attr("placeholder", "# Grados");
        }
        else if ($(this).val() == "Circulo") {
            $(".mainBody .boxBody .boxRow-2 .inputBox input").attr("placeholder", "Radio");
        }
    });
    $(".mainBody .boxRow-3 .btnCalculate").click(function () {
        var result = 0;
        if ($(".mainBody .boxBody .boxRow-1 .row input").hasClass("active")) {
            const param = $(".mainBody .boxBody .boxRow-1 .row input.active").val();
            const degrees = $(".mainBody .boxRow-2 .inputBox input").val();
            // Destruye el gráfico existente
            if (chart) {
                //Realiza un cambio de estado de class para cargar ciertas animaciones de desaparicion y aparicion
                $(".mainBody .boxContent .boxImage h5").removeClass("disappear");
                $(".mainBody .boxContent .boxImage #grafico").removeClass("show");
                setTimeout(() => {
                    $(".mainBody .boxContent .boxImage h5").removeClass("hide");
                    $(".mainBody .boxContent .boxImage #grafico").addClass("disappear");
                }, 450);
                chart.destroy();
            }
            if (param == "Seno" || param == "Coseno" || param == "Tangente") {
                result = calculateAngle(param);
                $(".mainBody .boxRow-3 .tbResult").val(result.toFixed(5));//El resultado mostrado en el campo se resume con 5 decimales mediante la funcion toFixed             
                drawingAngle(degrees,result, param);
            }
            else if (param == "Circulo") {
                result = calculateArea();
                $(".mainBody .boxRow-3 .tbResult").val(result.toFixed(5));//El resultado mostrado en el campo se resume con 5 decimales mediante la funcion toFixed
            }
        }
        else {
            messageBox("notAngulo", null);
        }
    });

}
function calculateAngle(param) {
    var grados = $(".mainBody .boxRow-2 .inputBox input").val();
    var radianes = 0;
    var angulo = 0;
    //Se analiza que opcion se eligio de los radio button
    if (param == "Seno" || param == "Coseno" || param == "Tangente") {        
        if (!grados.length > 0) {
            messageBox("emptyAngulo", null);   
        }
        else {
            if (grados < 0 || grados > 360) {
                messageBox("errorAngulo", null);
                $(".mainBody .boxRow-3 .tbResult").val(null);
                $(".mainBody .boxContent .boxImage h5").removeClass("class", "disappear");
                setTimeout(() => {
                    $(".mainBody .boxContent .boxImage h5").removeClass("class", "hide");
                }, 450);
            }
            else if (grados >= 0 & grados < 360) {
                //Realiza un cambio de estado de class para cargar ciertas animaciones de desaparicion y aparicion
                $(".mainBody .boxContent .boxImage h5").attr("class", "hide");
                $(".mainBody .boxContent .boxImage #grafico").removeClass("disappear");
                setTimeout(() => {
                    $(".mainBody .boxContent .boxImage h5").addClass("disappear");
                    setTimeout(() => {
                        $(".mainBody .boxContent .boxImage #grafico").addClass("show");
                    },450)
                }, 450);
                //Se realizan los calculos con base al tipo de angulo por calcular mediante la funcion que ofrece Math
                if (param == "Seno") {
                    radianes = grados * (Math.PI / 180);
                    angulo = Math.sin(radianes);
                }
                else if (param == "Coseno") {
                    radianes = grados * (Math.PI / 180);
                    angulo = Math.cos(radianes);
                }
                else if (param == "Tangente") {
                    radianes = grados * (Math.PI / 180);
                    angulo = Math.tan(radianes);
                }
                return angulo;
            }        
        }        
    }
    else {
        messageBox("emptyAngulo", null);
    }
}
function drawingAngle(degrees,result,angle) {
    // Obtén el contexto del lienzo del gráfico
    var object = document.getElementById('grafico').getContext('2d');

    // Genera los datos de la función del seno
    var data = [];
    for (var i = 0; i <= 360; i++) {
        var radianes = i * (Math.PI / 180);
        var valor = 0;
        if (angle == "Seno")
            valor = Math.sin(radianes)
        else if (angle == "Coseno")
            valor = Math.cos(radianes)
        else if (angle == "Tangente")
            valor = Math.tan(radianes)
        data.push({ x: i, y: valor });
    }
    // Dibuja el gráfico utilizando Chart.js
    chart = new Chart(object, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Función del ' + angle,
                data: data,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Ángulo (grados)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor del ' + angle
                    }
                }
            }
        }
    });

    // Dibuja el punto resultante
    var puntoResultado = 0;
    if (angle == "Seno")
        puntoResultado = { x: degrees, y: Math.sin(degrees * (Math.PI / 180)) };
    else if (angle == "Coseno")
        puntoResultado = { x: degrees, y: Math.cos(degrees * (Math.PI / 180)) };
    else if (angle == "Tangente")
        puntoResultado = { x: degrees, y: Math.tan(degrees * (Math.PI / 180)) };
    chart.data.datasets.push({
        label: 'Resultado',
        data: [puntoResultado],
        pointBackgroundColor: 'black',
        pointRadius: 8,
        pointHoverRadius: 8,
        showLine: false
    });

    // Actualiza el gráfico
    chart.update();

}
function calculateArea() {
    var radio = $(".mainBody .boxRow-2 .inputBox input").val();    
    var area = 0;
    if (radio >= 1 && radio <= 26000) {
        //Se calcula el area del circulo Pi*radio^2
        area = Math.PI * radio * radio;
        return area;
    }
    else if (radio < 1 || radio > 2600) {
        messageBox("errorArea", null);
        $(".mainBody .boxRow-3 .tbResult").val(null);
    }
    else {
        messageBox("errorArea", null);
        $(".mainBody .boxRow-3 .tbResult").val(null);
    }
    
}
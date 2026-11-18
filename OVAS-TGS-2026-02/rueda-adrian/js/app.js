function abrirMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("activo");
}

document.querySelectorAll("#menu a").forEach(enlace => {
    enlace.addEventListener("click", function() {
        document.getElementById("menu")
            .classList.remove("activo");
    });
});

function mostrarModelo(tipo) {

    const resultado = document.getElementById("resultado-modelo");

    const explicaciones = {
        entrada: {
            titulo: "📥 Entradas",
            texto: "Son los datos, recursos o elementos que recibe un sistema para comenzar su funcionamiento. Ejemplo: los datos de un estudiante y su pedido."
        },

        proceso: {
            titulo: "⚙️ Procesamiento",
            texto: "Es la transformación de las entradas mediante actividades, operaciones o instrucciones. Ejemplo: validar el pedido y calcular su precio."
        },

        salida: {
            titulo: "📤 Salidas",
            texto: "Son los resultados que genera el sistema. Ejemplo: una factura, un registro o un informe."
        },

        retro: {
            titulo: "🔄 Retroalimentación",
            texto: "Es la información que permite evaluar los resultados y realizar correcciones para mejorar el funcionamiento."
        },

        entorno: {
            titulo: "🌎 Entorno",
            texto: "Son los factores externos que influyen en el sistema. Ejemplo: usuarios, proveedores, normas y condiciones tecnológicas."
        }
    };

    resultado.innerHTML = `
        <h3>${explicaciones[tipo].titulo}</h3>
        <p>${explicaciones[tipo].texto}</p>
    `;
}


function jugar(numero, opcion) {

    const respuestas = {
        1: {
            correcta: "b",
            mensaje: "¡Correcto! Los datos del cliente y su pedido son las entradas que recibe el sistema."
        },
        2: {
            correcta: "a",
            mensaje: "¡Excelente! Es un sistema abierto porque intercambia información con su entorno."
        },
        3: {
            correcta: "b",
            mensaje: "¡Muy bien! Primero entran los datos, luego se procesan y finalmente se generan las salidas."
        }
    };

    const resultado = document.getElementById("resultado" + numero);

    if (opcion === respuestas[numero].correcta) {
        resultado.innerHTML = "✅ ¡Respuesta correcta! " + respuestas[numero].mensaje;
        resultado.style.background = "#d8f5df";
        resultado.style.color = "#12652f";
    } else {
        resultado.innerHTML = "❌ Respuesta incorrecta. Inténtalo nuevamente.";
        resultado.style.background = "#ffe0e0";
        resultado.style.color = "#a00000";
    }
}

function revisarEjercicio(numero, opcion) {

    const ejercicios = {
        1: {
            correcta: "b",
            explicacion: "El procesamiento consiste en preparar el pedido y calcular su precio. Es la transformación de las entradas."
        },
        2: {
            correcta: "a",
            explicacion: "¡Correcto! Los estudiantes y el personal administrativo interactúan con el sistema y forman parte de su entorno humano."
        },
        3: {
            correcta: "c",
            explicacion: "La retroalimentación utiliza información de los resultados para detectar errores y mejorar el funcionamiento."
        }
    };

    const resultado = document.getElementById("explicacion" + numero);

    if (opcion === ejercicios[numero].correcta) {
        resultado.innerHTML = "✅ ¡Muy bien! " + ejercicios[numero].explicacion;
        resultado.style.background = "#d8f5df";
        resultado.style.color = "#12652f";
    } else {
        resultado.innerHTML = "❌ Esa no es la respuesta correcta. Inténtalo nuevamente. Pista: " +
            ejercicios[numero].explicacion;
        resultado.style.background = "#ffe0e0";
        resultado.style.color = "#a00000";
    }
}
// EVALUACION AUTOMATICA

function calificarEvaluacion() {

    const respuestasCorrectas = {
        q1: "a",
        q2: "b",
        q3: "b",
        q4: "a",
        q5: "b",
        q6: "a",
        q7: "c",
        q8: "a",
        q9: "b",
        q10: "c"
    };

    let puntos = 0;
    let respondidas = 0;
    let total = 10;

    for (let pregunta in respuestasCorrectas) {

        const seleccionada = document.querySelector(
            'input[name="' + pregunta + '"]:checked'
        );

        if (seleccionada) {
            respondidas++;

            if (seleccionada.value === respuestasCorrectas[pregunta]) {
                puntos++;
            }
        }
    }

    const resultado = document.getElementById("resultado-evaluacion");

    if (respondidas < total) {
        resultado.style.background = "#fff0d6";
        resultado.style.color = "#805000";
        resultado.innerHTML =
            "<h3>Te faltan preguntas</h3><p>Has respondido " +
            respondidas + " de 10. Completa todas las preguntas para obtener tu calificación.</p>";
        return;
    }

    const nota = puntos * 10;

    let mensaje = "";

    if (nota >= 90) {
        mensaje = "¡Excelente trabajo! Dominas muy bien los conceptos de la TGS.";
    } else if (nota >= 70) {
        mensaje = "¡Buen trabajo! Tienes una buena comprensión de la TGS.";
    } else if (nota >= 50) {
        mensaje = "Vas por buen camino, pero debes repasar algunos conceptos.";
    } else {
        mensaje = "Te recomendamos estudiar nuevamente los fundamentos de la TGS.";
    }

    resultado.style.background = "#d8f5df";
    resultado.style.color = "#12652f";

    resultado.innerHTML =
        "<h3>¡Evaluación terminada!</h3>" +
        "<p>Respuestas correctas: " + puntos + " de 10</p>" +
        "<p>Respuestas incorrectas: " + (total - puntos) + "</p>" +
        "<h2>Tu calificación: " + nota + " / 100</h2>" +
        "<p>" + mensaje + "</p>";
}
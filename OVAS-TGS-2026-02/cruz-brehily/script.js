
// ========== ACTIVIDAD: ¿QUÉ TIPO DE SISTEMA ES? ==========
const respuestasActividad = {
    act1: 'A',
    act2: 'B',
    act3: 'C',
    act4: 'B',
    act5: 'A'
};

function verificarActividad() {
    let puntos = 0;
    const total = 5;

    for (let i = 1; i <= total; i++) {
        const select = document.getElementById('act' + i);
        const msg = document.getElementById('msg' + i);
        const valor = select.value;
        const correcta = respuestasActividad['act' + i];

        if (valor === correcta) {
            msg.textContent = ' ✅ Correcto';
            msg.className = 'mensaje correcto';
            puntos++;
        } else if (valor !== '') {
            msg.textContent = ' ❌ Incorrecto';
            msg.className = 'mensaje incorrecto';
        } else {
            msg.textContent = '';
            msg.className = 'mensaje';
        }
    }

    document.getElementById('resultado-actividad').innerHTML = 
        '<strong>Puntuación: ' + puntos + ' / 5</strong>';
}

function reiniciarActividad() {
    for (let i = 1; i <= 5; i++) {
        document.getElementById('act' + i).selectedIndex = 0;
        document.getElementById('msg' + i).textContent = '';
        document.getElementById('msg' + i).className = 'mensaje';
    }
    document.getElementById('resultado-actividad').innerHTML = '<strong>Puntuación: 0 / 5</strong>';
}

// ========== CUESTIONARIO: TIPOS DE SISTEMAS ==========
const respuestasCorrectasQuiz = {
    q1: 'B',
    q2: 'C',
    q3: 'D',
    q4: 'C',
    q5: 'B',
    q6: 'A',
    q7: 'C',
    q8: 'B',
    q9: 'C',
    q10: 'B'
};

function calcularPuntaje() {
    let puntos = 0;
    const totalPreguntas = 10;
    const notaMaxima = 5;

    for (let i = 1; i <= totalPreguntas; i++) {
        const nombre = 'q' + i;
        const seleccionado = document.querySelector('input[name="' + nombre + '"]:checked');
        if (seleccionado && seleccionado.value === respuestasCorrectasQuiz[nombre]) {
            puntos++;
        }
    }

    const nota = (puntos / totalPreguntas) * notaMaxima;
    const notaRedondeada = nota.toFixed(1);

    document.getElementById('puntaje-actual').textContent = notaRedondeada + ' / ' + notaMaxima;
    document.getElementById('nota-final').textContent = notaRedondeada + ' / ' + notaMaxima;
    
    let mensaje = '';
    if (puntos === totalPreguntas) {
        mensaje = '🎉 ¡Excelente! Respondiste todo perfectamente. ¡Felicitaciones!';
    } else if (puntos >= 8) {
        mensaje = '👏 ¡Muy buen trabajo! Solo te faltó muy poco.';
    } else if (puntos >= 6) {
        mensaje = '👍 Buen trabajo. Revisa las preguntas que fallaste y vuelve a intentarlo.';
    } else if (puntos >= 4) {
        mensaje = '📖 Vas por buen camino. Repasa los ejemplos y los videos.';
    } else {
        mensaje = '💪 No te preocupes, repasa la información y vuelve a intentarlo. ¡Tú puedes!';
    }
    
    document.getElementById('mensaje-final').textContent = mensaje;
    document.getElementById('resultado').style.display = 'block';
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
}

function reiniciarQuiz() {
    for (let i = 1; i <= 10; i++) {
        const nombre = 'q' + i;
        const opciones = document.querySelectorAll('input[name="' + nombre + '"]');
        opciones.forEach(function(opt) { opt.checked = false; });
    }
    document.getElementById('puntaje-actual').textContent = '0 / 5';
    document.getElementById('nota-final').textContent = '0 / 5';
    document.getElementById('mensaje-final').textContent = '';
    document.getElementById('resultado').style.display = 'none';
}


// ========== ACTIVIDAD 2: RELACIONAR COLUMNAS ==========
const respuestasRelacion = {
    rel1: 'B',
    rel2: 'C',
    rel3: 'A',
    rel4: 'B',
    rel5: 'A'
};

function verificarRelacion() {
    let puntos = 0;
    const total = 5;

    for (let i = 1; i <= total; i++) {
        const select = document.getElementById('rel' + i);
        const msg = document.getElementById('msg-rel' + i);
        const valor = select.value;
        const correcta = respuestasRelacion['rel' + i];

        if (valor === correcta) {
            msg.textContent = ' ✅ Correcto';
            msg.className = 'mensaje correcto';
            puntos++;
        } else if (valor !== '') {
            msg.textContent = ' ❌ Incorrecto';
            msg.className = 'mensaje incorrecto';
        } else {
            msg.textContent = '';
            msg.className = 'mensaje';
        }
    }

    document.getElementById('resultado-relacion').innerHTML = 
        '<strong>Puntuación: ' + puntos + ' / 5</strong>';
}

function reiniciarRelacion() {
    for (let i = 1; i <= 5; i++) {
        document.getElementById('rel' + i).selectedIndex = 0;
        document.getElementById('msg-rel' + i).textContent = '';
        document.getElementById('msg-rel' + i).className = 'mensaje';
    }
    document.getElementById('resultado-relacion').innerHTML = '<strong>Puntuación: 0 / 5</strong>';
}


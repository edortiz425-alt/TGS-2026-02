if (!window.__ovaInitialized) {
window.__ovaInitialized = true;
// COMPROBAR LOS EJERCICIOS

function check(id, correct, result) {
 const value = document.getElementById(id).value;
 const out = document.getElementById(result);

 if (!value) {
  out.textContent = "Selecciona una respuesta.";
  out.style.color = "#ec8aff";
 } else if (value === correct) {
  out.textContent = "✓ ¡Excelente! Tu respuesta es correcta.";
  out.style.color = "#4de5e0";
 } else {
  out.textContent = "✗ No es correcto. Vuelve a intentarlo.";
  out.style.color = "#ff8caa";
 }
}


// JUEGO 1: ¿QUIÉN SOY?

let gameIndex = 0;
let score = 0;
let answeredCurrent = false;

const questions = [
 {
  q: "Soy el medio por donde viaja la información. ¿Quién soy?",
  options: ["Emisor", "Canal", "Ruido"],
  answer: 1
 },
 {
  q: "Soy quien produce o selecciona el mensaje. ¿Quién soy?",
  options: ["Fuente", "Receptor", "Canal"],
  answer: 0
 },
 {
  q: "Soy la interferencia que puede alterar una señal. ¿Quién soy?",
  options: ["Destino", "Transmisor", "Ruido"],
  answer: 2
 },
 {
  q: "Recibo y decodifico la señal. ¿Quién soy?",
  options: ["Receptor", "Fuente", "Ruido"],
  answer: 0
 },
 {
  q: "Soy el punto al que va dirigido el mensaje. ¿Quién soy?",
  options: ["Canal", "Destino", "Transmisor"],
  answer: 1
 }
];

function showQuestion() {
 const question = questions[gameIndex];

 document.getElementById("gameQuestion").textContent = question.q;

 const optionsBox = document.getElementById("whoOptions");
 optionsBox.innerHTML = "";

 question.options.forEach((option, index) => {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = option;
  button.onclick = function () {
   play(index);
  };

  optionsBox.appendChild(button);
 });

 document.getElementById("gameResult").textContent = "";
 answeredCurrent = false;
}

function play(answer) {
 const out = document.getElementById("gameResult");

 if (answeredCurrent) {
  out.textContent = "Presiona ‘Siguiente reto’ para continuar.";
  return;
 }

 if (answer === questions[gameIndex].answer) {
  out.textContent = "🌟 ¡Correcto! Ganaste 10 puntos.";
  out.style.color = "#4de5e0";

  score += 10;
  document.getElementById("gameScore").textContent = score;

 } else {
  out.textContent = "No es correcto. La respuesta era: " +
   questions[gameIndex].options[questions[gameIndex].answer] + ".";

  out.style.color = "#ec8aff";
 }

 answeredCurrent = true;
}

function nextGame() {
 gameIndex = (gameIndex + 1) % questions.length;
 showQuestion();
}


// JUEGO 2: DETECTA EL PROBLEMA

function noise(value) {
 const out = document.getElementById("noiseResult");

 if (value === "ruido") {
  out.textContent = "✓ ¡Muy bien! El ruido está afectando la señal. +10 puntos.";
  out.style.color = "#4de5e0";

  if (!window.noiseAnswered) {
   score += 10;
   document.getElementById("gameScore").textContent = score;
   window.noiseAnswered = true;
  }

 } else {
  out.textContent = "Inténtalo nuevamente. Piensa qué puede interferir con la señal.";
  out.style.color = "#ec8aff";
 }
}


// JUEGO 3: ORDENA EL PROCESO

const correctOrder = [
 "Fuente",
 "Transmisor",
 "Canal",
 "Receptor",
 "Destino"
];

let selectedOrder = [];

function chooseOrder(element) {
 const out = document.getElementById("orderResult");

 if (selectedOrder.includes(element)) {
  out.textContent = "Ese elemento ya fue seleccionado.";
  out.style.color = "#ec8aff";
  return;
 }

 selectedOrder.push(element);

 document.getElementById("orderProgress").textContent =
  "Elementos seleccionados: " + selectedOrder.length + " de 5";

 if (selectedOrder.length === 5) {

  if (selectedOrder.every((item, index) => item === correctOrder[index])) {

   out.textContent = "🏆 ¡Excelente! Ordenaste correctamente el proceso. +20 puntos.";
   out.style.color = "#4de5e0";

   if (!window.orderWon) {
    score += 20;
    document.getElementById("gameScore").textContent = score;
    window.orderWon = true;
   }

  } else {
   out.textContent = "El orden no es correcto. Presiona ‘Volver a jugar’ e inténtalo otra vez.";
   out.style.color = "#ec8aff";
  }

 } else {
  out.textContent = "Seleccionaste: " + selectedOrder.join(" → ");
  out.style.color = "#a5b0ce";
 }
}

function resetOrder() {
 selectedOrder = [];

 document.getElementById("orderProgress").textContent =
  "Elementos seleccionados: 0 de 5";

 document.getElementById("orderResult").textContent = "";
}


// EVALUACIÓN FINAL

const form = document.getElementById("quiz");

form.addEventListener("change", function () {

 let answered = 0;

 for (let i = 1; i <= 5; i++) {
  if (document.querySelector('input[name="p' + i + '"]:checked')) {
   answered++;
  }
 }

 document.getElementById("bar").style.width =
  (answered * 20) + "%";

 document.getElementById("progressText").textContent =
  answered + " de 5 preguntas respondidas";
});


function grade() {

 const answers = {
  p1: "a",
  p2: "b",
  p3: "a",
  p4: "b",
  p5: "c"
 };

 let scoreQuiz = 0;
 let answered = 0;

 for (let p in answers) {

  const selected = document.querySelector(
   'input[name="' + p + '"]:checked'
  );

  if (selected) {
   answered++;

   if (selected.value === answers[p]) {
    scoreQuiz++;
   }
  }
 }

 const result = document.getElementById("quizResult");

 if (answered !== 5) {
  result.textContent =
   "⚠ Responde todas las preguntas antes de finalizar.";

  return;
 }

 const finalGrade = scoreQuiz * 20;

 result.innerHTML =
  "<h2>¡Evaluación terminada!</h2>" +
  "<h3>Tu puntaje: " + finalGrade + "/100</h3>" +
  "<p>Respuestas correctas: " + scoreQuiz + " de 5.</p>" +

  (scoreQuiz >= 4
   ? "🏆 ¡Excelente! Dominas muy bien el tema."
   : scoreQuiz >= 3
   ? "👏 ¡Buen trabajo! Sigue repasando."
   : "📚 Repasa los conceptos y vuelve a intentarlo.");

 result.scrollIntoView({
  behavior: "smooth",
  block: "center"
 });
}


// MOSTRAR LA PRIMERA PREGUNTA AL CARGAR LA PÁGINA

showQuestion();

}
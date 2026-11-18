(() => {
  const questions = [
    {
      title: '¿Qué significa que el mapa logístico sea determinista?',
      options: ['Cualquier valor inicial lleva al mismo resultado.', 'La misma regla y el mismo estado dan el mismo siguiente valor.', 'Cada paso se elige al azar.'],
      correct: 1,
      explanation: 'La regla determina el siguiente estado a partir del actual.'
    },
    {
      title: '¿Qué se cambia para comparar sensibilidad a condiciones iniciales?',
      options: ['Solo los estados iniciales; se mantiene r.', 'Solo el número de iteraciones.', 'Los estados iniciales y r al mismo tiempo.'],
      correct: 0,
      explanation: 'Con r fijo, ambas trayectorias siguen la misma regla.'
    },
    {
      title: '¿Cuánto vale x₁ cuando r = 3 y x₀ = 0,2?',
      options: ['0,20', '0,60', '0,48'],
      correct: 2,
      explanation: 'El primer paso es 3 × 0,2 × (1 − 0,2) = 0,48.'
    },
    {
      title: '¿Cómo se reconoce una trayectoria de período dos?',
      options: ['Sus valores se acercan a cero.', 'Alterna entre dos valores después del transitorio.', 'Cada valor supera al anterior.'],
      correct: 1,
      explanation: 'La alternancia se repite cada dos pasos.'
    },
    {
      title: '¿Por qué se dificulta predecir una trayectoria caótica a largo plazo?',
      options: ['Porque un pequeño error inicial puede amplificarse.', 'Porque la ecuación cambia de forma en cada paso.', 'Porque siempre se detiene después de pocas iteraciones.'],
      correct: 0,
      explanation: 'La incertidumbre inicial puede crecer al avanzar las iteraciones.'
    }
  ];
  const form = document.querySelector('#quiz-form');
  const results = document.querySelector('#quiz-result');
  const PASSING_SCORE = 3;
  const controls = document.querySelector('#quiz-controls');
  const progress = document.querySelector('#quiz-progress');
  const progressText = document.querySelector('#quiz-progress-text');
  const questionBlocks = [];

  for (const [index, question] of questions.entries()) {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    const heading = document.createElement('span');
    heading.className = 'question-heading';
    const number = document.createElement('span');
    number.className = 'question-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const prompt = document.createElement('span');
    prompt.className = 'question-prompt';
    prompt.textContent = question.title;
    heading.append(number, prompt);
    legend.append(heading);
    fieldset.append(legend);
    const choices = question.options.map((option, value) => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'q' + index;
      radio.value = value;
      radio.required = true;
      label.className = 'quiz-option';
      const text = document.createElement('span');
      text.className = 'option-label';
      text.textContent = option;
      const badge = document.createElement('span');
      badge.className = 'option-state';
      label.append(radio, text, badge);
      fieldset.append(label);
      return { label, radio, badge };
    });
    const explanation = document.createElement('p');
    explanation.className = 'feedback';
    questionBlocks.push({ fieldset, explanation, choices });
    fieldset.append(explanation);
    card.append(fieldset);
    document.querySelector('#quiz-questions').append(card);
  }


  form.addEventListener('change', () => {
    const answered = form.querySelectorAll('input:checked').length;
    progress.value = answered;
    progressText.value = answered + ' de ' + questions.length;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!results.hidden || !form.reportValidity()) return;
    const answers = new FormData(form);
    let score = 0;
    questions.forEach((question, index) => {
      const chosen = Number(answers.get('q' + index));
      const correct = chosen === question.correct;
      const { fieldset, explanation, choices } = questionBlocks[index];
      if (correct) score += 1;
      fieldset.dataset.mark = correct ? 'correct' : 'wrong';
      choices.forEach(({ label, radio, badge }, optionIndex) => {
        radio.disabled = true;
        if (optionIndex === question.correct) {
          label.dataset.mark = 'correct';
          badge.textContent = correct ? '✓ Tu acierto' : '✓ Correcta';
        } else if (optionIndex === chosen) {
          label.dataset.mark = 'wrong';
          badge.textContent = '× Tu elección';
        }
      });
      explanation.textContent = question.explanation;
    });
    controls.hidden = true;
    const passed = score >= PASSING_SCORE;
    showActivityResult(results, passed, passed ? '¡Aprobaste!' : 'Aún no alcanzas la meta',
      'Puntaje: ' + score + ' de ' + questions.length + ' (' +
      Math.round(score * 100 / questions.length) + ' %). ' +
      (passed ? 'Puedes revisar tus respuestas o volver a intentarlo.' : 'La meta es 3 de 5. Revisa las respuestas y vuelve a intentarlo.'));
  });

  form.addEventListener('reset', () => {
    const hadResult = !results.hidden;
    results.hidden = true;
    controls.hidden = false;
    progress.value = 0;
    progressText.value = '0 de ' + questions.length;
    questionBlocks.forEach(({ fieldset, explanation, choices }) => {
      delete fieldset.dataset.mark;
      explanation.textContent = '';
      choices.forEach(({ label, radio, badge }) => {
        delete label.dataset.mark;
        radio.disabled = false;
        badge.textContent = '';
      });
    });
    if (hadResult) questionBlocks[0].choices[0].radio.focus();
  });
})();

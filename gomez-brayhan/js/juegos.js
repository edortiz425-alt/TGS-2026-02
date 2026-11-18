(() => {
  const challenges = [
    { rate: 3.2, kind: 'periódico', clue: 'Dos niveles se alternan después del transitorio.' },
    { rate: 3.9, kind: 'caótico', clue: 'En este ejemplo de régimen caótico, los valores no forman un ciclo corto.' },
    { rate: 2.8, kind: 'estable', clue: 'Los valores se mantienen cerca de un punto fijo, 0,643.' }
  ];
  const canvas = document.querySelector('#game-chart');
  const count = document.querySelector('#trajectory-count');
  const data = document.querySelector('#trajectory-data');
  const feedback = document.querySelector('#trajectory-feedback');
  const next = document.querySelector('#trajectory-next');
  const nextRow = document.querySelector('#trajectory-next-row');
  const result = document.querySelector('#trajectory-result');
  const replay = document.querySelector('#trajectory-replay');
  const play = document.querySelector('#trajectory-play');
  const reveal = document.querySelector('#trajectory-reveal');
  const cursor = document.querySelector('#trajectory-point');
  const reading = document.querySelector('#trajectory-reading');
  const answers = [...document.querySelectorAll('[data-kind]')];
  const startStep = 50;
  const sampleSize = 25;
  let round = 0;
  let correct = 0;
  let values;
  let shown;
  let timer = null;
  let attempts;

  function drawEvidence() {
    const index = cursor.valueAsNumber - startStep;
    drawTrajectory(canvas, [values.slice(0, shown)], startStep, index);
    reading.value = 'Paso ' + (startStep + index) + ' · x = ' + decimal.format(values[index]);
  }

  function stopPlayback() {
    window.clearInterval(timer);
    timer = null;
    play.textContent = 'Reproducir muestra';
  }

  function showSamples(amount) {
    shown = amount;
    cursor.max = startStep + shown - 1;
    cursor.value = cursor.max;
    reveal.disabled = shown === sampleSize;
    if (shown === sampleSize) stopPlayback();
    play.disabled = shown === sampleSize;
    reveal.textContent = reveal.disabled ? 'Muestra completa' : 'Revelar 6 puntos';
    data.textContent = values.slice(0, shown).map((value, index) => (startStep + index) + ': ' + decimal.format(value)).join(' · ');
    drawEvidence();
  }

  function renderRound() {
    stopPlayback();
    attempts = 0;
    values = logistic(challenges[round].rate, 0.25, startStep + sampleSize - 1).slice(startStep);
    count.textContent = 'Ronda ' + (round + 1) + ' de ' + challenges.length + ' · Aciertos: ' + correct;
    markFeedback(feedback, null, '');
    result.hidden = true;
    nextRow.hidden = false;
    next.disabled = true;
    answers.forEach((button) => {
      button.disabled = false;
      button.classList.remove('choice-good', 'choice-bad');
    });
    showSamples(7);
  }

  cursor.addEventListener('input', () => {
    if (timer !== null) stopPlayback();
    drawEvidence();
  });
  play.addEventListener('click', () => {
    if (timer !== null) {
      stopPlayback();
      return;
    }
    play.textContent = 'Pausar muestra';
    timer = window.setInterval(() => {
      showSamples(shown + 1);
      if (shown === sampleSize && document.activeElement === play) cursor.focus();
    }, 125);
  });
  reveal.addEventListener('click', () => {
    if (timer !== null) stopPlayback();
    showSamples(Math.min(sampleSize, shown + 6));
    if (reveal.disabled) cursor.focus();
  });

  answers.forEach((button) => {
    button.addEventListener('click', () => {
      if (timer !== null) stopPlayback();
      const challenge = challenges[round];
      const isCorrect = button.dataset.kind === challenge.kind;
      attempts += 1;
      button.classList.add(isCorrect ? 'choice-good' : 'choice-bad');
      if (!isCorrect && attempts === 1) {
        button.disabled = true;
        showSamples(Math.min(sampleSize, shown + 6));
        markFeedback(feedback, 'bad', 'Inténtalo otra vez. Pista: ' + challenge.clue);
        answers.find((choice) => !choice.disabled).focus();
        return;
      }
      if (isCorrect) correct += 1;
      count.textContent = 'Ronda ' + (round + 1) + ' de ' + challenges.length + ' · Aciertos: ' + correct;
      markFeedback(feedback, isCorrect ? 'good' : 'bad',
        (isCorrect ? 'Correcto. ' : 'La respuesta es «' + challenge.kind + '». ') + challenge.clue);
      showSamples(sampleSize);
      answers.forEach((choice) => { choice.disabled = true; });
      if (round === challenges.length - 1) {
        nextRow.hidden = true;
        const won = correct >= 2;
        showActivityResult(result, won, won ? '¡Lo conseguiste!' : 'Reto por superar',
          'Acertaste ' + correct + ' de ' + challenges.length + ' rondas. La meta es acertar al menos dos.');
      } else {
        next.disabled = false;
        next.focus();
      }
    });
  });

  next.addEventListener('click', () => {
    round += 1;
    renderRound();
    reveal.focus();
  });
  replay.addEventListener('click', () => {
    round = 0;
    correct = 0;
    renderRound();
    play.focus();
  });
  renderRound();
  new ResizeObserver(drawEvidence).observe(canvas);
})();

(() => {
  const concepts = [
    ['Estado inicial', 'Valor desde el cual comienza una trayectoria.'],
    ['Determinismo', 'La misma regla y el mismo estado producen el mismo paso siguiente.'],
    ['Bifurcación', 'Cambio cualitativo de la dinámica al variar un parámetro.'],
    ['Sensibilidad inicial', 'Estados que empiezan muy cerca pueden seguir trayectorias muy separadas.']
  ];
  const board = document.querySelector('#memory-board');
  const stats = document.querySelector('#memory-stats');
  const feedback = document.querySelector('#memory-feedback');
  const actions = document.querySelector('#memory-actions');
  const retry = document.querySelector('#memory-continue');
  const reset = document.querySelector('#memory-reset');
  const controls = document.querySelector('#memory-controls');
  const result = document.querySelector('#memory-result');
  const replay = document.querySelector('#memory-replay');
  let first;
  let second;
  let moves;
  let pairs;

  function updateStats() {
    stats.textContent = 'Parejas: ' + pairs + ' de ' + concepts.length + ' · Intentos: ' + moves;
  }

  function setCard(card, state) {
    card.dataset.state = state;
    card.classList.remove('card-miss');
    const covered = state === 'covered';
    const matched = state === 'matched';
    if (covered) {
      card.textContent = card.dataset.position;
    } else {
      const type = document.createElement('span');
      type.className = 'card-type';
      type.textContent = matched ? 'Pareja encontrada' : card.dataset.type;
      const face = document.createElement('span');
      face.className = 'card-face';
      face.textContent = card.dataset.label;
      card.replaceChildren(type, face);
    }
    card.setAttribute('aria-label', covered ? 'Voltear carta ' + card.dataset.position :
      card.dataset.type + ': ' + card.dataset.label + (matched ? ' · Pareja encontrada' : ''));
    card.setAttribute('aria-disabled', String(!covered));
    card.tabIndex = matched ? -1 : 0;
  }

  function flip(card) {
    if (card.dataset.state !== 'covered' || second) return;
    setCard(card, 'visible');
    if (!first) {
      first = card;
      markFeedback(feedback, null, 'Carta revelada: ' + card.dataset.label + ' Elige otra.');
      return;
    }
    second = card;
    moves += 1;
    if (first.dataset.pair === second.dataset.pair) {
      setCard(first, 'matched');
      setCard(second, 'matched');
      pairs += 1;
      markFeedback(feedback, 'good', 'Pareja encontrada: ' + concepts[Number(card.dataset.pair)][0] + '.');
      first = null;
      second = null;
      if (pairs === concepts.length) {
        controls.hidden = true;
        showActivityResult(result, true, '¡Tablero completo!',
          'Encontraste las cuatro parejas en ' + moves + ' intentos.');
      } else {
        board.querySelector('[data-state="covered"]').focus();
      }
    } else {
      first.classList.add('card-miss');
      second.classList.add('card-miss');
      markFeedback(feedback, 'bad', 'Estas cartas pertenecen a parejas distintas. Lee ambas antes de volver a cubrirlas.');
      actions.hidden = false;
      board.querySelectorAll('[data-state="covered"]').forEach((covered) => {
        covered.setAttribute('aria-disabled', 'true');
        covered.tabIndex = -1;
      });
      retry.focus();
    }
    updateStats();
  }

  retry.addEventListener('click', () => {
    const returnTo = second;
    setCard(first, 'covered');
    setCard(second, 'covered');
    first = null;
    second = null;
    actions.hidden = true;
    board.querySelectorAll('[data-state="covered"]').forEach((covered) => {
      covered.setAttribute('aria-disabled', 'false');
      covered.tabIndex = 0;
    });
    markFeedback(feedback, null, 'Elige dos cartas para el siguiente intento.');
    returnTo.focus();
  });

  function restart() {
    first = null;
    second = null;
    moves = 0;
    pairs = 0;
    actions.hidden = true;
    markFeedback(feedback, null, '');
    controls.hidden = false;
    result.hidden = true;
    const cards = concepts.flatMap((pair, index) => pair.map((label, side) => ({ label, pair: index, type: side === 0 ? 'Concepto' : 'Definición' })));
    for (let end = cards.length - 1; end > 0; end -= 1) {
      const swap = Math.floor(Math.random() * (end + 1));
      [cards[end], cards[swap]] = [cards[swap], cards[end]];
    }
    board.replaceChildren(...cards.map(({label, pair, type}, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'memory-card';
      card.dataset.label = label;
      card.dataset.pair = pair;
      card.dataset.type = type;
      card.dataset.position = index + 1;
      setCard(card, 'covered');
      card.addEventListener('click', () => flip(card));
      return card;
    }));
    updateStats();
  }

  function startNewGame() {
    restart();
    board.querySelector('button').focus();
  }

  reset.addEventListener('click', startNewGame);
  replay.addEventListener('click', startNewGame);
  restart();
})();

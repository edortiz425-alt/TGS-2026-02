document.documentElement.classList.add('has-js');

const menuButton = document.querySelector('#menu');
const navigation = document.querySelector('#nav');

function toggleNavigation(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.dataset.collapsed = String(!open);
}

toggleNavigation(false);
menuButton.addEventListener('click', () => {
  toggleNavigation(menuButton.getAttribute('aria-expanded') === 'false');
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a') && window.matchMedia('(max-width: 760px)').matches) {
    toggleNavigation(false);
  }
});
navigation.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    toggleNavigation(false);
    menuButton.focus();
  }
});

const decimal = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 5 });

function logistic(rate, initial, steps) {
  const values = [initial];
  for (let step = 1; step <= steps; step += 1) {
    const previous = values[step - 1];
    values.push(rate * previous * (1 - previous));
  }
  return values;
}

function drawTrajectory(canvas, series, startStep = 0, highlight = null) {
  const ratio = window.devicePixelRatio || 1;
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  const left = 38;
  const right = width - 18;
  const top = 15;
  const bottom = height - 27;
  const last = series[0].length - 1;
  const x = (index) => left + index * (right - left) / last;
  const y = (value) => bottom - value * (bottom - top);
  ctx.font = '11px Segoe UI, sans-serif';
  ctx.fillStyle = '#454f45';
  ctx.strokeStyle = '#d2cabc';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  [0, 0.25, 0.5, 0.75, 1].forEach((value) => {
    ctx.fillText(decimal.format(value), left - 6, y(value));
    ctx.beginPath();
    ctx.moveTo(left, y(value));
    ctx.lineTo(right, y(value));
    ctx.stroke();
  });

  ctx.textAlign = 'center';
  [0, 0.25, 0.5, 0.75, 1].forEach((fraction) => {
    const index = Math.round(last * fraction);
    ctx.fillText(String(startStep + index), x(index), bottom + 13);
  });
  ctx.fillText('n', right + 11, bottom + 13);

  series.forEach((values, index) => {
    ctx.strokeStyle = index === 0 ? '#244d40' : '#9a482e';
    ctx.lineWidth = index === 0 ? 2 : 1.8;
    ctx.setLineDash(index === 0 ? [] : [5, 4]);
    ctx.beginPath();
    ctx.moveTo(x(0), y(values[0]));
    values.slice(1).forEach((value, step) => ctx.lineTo(x(step + 1), y(value)));
    ctx.stroke();
  });

  if (highlight !== null) {
    ctx.beginPath();
    ctx.fillStyle = '#9a482e';
    ctx.arc(x(highlight), y(series[0][highlight]), 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function markFeedback(element, tone, text) {
  if (tone) element.dataset.tone = tone;
  else delete element.dataset.tone;
  element.textContent = text;
}

function showActivityResult(panel, won, title, detail) {
  const heading = panel.querySelector('h2, h3');
  heading.textContent = title;
  panel.querySelector('.result-mark').textContent = won ? '✓' : '↻';
  panel.querySelector('.result-detail').textContent = detail;
  panel.dataset.outcome = won ? 'won' : 'retry';
  panel.hidden = false;
  heading.focus();
}

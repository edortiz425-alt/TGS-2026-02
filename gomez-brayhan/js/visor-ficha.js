const viewer = document.querySelector('#visor-ficha');
const openDocument = document.querySelector('#abrir-ficha');
const previousPage = document.querySelector('#doc-prev');
const nextPage = document.querySelector('#doc-next');
const pageImage = document.querySelector('#doc-img');
const pageStatus = document.querySelector('#doc-status');
const pageCount = 7;
let currentPage = 1;
let requestedFullscreen = false;

function showPage(number) {
  currentPage = Math.min(pageCount, Math.max(1, number));
  pageStatus.value = currentPage + ' de ' + pageCount;
  pageImage.src = '../assets/ficha/pagina-' + currentPage + '.jpg';
  pageImage.alt = 'Página ' + pageStatus.value + ' de la ficha técnica';
  previousPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === pageCount;
  pageImage.parentElement.scrollTop = 0;
}

openDocument.addEventListener('click', (event) => {
  if (!viewer.showModal || event.ctrlKey || event.metaKey || event.shiftKey) return;
  event.preventDefault();
  viewer.showModal();
  showPage(1);
  if (document.fullscreenEnabled && !document.fullscreenElement) {
    requestedFullscreen = true;
    document.documentElement.requestFullscreen().catch(() => { requestedFullscreen = false; });
  }
});
previousPage.addEventListener('click', () => showPage(currentPage - 1));
nextPage.addEventListener('click', () => showPage(currentPage + 1));
document.querySelector('#doc-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') showPage(currentPage + 1);
  else if (event.key === 'ArrowLeft') showPage(currentPage - 1);
  else return;
  event.preventDefault();
});
viewer.addEventListener('close', () => {
  if (requestedFullscreen && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  requestedFullscreen = false;
  openDocument.focus();
});

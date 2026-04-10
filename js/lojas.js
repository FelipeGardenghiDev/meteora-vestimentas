// Horários de cada loja: chaves 0=Dom, 1=Seg, ..., 6=Sáb. Valores: [abertura, fechamento] em horas inteiras.
const LOJAS = [
  { horas: { 1:[10,22],2:[10,22],3:[10,22],4:[10,22],5:[10,22],6:[10,20] } }, // São Paulo
  { horas: { 1:[10,22],2:[10,22],3:[10,22],4:[10,22],5:[10,22],6:[10,20] } }, // Rio de Janeiro
  { horas: { 1:[9,21], 2:[9,21], 3:[9,21], 4:[9,21], 5:[9,21], 6:[9,18]  } }, // Belo Horizonte
  { horas: { 1:[9,21], 2:[9,21], 3:[9,21], 4:[9,21], 5:[9,21], 6:[10,18] } }, // Curitiba
  { horas: { 1:[9,21], 2:[9,21], 3:[9,21], 4:[9,21], 5:[9,21], 6:[9,18]  } }, // Porto Alegre
  { horas: { 0:[12,20],1:[10,22],2:[10,22],3:[10,22],4:[10,22],5:[10,22],6:[10,22] } }, // Salvador
];

function calcularStatus(loja) {
  const now = new Date();
  const dia = now.getDay();
  const hora = now.getHours();
  const horario = loja.horas[dia];

  if (!horario) return { tipo: 'fechada', hora: null };
  const [abre, fecha] = horario;
  if (hora >= abre && hora < fecha) return { tipo: 'aberta', hora: fecha };
  if (hora < abre) return { tipo: 'abre', hora: abre };
  return { tipo: 'fechada', hora: null };
}

function textoStatus(status, lang) {
  if (status.tipo === 'aberta') return lang === 'en' ? 'Open now' : 'Aberta agora';
  if (status.tipo === 'abre') {
    const h = status.hora;
    return lang === 'en' ? `Opens at ${h < 12 ? h + 'am' : h - 12 === 0 ? '12pm' : h - 12 + 'pm'}` : `Abre às ${h}h`;
  }
  return lang === 'en' ? 'Closed' : 'Fechada';
}

function classeStatus(tipo) {
  if (tipo === 'aberta') return 'badge bg-success';
  if (tipo === 'abre') return 'badge bg-warning text-dark';
  return 'badge bg-danger';
}

export function atualizarBadgesLojas(lang) {
  document.querySelectorAll('[data-store]').forEach(badge => {
    const idx = parseInt(badge.dataset.store, 10);
    const loja = LOJAS[idx];
    if (!loja) return;
    const status = calcularStatus(loja);
    badge.className = classeStatus(status.tipo);
    badge.removeAttribute('data-i18n');
    badge.textContent = textoStatus(status, lang);
  });
}

const langInicial = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
atualizarBadgesLojas(langInicial);

document.addEventListener('locale-changed', (e) => {
  atualizarBadgesLojas(e.detail.lang);
});

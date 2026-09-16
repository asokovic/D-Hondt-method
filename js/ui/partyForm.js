window.Dhondt = window.Dhondt || {};
Dhondt.ui = Dhondt.ui || {};

/**
 * 
 */
Dhondt.ui.partyForm = (function () {
  let counter = 0;
  let currentMode = 'basic';

  const DEFAULT_COLORS = [
    '#000075', '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#a9a9a9'
  ];

  function listEl() {
    return document.getElementById('party-list');
  }

  function addRow(name, votes, color) {
    counter += 1;
    const id = 'party-' + counter;
    const row = document.createElement('div');
    row.className = 'party-row';
    row.dataset.id = id;

    row.innerHTML = `
      <input type="color" class="party-color" value="${color || DEFAULT_COLORS[(counter - 1) % DEFAULT_COLORS.length]}" aria-label="Party color">
      <input type="text" class="party-name" value="${name || ''}" placeholder="Party name">
      <input type="number" class="party-votes" min="0" step="1" value="${votes != null ? votes : ''}" placeholder="Votes">
      <label class="party-minority${currentMode === 'serbia' ? '' : ' is-hidden'}">
        <input type="checkbox" class="party-minority-check">
        <span>Minority party</span>
      </label>
      <button type="button" class="party-remove" aria-label="Remove party">Remove</button>
    `;

    row.querySelector('.party-remove').addEventListener('click', () => row.remove());
    listEl().appendChild(row);
  }

  function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.party-minority').forEach(el => {
      el.classList.toggle('is-hidden', mode !== 'serbia');
    });
  }

  function getParties() {
    return Array.from(listEl().querySelectorAll('.party-row')).map(row => ({
      id: row.dataset.id,
      name: row.querySelector('.party-name').value.trim() || 'Unnamed',
      color: row.querySelector('.party-color').value,
      votes: parseInt(row.querySelector('.party-votes').value, 10) || 0,
      flags: {
        isMinorityParty: row.querySelector('.party-minority-check').checked
      }
    }));
  }

  function reset(seedRows) {
    listEl().innerHTML = '';
    counter = 0;
    (seedRows || []).forEach(r => addRow(r.name, r.votes, r.color));
  }

  return { addRow, setMode, getParties, reset };
})();

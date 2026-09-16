window.Dhondt = window.Dhondt || {};
Dhondt.ui = Dhondt.ui || {};

/**
 * 
 */
Dhondt.ui.modeToggle = (function () {
  let currentMode = 'basic';

  function init(onChange) {
    document.querySelectorAll('.mode-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-option').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentMode = btn.dataset.mode;
        applyPreset(currentMode);
        Dhondt.ui.partyForm.setMode(currentMode);
        if (onChange) onChange(currentMode);
      });
    });
  }

  function applyPreset(mode) {
    const preset = Dhondt.presets[mode];
    const seatsInput = document.getElementById('total-seats');
    const thresholdInput = document.getElementById('threshold');
    const thresholdNote = document.getElementById('threshold-note');
    const totalVotesCastLabel = document.getElementById('total-votes-cast-label');

    seatsInput.value = preset.defaultSeats;
    thresholdInput.value = (preset.threshold * 100).toString();
    thresholdInput.disabled = !preset.thresholdEditable;
    thresholdNote.textContent = preset.note || '';
    thresholdNote.classList.toggle('is-hidden', !preset.note);

    const votesCastRequired = preset.thresholdBasis === 'totalVotesCast';
    totalVotesCastLabel.textContent = votesCastRequired
      ? 'Total votes cast (required)'
      : 'Total votes cast (optional)';
  }

  function getMode() {
    return currentMode;
  }

  return { init, getMode };
})();

window.Dhondt = window.Dhondt || {};

document.addEventListener('DOMContentLoaded', () => {
  Dhondt.ui.partyForm.reset([
    { name: 'Party A', votes: 120000 },
    { name: 'Party B', votes: 95000 },
    { name: 'Party C', votes: 40000 }
  ]);

  Dhondt.ui.modeToggle.init();
  document.querySelector('.mode-option.is-active').click(); // apply initial preset

  document.getElementById('add-party').addEventListener('click', () => {
    Dhondt.ui.partyForm.addRow();
  });

  document.getElementById('quotients-toggle').addEventListener('click', () => {
    document.getElementById('quotients-table-container').classList.toggle('is-hidden');
  });

  document.getElementById('calculate-btn').addEventListener('click', () => {
    const mode = Dhondt.ui.modeToggle.getMode();
    const preset = Dhondt.presets[mode];

    const totalSeats = parseInt(document.getElementById('total-seats').value, 10);
    const thresholdInputPct = parseFloat(document.getElementById('threshold').value);

    const registeredVotersRaw = parseInt(document.getElementById('registered-voters').value, 10);
    const totalVotesCastRaw = parseInt(document.getElementById('total-votes-cast').value, 10);
    const turnout = {
      registeredVoters: isNaN(registeredVotersRaw) ? null : registeredVotersRaw,
      totalVotesCast: isNaN(totalVotesCastRaw) ? null : totalVotesCastRaw
    };

    const config = Object.assign({}, preset, {
      threshold: isNaN(thresholdInputPct) ? preset.threshold : thresholdInputPct / 100,
      totalVotesCast: turnout.totalVotesCast
    });

    const parties = Dhondt.ui.partyForm.getParties();

    if (!totalSeats || totalSeats < 1) {
      alert('Enter a valid number of seats.');
      return;
    }
    if (parties.length === 0 || parties.every(p => p.votes === 0)) {
      alert('Enter at least one party with votes.');
      return;
    }
    if (mode === 'serbia' && turnout.totalVotesCast == null) {
      alert("Enter \"Total votes cast\" — Serbia's 3% threshold is measured against all votes cast, not just the parties' votes, so this can't be calculated without it.");
      return;
    }
    if (turnout.totalVotesCast != null) {
      const partyVotesSum = parties.reduce((sum, p) => sum + p.votes, 0);
      if (turnout.totalVotesCast < partyVotesSum) {
        alert('Total votes cast is smaller than the sum of party votes — check your numbers.');
        return;
      }
    }

    const preprocessor = mode === 'serbia' ? Dhondt.rules.serbia : Dhondt.rules.basic;
    const { engineInput, exclusions, adjustments } = preprocessor(parties, config);

    const result = Dhondt.engine.calculate(engineInput, totalSeats);

    Dhondt.ui.resultsView.render(parties, result, exclusions, turnout);
  });
});

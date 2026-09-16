window.Dhondt = window.Dhondt || {};
Dhondt.ui = Dhondt.ui || {};

/**
 * 
 */
Dhondt.ui.resultsView = (function () {
  function render(parties, result, exclusions, turnout) {
    document.getElementById('results-section').classList.remove('is-hidden');
    renderHemicycle(parties, result);
    renderTurnout(parties, turnout);
    renderTable(parties, result, exclusions, turnout);
    renderQuotients(result.quotientTable);
  }

  
  function renderTurnout(parties, turnout) {
    const el = document.getElementById('turnout-summary');
    const partyVotesSum = parties.reduce((sum, p) => sum + p.votes, 0);

    if (!turnout || (turnout.registeredVoters == null && turnout.totalVotesCast == null)) {
      el.classList.add('is-hidden');
      el.innerHTML = '';
      return;
    }

    const parts = [];

    if (turnout.totalVotesCast != null) {
      const invalid = turnout.totalVotesCast - partyVotesSum;
      if (invalid < 0) {
        parts.push(`<strong>Warning:</strong> party votes (${partyVotesSum.toLocaleString()}) exceed total votes cast (${turnout.totalVotesCast.toLocaleString()}).`);
      } else {
        const invalidPct = turnout.totalVotesCast ? ((invalid / turnout.totalVotesCast) * 100).toFixed(1) : '0.0';
        parts.push(`Invalid/blank votes: <strong>${invalid.toLocaleString()}</strong> (${invalidPct}% of votes cast)`);
      }
    }

    if (turnout.registeredVoters != null && turnout.totalVotesCast != null) {
      const turnoutPct = turnout.registeredVoters ? ((turnout.totalVotesCast / turnout.registeredVoters) * 100).toFixed(1) : '0.0';
      parts.push(`Turnout: <strong>${turnoutPct}%</strong> (${turnout.totalVotesCast.toLocaleString()} of ${turnout.registeredVoters.toLocaleString()} registered voters)`);
    }

    el.innerHTML = parts.map(p => `<span>${p}</span>`).join('');
    el.classList.remove('is-hidden');
  }

  function renderTable(parties, result, exclusions, turnout) {
    const partyVotesSum = parties.reduce((sum, p) => sum + p.votes, 0);
    
    const totalVotes = (turnout && turnout.totalVotesCast != null) ? turnout.totalVotesCast : partyVotesSum;
    const totalSeats = Object.values(result.seatsById).reduce((sum, n) => sum + n, 0);
    const excludedIds = new Set((exclusions || []).map(e => e.id));

    const rows = parties.map(p => {
      const seats = result.seatsById[p.id] || 0;
      const votePct = totalVotes ? ((p.votes / totalVotes) * 100).toFixed(1) : '0.0';
      const seatPct = totalSeats ? ((seats / totalSeats) * 100).toFixed(1) : '0.0';
      const excluded = excludedIds.has(p.id);

      return `
        <tr class="${excluded ? 'is-excluded' : ''}">
          <td>
            <span class="color-dot" style="background:${p.color}"></span>${p.name}
            ${excluded ? '<span class="excluded-tag">below threshold</span>' : ''}
          </td>
          <td>${p.votes.toLocaleString()}</td>
          <td>${votePct}%</td>
          <td>${seats}</td>
          <td>${seatPct}%</td>
        </tr>`;
    }).join('');

    document.getElementById('results-table').innerHTML = `
      <thead>
        <tr><th>Party</th><th>Votes</th><th>Vote share</th><th>Seats</th><th>Seat share</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    `;
  }

  
  function renderHemicycle(parties, result) {
    const totalSeats = Object.values(result.seatsById).reduce((sum, n) => sum + n, 0);
    const svg = document.getElementById('hemicycle');
    const container = svg.closest('.hemicycle-wrapper');
    svg.innerHTML = '';

    if (totalSeats === 0) {
      container.classList.add('is-hidden');
      return;
    }
    container.classList.remove('is-hidden');

    const width = 600, height = 320, cx = width / 2, cy = height - 10;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const rowCount = Math.max(3, Math.min(9, Math.round(Math.sqrt(totalSeats / 2))));
    const minRadius = 60, maxRadius = height - 30;
    const rowGap = rowCount > 1 ? (maxRadius - minRadius) / (rowCount - 1) : 0;
    const rowRadii = Array.from({ length: rowCount }, (_, i) => minRadius + i * rowGap);

   
    const radiusSum = rowRadii.reduce((sum, r) => sum + r, 0);
    const seatsPerRow = rowRadii.map(r => Math.round((r / radiusSum) * totalSeats));

    let drift = totalSeats - seatsPerRow.reduce((sum, n) => sum + n, 0);
    let i = 0;
    while (drift !== 0) {
      seatsPerRow[i % rowCount] += drift > 0 ? 1 : -1;
      drift += drift > 0 ? -1 : 1;
      i++;
    }

    
    const slots = [];
    for (let row = 0; row < rowCount; row++) {
      const count = seatsPerRow[row];
      const radius = rowRadii[row];
      for (let s = 0; s < count; s++) {
        const t = count === 1 ? 0.5 : s / (count - 1);
        const angle = Math.PI - t * Math.PI; 
        const x = cx + radius * Math.cos(angle);
        const y = cy - radius * Math.sin(angle);
        slots.push({ angle, x, y });
      }
    }

    
    slots.sort((a, b) => b.angle - a.angle);

    
    const seatColors = [];
    parties.forEach(p => {
      const n = result.seatsById[p.id] || 0;
      for (let k = 0; k < n; k++) seatColors.push(p.color);
    });

    const seatRadius = 6;
    slots.forEach((slot, index) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', slot.x.toFixed(1));
      circle.setAttribute('cy', slot.y.toFixed(1));
      circle.setAttribute('r', seatRadius);
      circle.setAttribute('fill', seatColors[index] || '#C9CBC2');
      svg.appendChild(circle);
    });
  }

  function renderQuotients(quotientTable) {
    const wrapper = document.getElementById('quotients-wrapper');
    if (!quotientTable || !quotientTable.length) {
      wrapper.classList.add('is-hidden');
      return;
    }
    wrapper.classList.remove('is-hidden');

    document.getElementById('quotients-table').innerHTML = `
      <thead><tr><th>Round</th><th>Party</th><th>Quotient</th></tr></thead>
      <tbody>
        ${quotientTable.map(q => `<tr><td>${q.round}</td><td>${q.id}</td><td>${q.quotient}</td></tr>`).join('')}
      </tbody>
    `;
  }

  return { render };
})();

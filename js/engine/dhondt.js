window.Dhondt = window.Dhondt || {};

/**
 *
 * @param {Array<{id: string, votes: number}>} parties - already filtered/adjusted
 * @param {number} totalSeats
 * @returns {{
 *   seatsById: Object<string, number>,        // id -> seats won
 *   quotientTable: Array<{round: number, id: string, quotient: number}>
 *                                              
 *                                              
 *                                              
 *                                              
 *                                              
 * }}
 */
Dhondt.engine = {
  calculate: function (parties, totalSeats) {
    const seatsById = Object.fromEntries(parties.map(p => [p.id, 0]));
    const quotientTable = [];

    for (let round = 1; round <= totalSeats; round++) {
      let winner = null;
      let winnerQuotient = -1;

      for (const party of parties) {
        const quotient = party.votes / (seatsById[party.id] + 1);

        
        if (
          winner === null ||
          quotient > winnerQuotient ||
          (quotient === winnerQuotient && party.votes > winner.votes)
        ) {
          winner = party;
          winnerQuotient = quotient;
        }
      }

      seatsById[winner.id] += 1;
      quotientTable.push({ round, id: winner.id, quotient: winnerQuotient });
    }

    return { seatsById, quotientTable };
  }
};

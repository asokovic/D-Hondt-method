window.Dhondt = window.Dhondt || {};
Dhondt.rules = Dhondt.rules || {};

/**
 *
 * @param {Array<{id, name, color, votes, flags: {isMinorityParty}}>} parties
 * @param {object} config - 
 * @returns {{
 *   engineInput: Array<{id, votes}>,
 *   exclusions: Array<{id, reason}>,
 *   adjustments: Array<{id, originalVotes, adjustedVotes, reason}>
 * }}
 */
Dhondt.rules.serbia = function preprocess(parties, config) {
  const totalVotesCast = config.totalVotesCast;
  const exclusions = [];
  const adjustments = [];
  const engineInput = [];

  parties.forEach(p => {
    const isMinority = !!(p.flags && p.flags.isMinorityParty);
    const share = totalVotesCast > 0 ? p.votes / totalVotesCast : 0;

    if (!isMinority && share < config.threshold) {
      exclusions.push({ id: p.id, reason: 'below_threshold' });
      return;
    }

    let votes = p.votes;
    if (isMinority) {
      const adjustedVotes = Math.round(p.votes * config.minorityMultiplier);
      adjustments.push({
        id: p.id,
        originalVotes: p.votes,
        adjustedVotes,
        reason: 'minority_multiplier'
      });
      votes = adjustedVotes;
    }

    engineInput.push({ id: p.id, votes });
  });

  return { engineInput, exclusions, adjustments };
};

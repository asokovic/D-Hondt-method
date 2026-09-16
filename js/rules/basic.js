window.Dhondt = window.Dhondt || {};
Dhondt.rules = Dhondt.rules || {};

/**
 * 
 *
 * @param {Array<{id, name, color, votes, flags}>} parties
 * @param {object} config - the active preset config (unused here)
 * @returns {{ engineInput: Array<{id, votes}>, exclusions: [], adjustments: [] }}
 */
Dhondt.rules.basic = function preprocess(parties, config) {
  const engineInput = parties.map(p => ({ id: p.id, votes: p.votes }));
  return {
    engineInput,
    exclusions: [],
    adjustments: []
  };
};

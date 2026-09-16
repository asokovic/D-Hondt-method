window.Dhondt = window.Dhondt || {};


Dhondt.presets = {
  basic: {
    id: 'basic',
    label: 'Basic',
    threshold: 0,               
    thresholdEditable: true,
    minorityExemption: false,
    minorityMultiplier: 1,
    defaultSeats: 100,
    note: null
  },

  serbia: {
    id: 'serbia',
    label: 'Serbia',
    threshold: 0.03,
    thresholdBasis: 'totalVotesCast', 
    thresholdEditable: true,
    minorityExemption: true,
    minorityMultiplier: 1.35,
    defaultSeats: 250,
    note: null
  }
};

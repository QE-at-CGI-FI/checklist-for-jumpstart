/**
 * Budget Calculator
 *
 * Pure function — no I/O. Aggregates itinerary costs into a budget breakdown.
 * Amounts are in whichever currency the user entered; no conversion is performed.
 */

/**
 * @param {Array} itinerary - Trip itinerary items from the database
 * @returns {{ greensFees: number, accommodation: number, total: number, breakdown: Array }}
 */
function calculateBudget(itinerary) {
  let greensFees = 0;
  let accommodation = 0;

  const breakdown = itinerary.map(item => {
    const fee = parseFloat(item.greens_fee_estimate) || 0;
    const accCost = parseFloat(item.accommodation_cost) || 0;
    greensFees += fee;
    accommodation += accCost;

    return {
      courseName: item.course_name,
      visitDate: item.visit_date,
      greensFee: fee,
      accommodationName: item.accommodation_name || null,
      accommodationCost: accCost,
      subtotal: fee + accCost,
    };
  });

  return {
    greensFees: round(greensFees),
    accommodation: round(accommodation),
    total: round(greensFees + accommodation),
    breakdown,
  };
}

function round(n) {
  return Math.round(n * 100) / 100;
}

module.exports = { calculateBudget };

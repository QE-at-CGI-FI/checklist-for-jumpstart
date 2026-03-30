export default function TripSummary({ budget }) {
  if (!budget) return null;

  return (
    <div style={{ border: '1px solid #c8e6c9', borderRadius: 8, padding: '1rem', background: '#f1f8f1' }}>
      <h3 style={{ marginTop: 0 }}>Budget Summary</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
        <tbody>
          <tr>
            <td>⛳ Greens fees</td>
            <td style={{ textAlign: 'right' }}>€{budget.greensFees.toFixed(2)}</td>
          </tr>
          <tr>
            <td>🏨 Accommodation</td>
            <td style={{ textAlign: 'right' }}>€{budget.accommodation.toFixed(2)}</td>
          </tr>
          <tr style={{ fontWeight: 700, fontSize: '1.05rem', borderTop: '1px solid #a5d6a7' }}>
            <td>Total</td>
            <td style={{ textAlign: 'right' }}>€{budget.total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {budget.breakdown?.length > 0 && (
        <details style={{ marginTop: '0.75rem' }}>
          <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#2d6a2d' }}>Per-course breakdown</summary>
          <table style={{ width: '100%', fontSize: '0.82rem', marginTop: '0.5rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Course</th>
                <th>Greens</th>
                <th>Accom.</th>
                <th>Sub</th>
              </tr>
            </thead>
            <tbody>
              {budget.breakdown.map((row, i) => (
                <tr key={i}>
                  <td>{row.courseName}</td>
                  <td style={{ textAlign: 'right' }}>€{row.greensFee.toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>€{row.accommodationCost.toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>€{row.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </div>
  );
}

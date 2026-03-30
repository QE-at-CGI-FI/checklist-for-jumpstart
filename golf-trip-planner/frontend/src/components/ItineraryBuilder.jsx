import { useState } from 'react';
import { useApi } from '../hooks/useApi';

export default function ItineraryBuilder({ tripId, itinerary, distances, onUpdate }) {
  const api = useApi();
  const [error, setError] = useState('');

  async function handleRemove(itemId) {
    if (!window.confirm('Remove this course from the trip?')) return;
    try {
      await api.removeItineraryItem(tripId, itemId);
      onUpdate();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateFee(itemId, value) {
    try {
      await api.updateItineraryItem(tripId, itemId, { greensFeeEstimate: value });
      onUpdate();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateAccommodation(itemId, data) {
    try {
      await api.updateItineraryItem(tripId, itemId, data);
      onUpdate();
    } catch (err) {
      setError(err.message);
    }
  }

  function getDistanceToPrevious(index) {
    return distances.find(d => d.toIndex === index);
  }

  return (
    <div>
      <h2>Itinerary</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {itinerary.length === 0
        ? <p style={{ color: '#888' }}>No courses added yet. <a href="/search">Find courses</a> to add to this trip.</p>
        : (
          <div>
            {itinerary.map((item, index) => {
              const leg = getDistanceToPrevious(index);
              return (
                <div key={item.id}>
                  {leg && (
                    <div style={{ color: '#555', fontSize: '0.85rem', padding: '0.25rem 1rem', borderLeft: '2px dashed #a5d6a7' }}>
                      🚗 {leg.distanceKm} km · ~{leg.durationMin} min drive
                    </div>
                  )}
                  <div style={{ border: '1px solid #c8e6c9', borderRadius: 8, padding: '1rem', marginBottom: 8, background: '#f9fff9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{index + 1}. {item.course_name}</strong>
                      <button onClick={() => handleRemove(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                    </div>
                    {item.visit_date && <p style={{ margin: '0.25rem 0', color: '#555', fontSize: '0.85rem' }}>📅 {item.visit_date}</p>}

                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', fontSize: '0.9rem' }}>
                      <label>Greens fee (€):
                        <input
                          type="number" min={0} step={1}
                          defaultValue={item.greens_fee_estimate ?? ''}
                          onBlur={e => handleUpdateFee(item.id, e.target.value)}
                          style={{ width: 90, marginLeft: 6 }}
                        />
                      </label>
                    </div>

                    <AccommodationSection item={item} onSave={data => handleUpdateAccommodation(item.id, data)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}

function AccommodationSection({ item, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    accommodationName: item.accommodation_name || '',
    accommodationUrl: item.accommodation_url || '',
    accommodationCost: item.accommodation_cost ?? '',
  });

  function handleSave() {
    onSave(form);
    setEditing(false);
  }

  if (!editing && !item.accommodation_name) {
    return <button onClick={() => setEditing(true)} style={{ marginTop: 8, fontSize: '0.85rem' }}>+ Add accommodation</button>;
  }

  if (!editing) {
    return (
      <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#444' }}>
        🏨 <a href={item.accommodation_url} target="_blank" rel="noopener noreferrer">{item.accommodation_name}</a>
        {item.accommodation_cost && ` · €${item.accommodation_cost}`}
        <button onClick={() => setEditing(true)} style={{ marginLeft: 8, fontSize: '0.8rem' }}>Edit</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.9rem' }}>
      <input placeholder="Accommodation name" value={form.accommodationName} onChange={e => setForm(f => ({ ...f, accommodationName: e.target.value }))} />
      <input placeholder="Booking URL" value={form.accommodationUrl} onChange={e => setForm(f => ({ ...f, accommodationUrl: e.target.value }))} />
      <input type="number" placeholder="Cost (€)" value={form.accommodationCost} onChange={e => setForm(f => ({ ...f, accommodationCost: e.target.value }))} style={{ width: 120 }} />
      <div><button onClick={handleSave}>Save</button> <button onClick={() => setEditing(false)}>Cancel</button></div>
    </div>
  );
}

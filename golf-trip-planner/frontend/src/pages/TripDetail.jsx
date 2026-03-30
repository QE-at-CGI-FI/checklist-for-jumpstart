import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import ItineraryBuilder from '../components/ItineraryBuilder';
import TripSummary from '../components/TripSummary';
import WeatherWidget from '../components/WeatherWidget';

export default function TripDetail() {
  const { id } = useParams();
  const api = useApi();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function reloadTrip() {
    api.getTrip(id)
      .then(data => setTrip(data?.trip))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { reloadTrip(); }, [id]);

  if (loading) return <p>Loading trip…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!trip) return null;

  return (
    <div>
      <h1>{trip.name}</h1>
      {trip.start_date && <p style={{ color: '#555' }}>{trip.start_date} → {trip.end_date}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <ItineraryBuilder tripId={id} itinerary={trip.itinerary || []} distances={trip.distances || []} onUpdate={reloadTrip} />
        </div>
        <div>
          <TripSummary budget={trip.budget} />
          {trip.weather?.length > 0 && <WeatherWidget days={trip.weather} />}
        </div>
      </div>
    </div>
  );
}

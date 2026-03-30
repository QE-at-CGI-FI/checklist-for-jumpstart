import { useAuth } from '../context/AuthContext';

const BASE = '/api';

function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export function useApi() {
  const { token, logout } = useAuth();

  async function request(method, path, body) {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: authHeaders(token),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) { logout(); return; }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `API error ${res.status}`);
    }
    return res.json();
  }

  return {
    getTrips: () => request('GET', '/trips'),
    createTrip: (data) => request('POST', '/trips', data),
    deleteTrip: (id) => request('DELETE', `/trips/${id}`),
    getTrip: (id) => request('GET', `/trips/${id}`),
    addCourseToTrip: (tripId, data) => request('POST', `/trips/${tripId}/itinerary`, data),
    updateItineraryItem: (tripId, itemId, data) => request('PATCH', `/trips/${tripId}/itinerary/${itemId}`, data),
    removeItineraryItem: (tripId, itemId) => request('DELETE', `/trips/${tripId}/itinerary/${itemId}`),
    searchCourses: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request('GET', `/courses/search?${qs}`);
    },
    getCourseDetails: (id) => request('GET', `/courses/${id}`),
    searchAccommodations: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request('GET', `/accommodations/search?${qs}`);
    },
  };
}

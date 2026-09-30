import { useEffect, useState } from "react";

export default function useGeolocation() {
  const [pos, setPos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setError("");
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy) });
      },
      (e) => setError(e.code === 1 ? "Location permission denied. Allow location in the browser." : "Unable to get location."),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return { pos, error };
}

import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();
const BASE_URL = "https://charrison19807.github.io/data/world-wise";

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  useEffect(function () {
    async function fetchCities() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/cities.json`);
        const data = await res.json();
        setCities(data.cities);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(cityId) {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/cities.json`);
      const data = await res.json();
      const city = data.cities.find((city) => city.id === Number(cityId));
      setCurrentCity(city);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }
  return (
    <CitiesContext.Provider value={{ cities, loading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("Cities context was used outside CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };

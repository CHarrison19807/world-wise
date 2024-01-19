import { createContext, useContext, useEffect, useState } from "react";

let citiesArray = [
  {
    cityName: "Lisbon",
    country: "Portugal",
    emoji: "🇵🇹",
    date: "2027-10-31T15:59:59.138Z",
    notes: "My favorite city so far!",
    position: {
      lat: 38.727881642324164,
      lng: -9.140900099907554,
    },
    id: 73930385,
  },
  {
    cityName: "Madrid",
    country: "Spain",
    emoji: "🇪🇸",
    date: "2027-07-15T08:22:53.976Z",
    notes: "",
    position: {
      lat: 40.46635901755316,
      lng: -3.7133789062500004,
    },
    id: 17806751,
  },
  {
    cityName: "Berlin",
    country: "Germany",
    emoji: "🇩🇪",
    date: "2027-02-12T09:24:11.863Z",
    notes: "Amazing 😃",
    position: {
      lat: 52.53586782505711,
      lng: 13.376933665713324,
    },
    id: 98443197,
  },
];
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
      let city;
      const res = await fetch(`${BASE_URL}/cities.json`);
      const data = await res.json();
      city = data.cities.find((city) => city.id === Number(cityId));
      if (!city) {
        city = citiesArray.find((city) => city.id === Number(cityId));
      }

      setCurrentCity(city);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setLoading(true);
      // CAN NOT POST TO GITHUB PAGES, UPDATE DATA LOCALLY
      // const res = await fetch(`${BASE_URL}/cities.json`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newCity),
      // });
      // const data = await res.json();
      if (citiesArray.find((city) => city.cityName === newCity.cityName))
        return;
      citiesArray.push(newCity);
      setCities(citiesArray);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }
  return (
    <CitiesContext.Provider
      value={{ cities, loading, currentCity, getCity, createCity }}
    >
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

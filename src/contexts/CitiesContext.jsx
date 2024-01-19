import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

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
const initialState = {
  cities: [],
  loading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/created":
      if (
        !citiesArray.find((city) => city.cityName === action.payload.cityName)
      )
        citiesArray.push(action.payload);
      return {
        ...state,
        isLoading: false,
        cities: citiesArray,
        currentCity: action.payload,
      };
    case "city/deleted":
      citiesArray = citiesArray.filter((city) => city.id !== action.payload);
      return {
        ...state,
        isLoading: false,
        cities: citiesArray,
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}
function CitiesProvider({ children }) {
  const [{ cities, loading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities.json`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data.cities });
      } catch (err) {
        dispatch({ type: "rejected", payload: "Error getting cities" });
      }
    }
    fetchCities();
  }, []);

  async function getCity(cityId) {
    if (Number(cityId) === currentCity.id) return;
    dispatch({ type: "loading" });
    try {
      let city;
      const res = await fetch(`${BASE_URL}/cities.json`);
      const data = await res.json();
      city = data.cities.find((city) => city.id === Number(cityId));
      if (!city) {
        city = citiesArray.find((city) => city.id === Number(cityId));
      }
      dispatch({ type: "city/loaded", payload: city });
    } catch (err) {
      dispatch({ type: "rejected", payload: "Error getting city" });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      // CAN NOT POST TO GITHUB PAGES, UPDATE DATA LOCALLY
      // const res = await fetch(`${BASE_URL}/cities.json`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newCity),
      // });
      // const data = await res.json();
      dispatch({ type: "city/created", payload: newCity });
    } catch (err) {
      dispatch({ type: "rejected", payload: "Error creating city" });
    }
  }

  async function deleteCity(cityId) {
    dispatch({ type: "loading" });

    try {
      // CAN NOT DELETE TO GITHUB PAGES, UPDATE DATA LOCALLY
      // const res = await fetch(`${BASE_URL}/cities.json/${id}`,
      //   { method: "DELETE" }
      // );
      // const data = await res.json();
      dispatch({ type: "city/deleted", payload: cityId });
    } catch (err) {
      dispatch({ type: "rejected", payload: "Error deleting city" });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        loading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
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

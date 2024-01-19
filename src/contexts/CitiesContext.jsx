import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

let citiesArray = [
  {
    cityName: "San Diego",
    country: "United States",
    emoji: "🇺🇸",
    date: "2018-07-12T09:24:11.863Z",
    notes: "Sunny ☀️",
    position: {
      lat: 32.71783267244577,
      lng: -117.16403961181642,
    },
    id: 72501492,
  },

  {
    cityName: "Toronto",
    country: "Canada",
    emoji: "🇨🇦",
    date: "2020-03-12T08:22:53.976Z",
    notes: "",
    position: {
      lat: 43.653465927607364,
      lng: -79.38377380371095,
    },
    id: 17806751,
  },
  {
    cityName: "Oranjestad",
    country: "Aruba",
    emoji: "🇦🇼",
    date: "2021-02-12T09:24:11.863Z",
    notes: "Amazing 😃",
    position: {
      lat: 12.526915162568734,
      lng: -70.03616809844972,
    },
    id: 98443197,
  },
  {
    cityName: "Ottawa",
    country: "Canada",
    emoji: "🇨🇦",
    date: "2023-10-31T15:59:59.138Z",
    notes: "My favorite city so far!",
    position: {
      lat: 45.42062422307843,
      lng: -75.69168090820314,
    },
    id: 73930385,
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
      ) {
        citiesArray.push(action.payload);

        console.log(citiesArray);
      }

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

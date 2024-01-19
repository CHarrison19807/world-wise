import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

let citiesArray = [];
const CitiesContext = createContext();
// const BASE_URL = "https://charrison19807.github.io/data/world-wise";
const initialState = {
  cities: [],
  loading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true, error: false };
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
        //   const res = await fetch(`${BASE_URL}/cities.json`);
        //   const data = await res.json();
        dispatch({ type: "cities/loaded", payload: citiesArray });
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
      // WON'T HAVE PRESET DATA IN PRODUCTION
      // let city;
      // const res = await fetch(`${BASE_URL}/cities.json`);
      // const data = await res.json();
      // city = data.cities.find((city) => city.id === Number(cityId));
      // if (!city) {
      //   city = citiesArray.find((city) => city.id === Number(cityId));
      // }
      dispatch({ type: "city/loaded", payload: cityId });
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

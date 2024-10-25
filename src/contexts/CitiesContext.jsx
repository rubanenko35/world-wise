import {createContext, useContext, useEffect, useReducer} from "react";

const BASE_URL = "http://localhost:9000";
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return {...state, isLoading: true};
    case 'rejected':
      return {...state, isLoading: false, error: action.payload};
    case 'cities/loaded':
      return {...state, cities: action.payload, isLoading: false};
    case 'city/loaded':
      return {...state, currentCity: action.payload, isLoading: false};
    case 'city/created':
      return {...state, cities: [...state.cities, action.payload], currentCity: action.payload, isLoading: false};
    case 'city/deleted':
      const cities = state.cities.filter(city => city.id !== action.payload)
      return {...state, cities, isLoading: false};
    default:
      throw new Error(`Action type "${action.type}" is not supported`);
  }
}

function CitiesProvider({children}) {
  const [{cities, isLoading, currentCity}, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    async function fetchCities(params) {
      try {
        dispatch({ type: 'loading' });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: 'cities/loaded', payload: data });
      } catch (err) {
        dispatch({ type: 'rejected', payload: 'Cannot fetch cities' });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      dispatch({ type: 'loading' });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: 'city/loaded', payload: data });
    } catch (err) {
      dispatch({ type: 'rejected', payload: `Cannot fetch cities. Id "${id}"` });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: 'loading' });
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();

      dispatch({ type: 'city/created', payload: data });
    } catch (err) {
      dispatch({ type: 'rejected', payload: `Cannot create city` });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: 'loading' });
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      await res.json();
      dispatch({ type: 'city/deleted', payload: id });
    } catch (err) {
      dispatch({ type: 'rejected', payload: `Cannot delete city. Id "${id}"` });
    }
  }


  return <CitiesContext.Provider
    value={{cities, isLoading, currentCity, getCity, createCity, deleteCity}}>{children}</CitiesContext.Provider>;
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

export {CitiesProvider, useCities};

import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import Message from "./Message.jsx";
import CountryItem from "./CountryItem.jsx";
import {useCities} from "../contexts/CitiesContext.jsx";

function CountryList() {
  const {cities, isLoading} = useCities();

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  if (!cities.length) {
    return <Message message="Add your first city by clicking on a city on the map"></Message>
  }

  const countries = cities.reduce((arr, city) => {
    if (arr.find((country) => country.country === city.country)) {
      return arr;
    } else {
      return [...arr, {id: city.country, country: city.country, emoji: city.emoji}];
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((item) => {
        return <CountryItem key={item.id} country={item}></CountryItem>;
      })}
    </ul>
  );
}

export default CountryList;

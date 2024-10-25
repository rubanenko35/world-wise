import Spinner from "./Spinner";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message.jsx";
import {useCities} from "../contexts/CitiesContext.jsx";

function CityList() {
  const {cities, isLoading} = useCities();

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  if (!cities.length) {
    return <Message message="Add your first city by clicking on a city on the map"></Message>
  }

  return (
    <ul className={styles.cityList}>
      {cities.map((item) => {
        return <CityItem key={item.id} city={item}></CityItem>;
      })}
    </ul>
  );
}

export default CityList;

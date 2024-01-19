import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./SpinnerFullPage";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
function CityList() {
  const { cities, loading } = useCities();
  if (loading) {
    return <Spinner />;
  }

  if (!cities.length) {
    return (
      <Message message="Add your first city by clicking on a city on the map!" />
    );
  }

  return (
    <ul style={styles.CityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;

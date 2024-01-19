import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>
        {country.country === "United States of America (the)"
          ? "United States"
          : country.country}
      </span>
    </li>
  );
}

export default CountryItem;

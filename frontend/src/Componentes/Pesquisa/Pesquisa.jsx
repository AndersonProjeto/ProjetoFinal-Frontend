import { FiSearch } from "react-icons/fi";
import style from "./Pesquisa.module.css";

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  width = "100%",
  icon = <FiSearch size={18} />,
}) {
  return (
    <div className={style.searchGroup} style={{ maxWidth: width }}>
      <span className={style.searchIcon}>{icon}</span>
      <input
        type="text"
        placeholder={placeholder}
        className={style.searchInput}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

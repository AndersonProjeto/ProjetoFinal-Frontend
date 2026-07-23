import style from "./Spinner.module.css";

export function Spinner({ size = 28 }) {
  return <div className={style.spinner} style={{ width: size, height: size }} />;
}

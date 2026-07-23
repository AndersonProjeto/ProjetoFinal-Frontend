import style from "./SeletorGrupoMuscular.module.css";

const GRUPOS_MUSCULARES = [
  { valor: "Peito", rotulo: "Peito" },
  { valor: "Costas", rotulo: "Costas" },
  { valor: "Pernas", rotulo: "Pernas" },
  { valor: "Ombros", rotulo: "Ombros" },
  { valor: "Biceps", rotulo: "Bíceps" },
  { valor: "Triceps", rotulo: "Tríceps" },
  { valor: "Abdomen", rotulo: "Abdômen" },
];

export function SeletorGrupoMuscular({ label, placeholder, value, onChange }) {
  return (
    <div className={style.fieldGroup}>
      <label className={style.fieldLabel}>{label}</label>
      <select className={style.select} value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {GRUPOS_MUSCULARES.map((grupo) => (
          <option key={grupo.valor} value={grupo.valor}>
            {grupo.rotulo}
          </option>
        ))}
      </select>
    </div>
  );
}

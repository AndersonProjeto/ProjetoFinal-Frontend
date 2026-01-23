
export function EscolherAvatar() {
  const usuarioId = localStorage.getItem("usuarioId");
  const [avatar, setAvatar] = useState({
    estilo: "avataaars",
    seed: usuarioId,
  });

  return (
    <div>
      <h3>Escolha seu avatar</h3>

      <div className={styles.grid}>
        {["avataaars", "adventurer", "big-smile"].map((estilo) => (
          <img
            key={estilo}
            src={gerarAvatar(estilo, usuarioId)}
            className={styles.avatar}
            onClick={() => setAvatar({ estilo, seed: usuarioId })}
          />
        ))}
      </div>

      <h4>Preview</h4>
      <img
        src={gerarAvatar(avatar.estilo, avatar.seed)}
        className={styles.avatarGrande}
      />
    </div>
  );
}
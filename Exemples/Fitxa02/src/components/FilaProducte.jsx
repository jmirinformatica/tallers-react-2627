function FilaProducte({ producte, onEsborra }) {
  return (
    <li>
      <span>{producte.nom}</span>
      <button type="button" onClick={() => onEsborra(producte.id)}>
        Esborra {producte.nom}
      </button>
    </li>
  )
}

export default FilaProducte

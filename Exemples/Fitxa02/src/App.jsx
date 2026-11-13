import { useState } from 'react'
import FilaProducte from './components/FilaProducte.jsx'

const PRODUCTES_INICIALS = [
  { id: 1, nom: 'Llibreta' },
  { id: 2, nom: 'Llapis' },
  { id: 3, nom: 'Goma' },
]

function App() {
  const [productes, setProductes] = useState(PRODUCTES_INICIALS)

  function esborraProducte(id) {
    setProductes((anteriors) =>
      anteriors.filter((producte) => producte.id !== id),
    )
  }

  function reiniciaLlista() {
    setProductes(PRODUCTES_INICIALS)
  }

  return (
    <main>
      <h1>Productes: de pare a fills</h1>
      <p>
        App guarda la llista. Cada filera rep un producte i una funció per avisar
        quin vol esborrar.
      </p>

      {productes.length > 0 ? (
        <ul>
          {productes.map((producte) => (
            <FilaProducte
              key={producte.id}
              producte={producte}
              onEsborra={esborraProducte}
            />
          ))}
        </ul>
      ) : (
        <p>La llista és buida.</p>
      )}

      <button type="button" onClick={reiniciaLlista}>
        Reinicia la llista
      </button>
    </main>
  )
}

export default App

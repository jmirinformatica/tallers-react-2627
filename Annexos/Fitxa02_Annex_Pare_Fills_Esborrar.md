# Pare, fills i callbacks: esborrar un producte

[← Torna a la Fitxa 02 — Components i props](../Fitxa02.md)

## La pregunta

Tenim tres productes en una llista. Cada filera té un botó «Esborra». Si el botó és dins del component `FilaProducte`, però l'array de productes és a `App`, **qui pot canviar la llista?**

`App` és el **pare** i és qui guarda l'estat. Cada `FilaProducte` és un **fill**: rep les dades d'un producte per mostrar-les, però no té l'array complet ni el seu `setProductes`. El botó del fill necessita avisar `App` de quin producte vol esborrar.

```text
App (useState: productes)
  ├── FilaProducte (producte: id 1, onEsborra)
  ├── FilaProducte (producte: id 2, onEsborra)
  └── FilaProducte (producte: id 3, onEsborra)

clic a «Esborra» a la filera 2 → onEsborra(2) → App filtra l'id 2
                           ← React torna a renderitzar la llista sense la filera 2
```

## 1. El pare té l'estat i decideix com canviar-lo

A `App`, la funció `esborraProducte` rep un `id` i crea **un array nou** sense el producte corresponent:

```jsx
const [productes, setProductes] = useState([
  { id: 1, nom: 'Llibreta' },
  { id: 2, nom: 'Llapis' },
  { id: 3, nom: 'Goma' },
])

function esborraProducte(id) {
  setProductes((anteriors) =>
    anteriors.filter((producte) => producte.id !== id),
  )
}
```

`filter` conserva els productes amb un `id` diferent. No modifiquem l'array original amb `splice` ni guardem una còpia de l'estat a cada fill.

Quan dibuixa la llista, `App` passa **el mateix callback** a totes les fileres, a més de les dades de cadascuna:

```jsx
{productes.map((producte) => (
  <FilaProducte
    key={producte.id}
    producte={producte}
    onEsborra={esborraProducte}
  />
))}
```

`key` serveix perquè React identifiqui cada filera quan desapareix una; **no arriba al fill com a prop**. En canvi, `producte` i `onEsborra` sí que hi arriben. Escriure `onEsborra={esborraProducte}` passa la funció, **no l'executa**.

## 2. El fill sap quin producte representa

Cada `FilaProducte` rep el seu producte i la funció del pare. No necessita `useState`:

```jsx
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
```

L'expressió `() => onEsborra(producte.id)` **espera el clic** i aleshores comunica l'`id` d'aquesta filera. Si escrivíssim `onClick={onEsborra(producte.id)}`, la funció s'executaria **mentre React dibuixa la pàgina**, abans de fer clic. `onClick={onEsborra}` tampoc no serviria aquí: el navegador li passaria l'esdeveniment, no l'`id` del producte.

## 3. Segueix un clic pas a pas

Suposa que fas clic al botó de «Llapis» (`id: 2`):

1. La filera de «Llapis» executa `onEsborra(2)`.
2. Aquest prop apunta a `esborraProducte` d'`App`, que rep `2`.
3. `setProductes` conserva «Llibreta» i «Goma» amb `filter`.
4. React torna a dibuixar `App` i les fileres amb els productes que queden.

**Les dades baixen** (`producte`); **la petició de canvi puja** (`onEsborra(id)`). El fill no esborra res directament: indica *quin* producte, i el pare decideix *com* actualitzar l'estat. És el mateix patró que `Comptador` de la Fitxa 02 fa servir amb `onCanvia(pas)`.

## Prova-ho tu

Executa el [projecte de demostració de la Fitxa 02](../Exemples/Fitxa02/README.md). Abans de prémer cap botó, prediu quines fileres quedaran després d'esborrar «Llapis» i després «Llibreta». Obre [`src/App.jsx`](../Exemples/Fitxa02/src/App.jsx) i [`src/components/FilaProducte.jsx`](../Exemples/Fitxa02/src/components/FilaProducte.jsx) i localitza l'estat, el callback, el prop i l'`id` enviat. Després prova els botons i comprova la predicció.

Aquest exemple és **complementari**: no cal afegir productes al projecte `hola-mon` ni canvia els requisits de les activitats de la Fitxa 02.

# Fitxa 02 — Pare, fills i esborrat de productes

Projecte React amb JavaScript i Vite per experimentar amb l'[annex de components pare i fills](../../Annexos/Fitxa02_Annex_Pare_Fills_Esborrar.md) de la [Fitxa 02](../../Fitxa02.md). No necessita Tailwind ni cap API. És una demostració independent: **no substitueix** `hola-mon` ni afegeix requisits a les activitats.

## Executar

Requisits: Node.js >=22.22.2, npm i un navegador actual.

Des de l'arrel del repositori:

```bash
cd Exemples/Fitxa02
npm ci
npm run dev
```

Obre l'adreça indicada a la terminal (normalment `http://localhost:5173`). Si el port està ocupat, Vite n'escull un altre. Atura el servidor amb `Ctrl+C`.

Per comprovar la versió de producció, des de la mateixa carpeta:

```bash
npm run build
npm run preview
```

## Què cal observar

- Al principi hi ha tres productes: Llibreta, Llapis i Goma.
- Prem «Esborra Llapis»: desapareix **només** Llapis; queden Llibreta i Goma.
- Prem «Esborra Llibreta»: queda Goma. Prem «Esborra Goma»: es mostra el missatge de llista buida.
- «Reinicia la llista» torna a mostrar els tres productes per repetir la prova.
- Cada filera té el seu botó, però **l'estat i la funció que l'actualitza viuen a `App`**.

## Codi per explorar

- [`src/App.jsx`](src/App.jsx): estat, `filter`, `.map()`, `key` i pas del callback.
- [`src/components/FilaProducte.jsx`](src/components/FilaProducte.jsx): props i botó que envia l'`id` de la filera.
- [`src/main.jsx`](src/main.jsx): muntatge de React.

**Pregunta abans de fer clic:** per què `onClick={() => onEsborra(producte.id)}` funciona per a cada filera, mentre que `onClick={onEsborra(producte.id)}` executaria l'esborrat abans de clicar?

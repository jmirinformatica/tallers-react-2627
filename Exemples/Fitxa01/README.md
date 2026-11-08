# Fitxa 01 — Actualització de l'estat

Projecte React amb JavaScript i Vite extret de l'[annex d'actualització de
l'estat](../../Annexos/Fitxa01_Annex_Actualitzacio_Estat.md) de la
[Fitxa 01](../../Fitxa01.md). No necessita Tailwind ni cap API.

És una demostració independent: no substitueix el projecte acumulatiu
`hola-mon` ni afegeix requisits a les activitats.

## Executar

Requisits: **Node.js >=22.22.2**, npm i un navegador actual.

Des de l'arrel del repositori:

```bash
cd Exemples/Fitxa01
npm ci
npm run dev
```

Obre l'adreça indicada a la terminal (normalment `http://localhost:5173`).
Si el port està ocupat, Vite n'escull un altre. Atura el servidor amb `Ctrl+C`.

Per comprovar la versió de producció, des de la mateixa carpeta:

```bash
npm run build
npm run preview
```

## Què cal observar

Abans de cada prova, prem **Reiniciar tots els exemples** per partir de zero.
Els casos 1 i 3 comparteixen el comptador directe; els casos 2 i 3, el funcional.

| Prova | Resultat des de zero |
|---|---|
| 1. Actualització directa | Passa de 0 a 1. |
| 2. Actualització funcional | Passa de 0 a 1. |
| 3. Tres crides directes | Passa de 0 a 1, no a 3. |
| 3. Tres crides funcionals | Passa de 0 a 3. |
| 4. Incrementar i mostrar `console.log` | La consola mostra 0 als dos missatges; la pantalla passa a 1. |
| 5. Alternar estat | Alterna entre INACTIU i ACTIU. |
| 6. Escriure el nom | El text escrit apareix al paràgraf inferior. |
| 7. Assignar 10 | El comptador directe passa a 10. |
| Reiniciar | Tots els comptadors tornen a 0, el booleà a INACTIU i el nom queda buit. |

Per al cas 4, obre la pestanya **Consola** de les eines de desenvolupador
(F12). Cada clic mostra dos missatges amb el valor anterior, perquè el setter
no canvia la variable local del gestor d'esdeveniments.

El projecte utilitza `StrictMode`: en desenvolupament, React pot executar
les funcions actualitzadores més d'una vegada per detectar impureses, però
això no duplica el resultat del comptador ni els clics.

## Codi per explorar

- [`src/App.jsx`](src/App.jsx): les dues formes del setter i tots els casos interactius.
- [`src/main.jsx`](src/main.jsx): muntatge de React amb `StrictMode`.
- [`src/index.css`](src/index.css): estils bàsics, sense dependències addicionals.

**Prova guiada:** prediu el resultat del cas 3 abans de prémer els botons.
Després, compara les tres expressions de `tripleDirecte` amb les tres funcions
de `tripleFuncional` i justifica'n el resultat amb la teoria de l'annex.

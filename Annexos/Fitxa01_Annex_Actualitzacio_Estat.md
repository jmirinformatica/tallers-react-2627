# React: actualització de l'estat amb `useState`

[← Torna a la Fitxa 01 — Primers passos amb React](../Fitxa01.md)

## Objectius

Entendre la diferència entre aquestes dues expressions:

```jsx
setValor(valor + 1);
setValor(anterior => anterior + 1);
```

Les dues són correctes, però **no són equivalents en totes les situacions**:

- **Actualització directa:** `setValor(valor + 1)` calcula el valor nou a partir de la variable `valor` de la renderització actual.
- **Actualització funcional:** `setValor(anterior => anterior + 1)` proporciona a React una funció que calcularà el valor nou a partir de l'**estat pendent més recent** quan es processi l'actualització.

> **Idea clau:** cridar una funció `set...` no modifica immediatament la variable d'estat dins del codi que s'està executant. El nou valor estarà disponible en una renderització posterior.

## 1. Actualització directa: `setValor(valor + 1)`

```jsx
const [valor, setValor] = useState(0);

function incrementar() {
  setValor(valor + 1);
}
```

Quan es crida `incrementar`, l'expressió `valor + 1` s'avalua amb el valor que `valor` tenia **en aquella renderització**. Si `valor` és 0, es programa `setValor(1)`.

### Què passa amb tres crides consecutives?

```jsx
function incrementar() {
  setValor(valor + 1);
  setValor(valor + 1);
  setValor(valor + 1);
}
```

Suposem que `valor` és inicialment **0**. Les tres expressions fan servir el **mateix** valor capturat:

| Crida | Valor de `valor` en aquesta renderització | Valor programat |
|---|---:|---:|
| 1 | 0 | 1 |
| 2 | 0 | 1 |
| 3 | 0 | 1 |

**Resultat final: 1**, no 3.

React agrupa habitualment les actualitzacions (*batching*) i les processa sense modificar la variable `valor` que ja s'està utilitzant dins de la funció.

## 2. Actualització funcional: `setValor(anterior => anterior + 1)`

```jsx
function incrementar() {
  setValor(anterior => anterior + 1);
}
```

En aquest cas, passem **una funció actualitzadora**, no un valor calculat immediatament. React hi passa l'estat pendent més recent i fa servir el resultat per a l'actualització següent.

### Tres crides consecutives

```jsx
function incrementar() {
  setValor(anterior => anterior + 1);
  setValor(anterior => anterior + 1);
  setValor(anterior => anterior + 1);
}
```

Amb un valor inicial de **0**:

| Actualització | Estat pendent rebut (`anterior`) | Nou estat |
|---|---:|---:|
| 1 | 0 | 1 |
| 2 | 1 | 2 |
| 3 | 2 | 3 |

**Resultat final: 3.**

El nom `anterior` és arbitrari: també pots escriure `v => v + 1` o `prev => prev + 1`. Les funcions actualitzadores han de ser **pures**: han de calcular el nou estat sense modificar objectes existents ni provocar efectes secundaris.

## 3. Per què passa? Renderitzacions i *batching*

Cada renderització d'un component React té una mena de **fotografia** dels valors d'estat. Quan un gestor d'esdeveniments s'executa, llegeix aquesta fotografia; les crides a `setValor` sol·liciten actualitzacions per a la renderització següent.

En un mateix esdeveniment, React normalment **agrupa les actualitzacions** per evitar renderitzacions innecessàries. Per això:

```jsx
setValor(valor + 1);
setValor(valor + 1);
setValor(valor + 1);
```

no equival a:

```jsx
setValor(anterior => anterior + 3);
```

En canvi, tres actualitzacions funcionals consecutives que sumen 1 sí que condueixen a un increment total de 3.

**Matís:** React pot processar les funcions actualitzadores més endavant i, en mode de desenvolupament amb `StrictMode`, pot executar-les més d'una vegada per detectar impureses. Per això no hi hem de posar efectes secundaris.

## 4. `console.log` immediatament després del setter

```jsx
const [valor, setValor] = useState(0);

function incrementar() {
  console.log("ABANS:", valor);
  setValor(anterior => anterior + 1);
  console.log("DESPRÉS:", valor);
}
```

Si el valor actual és 0, els dos missatges mostren **0**. Això no vol dir que React no hagi registrat l'actualització; vol dir que la variable `valor` continua representant l'estat de la renderització en curs.

Després, React renderitzarà el component amb `valor` igual a 1.

> **Important:** la forma funcional evita que les actualitzacions successives es calculin sobre un estat obsolet, però **tampoc canvia immediatament** la variable local `valor`.

## 5. Altres casos habituals

| Situació | Codi recomanat | Motiu |
|---|---|---|
| Incrementar un comptador | `setValor(v => v + 1)` | Depèn de l'estat pendent anterior. |
| Decrementar un comptador | `setValor(v => v - 1)` | Depèn de l'estat pendent anterior. |
| Alternar un booleà | `setActiu(v => !v)` | Inverteix l'estat més recent. |
| Assignar un valor fix | `setValor(10)` | No cal consultar el valor anterior. |
| Capturar un input | `setNom(e.target.value)` | Assignem el valor rebut de l'esdeveniment. |

### Exemple: alternar un booleà

```jsx
const [actiu, setActiu] = useState(false);

function alternar() {
  setActiu(anterior => !anterior);
}
```

### Exemple: llegir un input

```jsx
const [nom, setNom] = useState("");

<input
  value={nom}
  onChange={e => setNom(e.target.value)}
/>
```

### Exemple: assignar un valor fix

```jsx
setValor(10);
```

## 6. Projecte per experimentar

El component complet és al projecte [Exemples/Fitxa01](../Exemples/Fitxa01/README.md),
preparat per executar-lo amb React i Vite. El seu README explica com
instal·lar-lo, engegar-lo i provar cada cas. El codi és a
[`src/App.jsx`](../Exemples/Fitxa01/src/App.jsx).

És un projecte independent: no cal substituir l'`App.jsx` del teu `hola-mon`
ni afegir-hi dependències. Conserva'l per continuar les activitats del taller.

## 7. Resultats que cal observar

| Exemple | Què s'observa? |
|---|---|
| 1. Directe | Incrementa 1. |
| 2. Funcional | Incrementa 1. |
| 3. Triple directe | Incrementa 1, no 3. |
| 3. Triple funcional | Incrementa 3. |
| 4. `console.log` | Mostra dues vegades el valor de la renderització actual. |
| 5. Booleà | Alterna entre `true` i `false`. |
| 6. Input | Actualitza el text introduït. |
| 7. Valor fix | Assigna 10. |

**Proposta per a classe:** abans de prémer els botons de l'exemple 3, demana als alumnes que prediguin el resultat i que justifiquin per què les dues formes es comporten diferent.

## 8. Conclusions

- `setValor(valor + 1)` és correcte quan volem calcular un valor a partir de l'estat de la renderització actual i sabem que no necessitem encadenar actualitzacions sobre l'estat pendent.
- `setValor(anterior => anterior + 1)` és la forma més robusta quan el nou estat **depèn de l'estat anterior**, especialment quan hi ha actualitzacions consecutives o callbacks que poden conservar valors antics.
- Cap de les dues formes canvia immediatament la variable d'estat que ja està en ús dins del gestor d'esdeveniments.
- Per a valors fixos o dades noves d'un input, l'assignació directa acostuma a ser la més senzilla.

**Referència oficial:** [React — Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates).

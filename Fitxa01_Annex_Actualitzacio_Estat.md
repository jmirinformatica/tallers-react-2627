# React: actualització de l'estat amb `useState`

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

## 6. Component complet per provar a React (Vite)

Copia aquest codi a `src/App.jsx`. No necessita cap dependència addicional a part de React.

```jsx
import { useState } from "react";

export default function App() {
  const [valorDirecte, setValorDirecte] = useState(0);
  const [valorFuncional, setValorFuncional] = useState(0);
  const [valorConsole, setValorConsole] = useState(0);
  const [actiu, setActiu] = useState(false);
  const [nom, setNom] = useState("");

  // EXEMPLE 1: Actualització directa
  function incrementarDirecte() {
    setValorDirecte(valorDirecte + 1);
  }

  // EXEMPLE 2: Actualització funcional
  function incrementarFuncional() {
    setValorFuncional(anterior => anterior + 1);
  }

  // EXEMPLE 3: Tres actualitzacions directes
  function tripleDirecte() {
    setValorDirecte(valorDirecte + 1);
    setValorDirecte(valorDirecte + 1);
    setValorDirecte(valorDirecte + 1);
  }

  // EXEMPLE 4: Tres actualitzacions funcionals
  function tripleFuncional() {
    setValorFuncional(anterior => anterior + 1);
    setValorFuncional(anterior => anterior + 1);
    setValorFuncional(anterior => anterior + 1);
  }

  // EXEMPLE 5: L'estat no canvia immediatament
  function provarConsole() {
    console.log("ABANS:", valorConsole);
    setValorConsole(anterior => anterior + 1);
    console.log("DESPRÉS de setValor:", valorConsole);
  }

  // EXEMPLE 6: Alternar un booleà
  function alternarActiu() {
    setActiu(anterior => !anterior);
  }

  // EXEMPLE 7: Assignar un valor des d'un input
  function canviarNom(e) {
    setNom(e.target.value);
  }

  function reiniciar() {
    setValorDirecte(0);
    setValorFuncional(0);
    setValorConsole(0);
    setActiu(false);
    setNom("");
  }

  return (
    <main style={{
      maxWidth: "900px",
      margin: "30px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>React: actualització de l'estat</h1>

      <p>
        Comparació entre actualització directa i funcional
        amb useState.
      </p>

      <hr />

      <h2>1. Actualització directa</h2>
      <p>Valor: <strong>{valorDirecte}</strong></p>
      <button onClick={incrementarDirecte}>
        setValor(valor + 1)
      </button>
      <p>Utilitza el valor capturat durant la renderització actual.</p>

      <hr />

      <h2>2. Actualització funcional</h2>
      <p>Valor: <strong>{valorFuncional}</strong></p>
      <button onClick={incrementarFuncional}>
        setValor(anterior =&gt; anterior + 1)
      </button>
      <p>Utilitza l'estat pendent més recent.</p>

      <hr />

      <h2>3. Tres actualitzacions consecutives</h2>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div>
          <h3>Forma directa</h3>
          <p>Valor: {valorDirecte}</p>
          <button onClick={tripleDirecte}>
            Incrementar 3 vegades
          </button>
          <p>Resultat: incrementa només 1.</p>
        </div>

        <div>
          <h3>Forma funcional</h3>
          <p>Valor: {valorFuncional}</p>
          <button onClick={tripleFuncional}>
            Incrementar 3 vegades
          </button>
          <p>Resultat: incrementa 3.</p>
        </div>
      </div>

      <hr />

      <h2>4. L'estat no canvia immediatament</h2>
      <p>Valor: {valorConsole}</p>
      <button onClick={provarConsole}>
        Incrementar i mostrar console.log
      </button>
      <p>
        Obre les eines de desenvolupador (F12)
        i observa els dos missatges.
      </p>
      <p>
        Els dos console.log mostren el mateix valor,
        encara que s'hagi cridat setValorConsole.
      </p>

      <hr />

      <h2>5. Alternar un booleà</h2>
      <p>Estat: <strong>{actiu ? "ACTIU" : "INACTIU"}</strong></p>
      <button onClick={alternarActiu}>
        Alternar estat
      </button>
      <p>setActiu(anterior =&gt; !anterior)</p>

      <hr />

      <h2>6. Actualitzar l'estat des d'un input</h2>
      <input
        type="text"
        value={nom}
        onChange={canviarNom}
        placeholder="Escriu el teu nom"
      />
      <p>Nom introduït: <strong>{nom}</strong></p>
      <p>
        Aquí no cal una funció actualitzadora perquè
        assignem directament el valor de l'input.
      </p>

      <hr />

      <h2>7. Assignar un valor fix</h2>
      <button onClick={() => setValorDirecte(10)}>
        Assignar 10 al comptador directe
      </button>
      <p>
        Quan volem assignar un valor fix,
        podem utilitzar setValor(10).
      </p>

      <hr />

      <button onClick={reiniciar}>
        Reiniciar tots els exemples
      </button>
    </main>
  );
}
```

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

import { useState } from 'react'

export default function App() {
  const [valorDirecte, setValorDirecte] = useState(0)
  const [valorFuncional, setValorFuncional] = useState(0)
  const [valorConsole, setValorConsole] = useState(0)
  const [actiu, setActiu] = useState(false)
  const [nom, setNom] = useState('')

  function incrementarDirecte() {
    setValorDirecte(valorDirecte + 1)
  }

  function incrementarFuncional() {
    setValorFuncional(anterior => anterior + 1)
  }

  // Les tres expressions llegeixen la mateixa fotografia de l'estat.
  function tripleDirecte() {
    setValorDirecte(valorDirecte + 1)
    setValorDirecte(valorDirecte + 1)
    setValorDirecte(valorDirecte + 1)
  }

  // Cada funció rep l'estat pendent que ha deixat l'anterior.
  function tripleFuncional() {
    setValorFuncional(anterior => anterior + 1)
    setValorFuncional(anterior => anterior + 1)
    setValorFuncional(anterior => anterior + 1)
  }

  function provarConsole() {
    console.log('ABANS:', valorConsole)
    setValorConsole(anterior => anterior + 1)
    console.log('DESPRÉS de setValor:', valorConsole)
  }

  function alternarActiu() {
    setActiu(anterior => !anterior)
  }

  function canviarNom(e) {
    setNom(e.target.value)
  }

  function reiniciar() {
    setValorDirecte(0)
    setValorFuncional(0)
    setValorConsole(0)
    setActiu(false)
    setNom('')
  }

  return (
    <main>
      <h1>React: actualització de l'estat</h1>
      <p>Comparació entre actualització directa i funcional amb useState.</p>

      <section aria-labelledby="titol-directe">
        <h2 id="titol-directe">1. Actualització directa</h2>
        <p>Valor: <strong>{valorDirecte}</strong></p>
        <button onClick={incrementarDirecte}>setValor(valor + 1)</button>
        <p>Utilitza el valor capturat durant la renderització actual.</p>
      </section>

      <section aria-labelledby="titol-funcional">
        <h2 id="titol-funcional">2. Actualització funcional</h2>
        <p>Valor: <strong>{valorFuncional}</strong></p>
        <button onClick={incrementarFuncional}>setValor(anterior =&gt; anterior + 1)</button>
        <p>Utilitza l'estat pendent més recent.</p>
      </section>

      <section aria-labelledby="titol-triple">
        <h2 id="titol-triple">3. Tres actualitzacions consecutives</h2>
        <div className="comparacio">
          <div>
            <h3>Forma directa</h3>
            <p>Valor: {valorDirecte}</p>
            <button onClick={tripleDirecte}>Incrementar 3 vegades (directe)</button>
            <p>Resultat: incrementa només 1.</p>
          </div>
          <div>
            <h3>Forma funcional</h3>
            <p>Valor: {valorFuncional}</p>
            <button onClick={tripleFuncional}>Incrementar 3 vegades (funcional)</button>
            <p>Resultat: incrementa 3.</p>
          </div>
        </div>
        <p>Els casos 1 i 3 comparteixen comptador directe; els casos 2 i 3, funcional.</p>
      </section>

      <section aria-labelledby="titol-console">
        <h2 id="titol-console">4. L'estat no canvia immediatament</h2>
        <p>Valor: <strong>{valorConsole}</strong></p>
        <button onClick={provarConsole}>Incrementar i mostrar console.log</button>
        <p>Obre la consola de les eines de desenvolupador (F12) i observa els dos missatges.</p>
        <p>Els dos console.log mostren el mateix valor; després, la pantalla s'actualitza.</p>
      </section>

      <section aria-labelledby="titol-boolea">
        <h2 id="titol-boolea">5. Alternar un booleà</h2>
        <p>Estat: <strong>{actiu ? 'ACTIU' : 'INACTIU'}</strong></p>
        <button onClick={alternarActiu} aria-pressed={actiu}>Alternar estat</button>
        <p>setActiu(anterior =&gt; !anterior)</p>
      </section>

      <section aria-labelledby="titol-input">
        <h2 id="titol-input">6. Actualitzar l'estat des d'un input</h2>
        <label htmlFor="nom">Nom</label>
        <input id="nom" type="text" value={nom} onChange={canviarNom} placeholder="Escriu el teu nom" />
        <p>Nom introduït: <strong>{nom}</strong></p>
        <p>No cal una funció actualitzadora: assignem directament el valor de l'input.</p>
      </section>

      <section aria-labelledby="titol-fix">
        <h2 id="titol-fix">7. Assignar un valor fix</h2>
        <button onClick={() => setValorDirecte(10)}>Assignar 10 al comptador directe</button>
        <p>Per assignar un valor fix podem utilitzar setValor(10).</p>
      </section>

      <button onClick={reiniciar}>Reiniciar tots els exemples</button>
    </main>
  )
}

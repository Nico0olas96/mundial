import React, { useState } from 'react'
import Pronosticos from './Pronosticos'
import Posiciones from './Posiciones'
import MisEstadisticas from './MisEstadisticas'
import MisPronosticos from './MisPronosticos'
import MiPerfil from './MiPerfil'
import Reglas from './Reglas'
import ResultadosPartidos from './ResultadosPartidos'
import Admin from './Admin'

const IndexPrincipal = ({ user, logout} ) => {

  const [seccion, setSeccion] = useState('5')

  const cambiarseccion = (valor) => {
    setSeccion(valor)
    closeMenu()
  }

  const closeMenu = () => {
  const menu = document.getElementById("menuNav")
  const bsCollapse = window.bootstrap?.Collapse.getInstance(menu)

  if (bsCollapse) {
    bsCollapse.hide()
  }
}
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm rounded-3 mb-3 sticky-top">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold d-flex align-items-center" style={{ fontSize: "17px" }}>
            {/* Desktop */}
            <span className="d-none d-sm-inline">
              ⚽ Prode Mundial - {user.nombre}
            </span>
            {/* Mobile */}
            <span className="d-inline d-sm-none" style={{ fontSize: "13px" }}>
              ⚽ Prode - {user.nombre}
            </span>
          </span>
          {/* Botón hamburguesa */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"data-bs-target="#menuNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Menú */}
          <div className="collapse navbar-collapse" style={{padding:'10px'}} id="menuNav">
            <div className="navbar-nav ms-auto gap-2">
              <button id="btn1" className={`btn btn-sm ${seccion === 1 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => cambiarseccion(1)}>
                📝 Pronósticos
              </button>
              <button id="btn2" className={`btn btn-sm ${seccion === 2 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => cambiarseccion(2)}>
                📊 Tabla
              </button>
              {/* 
              <button id="btn3" className={`btn btn-sm ${seccion === 3 ? 'btn-success' : 'btn-outline-success'}`} onClick={() => cambiarseccion(3)}>
                🏅 Stats
              </button>
              */}
              <button id="btn4" className={`btn btn-sm ${seccion === 4 ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => cambiarseccion(4)}>
                🧾 Mis Pronósticos
              </button>
              <button id="btn6" className={`btn btn-sm ${seccion === 6 ? 'btn-success' : 'btn-outline-success'}`} onClick={() => cambiarseccion(6)}>
                ⚽ Resultados
              </button>
              <button id="btn7" className={`btn btn-sm ${seccion === 7 ? 'btn-success' : 'btn-outline-success'}`} onClick={() => cambiarseccion(7)}>
                📋 Reglas
              </button>
              <button id="btn5" className={`btn btn-sm ${seccion === 5 ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => cambiarseccion(5)}>
                👤 Perfil
              </button>
              {user?.rol === "admin" && (
                <button id="btn8" className={`btn btn-sm ${seccion === 8 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => cambiarseccion(8)}>
                  🛡️ ADMIN
                </button>
              )}
              <button id="btn9" className={`btn btn-sm btn-danger`} onClick={logout}>
                🚪SALIR
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="container py-4">
        <div>
          {seccion == '1' && <Pronosticos user={user} setSeccion={setSeccion} />}

          {seccion == '2' && <Posiciones user={user} />}

          {seccion == '3' && <MisEstadisticas user={user} />}

          {seccion == '4' && <MisPronosticos user={user} />}

          {seccion == '5' && <MiPerfil user={user} />}

          {seccion == '6' && <ResultadosPartidos user={user} />}
          
          {seccion == '7' && <Reglas />}

          {seccion == '8' && <Admin user={user} />}
        </div>

      </div>
      <footer
        className="border-top py-3 mt-4"
        style={{
          background: '#fff'
        }}
      >

        <div className="container">

          <div className="row align-items-center">

            {/* TEXTO CENTRO */}
            <div className="col text-center">

              <small className="text-muted d-block">
                ⚽ Prode Mundial 2026 ⚽
              </small>

              <small
                className="fw-semibold text-muted d-block"
                style={{ fontSize: '12px' }}
              >
                Desarrollado por: HERMOSILLA NICOLAS
              </small>

            </div>

          </div>

        </div>

      </footer>
    </div>
  )
}

export default IndexPrincipal
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const URL_RESULTADOS = 'https://cpem41.edu.ar/backend.php/Nmundial/resultadospartidos.php'

const ResultadosPartidos = ({ user }) => {

  const [matches, setMatches] = useState([])
  const [secciones, setSecciones] = useState()

  useEffect(() => {
    getResultados()
  }, [])

  const getResultados = async () => {

    try {

      const response = await axios.post(URL_RESULTADOS, {
        usuario_id: user.id
      })

      const data = response.data?.data || response.data

      setMatches(Array.isArray(data) ? data : [])

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron obtener los resultados'
      })

    }

  }
  const Grupo = ({ nombre }) => {

    const partidosGrupo = matches.filter(
      match => match.grupo === nombre
    )

    return (

      <div className="mt-3">

        <div className="text-center mb-4">

          <h1 className="fw-bold display-6 mb-2">
            🏆 GRUPO {nombre}
          </h1>

        </div>

        {partidosGrupo.map((match) => (

          <div key={match.id} className="card mb-4 rounded-4"
            style={{
              border: "1px solid #e9ecef",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
            }}
          >

            <div className="card-body">

              {/* EQUIPOS */}
              <div className="d-flex align-items-center mb-2">

                <div className="col-4 text-end fw-semibold pe-3">
                  {match.local_team}
                </div>

                <div className="col-4 text-center">
                  <h4 className="mb-0 fw-bold text-primary">
                    {match.goles_local} - {match.goles_visitante}
                  </h4>
                </div>

                <div className="col-4 text-start fw-semibold ps-3">
                  {match.visitante_team}
                </div>

              </div>

              <hr className="my-3" />

              {/* INFO */}
              <div className="row align-items-center">

                {/* PUNTOS */}
                <div className="col-4 text-start">

                  {match.pred_local != null && (

                    <span
                      className={
                        match.acierto === 3
                          ? "text-success fw-bold small"
                          : match.acierto === 1
                          ? "text-warning fw-bold small"
                          : "text-danger fw-bold small"
                      }
                    >

                      {
                        match.acierto === 3
                          ? "🥇 +3"
                          : match.acierto === 1
                          ? "🟡 +1"
                          : "❌ 0"
                      }

                    </span>

                  )}

                </div>

                {/* PRONÓSTICO */}
                <div className="col-4 text-center">

                  {match.pred_local != null ? (
                    <div className="text-center">
                      <small style={{ fontSize: "11px" }} className="fw-semibold text-muted d-block mb-1">
                        Tu pronóstico
                      </small>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <span className="badge bg-secondary fs-6">
                          {match.pred_local}
                        </span>
                        <span className="fw-bold">
                          -
                        </span>
                        <span className="badge bg-secondary fs-6">
                          {match.pred_visitante}
                        </span>
                      </div>
                    </div>
                  ) : (

                    <div className="alert alert-danger d-inline-flex align-items-center gap-2 py-1 px-3 mb-0 rounded-4">

                      <span style={{ fontSize: "12px" }}>
                        ❌
                      </span>

                      <small style={{ fontSize: "11px" }} className="fw-semibold">
                        Sin pronóstico
                      </small>

                    </div>

                  )}

                </div>

                {/* FECHA */}
                <div className="col-4 text-end">

                  <span
                    className="text-muted"
                    style={{ fontSize: "11px" }}
                  >
                    {new Date(match.fecha).toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </span>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    )

  }

  return (


    <div className="container py-4" style={{ maxWidth: "700px" }}>

      <h2 className="text-center mb-4 fw-bold">
        ⚽ RESULTADOS
      </h2>

      {/* BOTONES GRUPOS */} 
      <div className="d-flex flex-wrap gap-2 justify-content-center mb-5">

        <button className={`btn btn-sm ${secciones === 1 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones(1)}>GRUPO A</button>
        <button className={`btn btn-sm ${secciones === 2 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones(2)}>GRUPO B</button>
        <button className={`btn btn-sm ${secciones === 3 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones(3)}>GRUPO C</button>
        <button className={`btn btn-sm ${secciones === 4 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones(4)}>GRUPO D</button>
        <button className={`btn btn-sm ${secciones === 5 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones(5)}>GRUPO E</button>
        <button className={`btn btn-sm ${secciones === 6 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones(6)}>GRUPO F</button>
        <button className={`btn btn-sm ${secciones === 7 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones(7)}>GRUPO G</button>
        <button className={`btn btn-sm ${secciones === 8 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones(8)}>GRUPO H</button>

      </div>

      {/* CONTENIDO POR GRUPO */}
      {secciones === 1 && <Grupo nombre="A" />}
      {secciones === 2 && <Grupo nombre="B" />}
      {secciones === 3 && <Grupo nombre="C" />}
      {secciones === 4 && <Grupo nombre="D" />}
      {secciones === 5 && <Grupo nombre="E" />}
      {secciones === 6 && <Grupo nombre="F" />}
      {secciones === 7 && <Grupo nombre="G" />}
      {secciones === 8 && <Grupo nombre="H" />}

    </div>
    

  )
}

export default ResultadosPartidos
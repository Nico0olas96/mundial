import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

import imgScaloni from '../assets/scaloni.jpg'

const URL_PARTIDOS ='https://cpem41.edu.ar/backend.php/Nmundial/partidos.php'

const URL_PRONOSTICOS ='https://cpem41.edu.ar/backend.php/Nmundial/pronosticos.php'

const Pronosticos = ({ user, setSeccion }) => { 

  const [matches, setMatches] = useState([])
  const [predictions, setPredictions] = useState({})
  const [loading, setLoading] = useState(true)

  const [secciones, setSecciones] = useState()

  useEffect(() => {
    getInformacion()
  }, [])

  const getInformacion = async () => {

    try {

      const response = await axios.post(URL_PARTIDOS, {
        usuario_id: user.id
      })

      setMatches(response.data)

    } catch (error) {

      console.error('Error al obtener los partidos:', error)

    } finally {

      setLoading(false)

    }
  }

  // =========================
  // INPUTS
  // =========================

  const handlePrediction = (matchId, team, value) => {

    setPredictions(prev => ({
      ...prev,

      [matchId]: {
        ...prev[matchId],
        [team]: value
      }
    }))
  }

  // =========================
  // GUARDAR
  // =========================

  const savePrediction = async (matchId) => {

    const matchPrediction = predictions[matchId]

    if (!matchPrediction) return

    const dataToSend = {
      usuario_id: user.id,
      partido_id: parseInt(matchId),
      pred_local: matchPrediction?.home || 0,
      pred_visitante: matchPrediction?.away || 0
    }

    try {

      await axios.post(
        URL_PRONOSTICOS,
        dataToSend,
        {
          withCredentials: true
        }
      )

      Swal.fire({
        icon: 'success',
        title: 'Pronóstico guardado',
        text: 'Se guardó correctamente',
        timer: 1500,
        showConfirmButton: false
      })

      setPredictions(prev => ({
        ...prev,

        [matchId]: {
          ...prev[matchId],
          saved: true
        }
      }))

    } catch (error) {

      console.error('Error al guardar:', error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar el pronóstico - el partido ya fue cerrado'
      })

    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <p>Cargando partidos...</p>
  }

  // =========================
  // RENDER
  // =========================

  const Grupo = ({ nombre }) => {

    const partidosGrupo = matches.filter(
      match => match.grupo_local === nombre
    )

    return (
      <div className="mt-3">
        <div className="text-center mb-4">

          <h1 className="fw-bold display-6 mb-2">
            🏆 GRUPO {nombre}
          </h1>

          <div className="mx-auto" style={{ maxWidth: "300px" }}>
            <hr className="border-2 border-primary opacity-50" />
          </div>

        </div>

        {/* MENSAJE SI NO HAY PARTIDOS */}
        {partidosGrupo.length === 0 && (
          <div className="text-center mt-4">
            
            <div className="alert alert-success rounded-4 shadow-sm py-3 px-4 d-inline-block">
              <div className="fs-4 mb-1">🎉</div>
              <strong>¡Todo listo!</strong>
              <div className="text-muted">
                Ya completaste todos tus pronósticos en este grupo
              </div>
            </div>

          </div>
        )}
        {partidosGrupo.map((match, index, arr) => {

          const mostrarSeparador =
            match.cerrado == 1 &&
            (index === 0 || arr[index - 1].cerrado == 0);

          return (
            <React.Fragment key={match.id}>

              {/* SEPARADOR */}
              {mostrarSeparador && (
                <div className="mb-4 mt-5">
                  <div className="d-flex align-items-center gap-2 pb-2 border-bottom border-2">
                    <span style={{ fontSize: "1.3rem" }}>🔒</span>
                    <h4 className="fw-bold mb-0">
                      Partidos cerrados
                    </h4>
                  </div>
                </div>
              )}

              {/* CARD */}
              <div
                className="card mb-4 rounded-4"
                style={{
                  border: "1px solid #e9ecef",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
                }}
              >
                <div className="card-body">

                  <div className="text-center mb-3">
                    <h5 className="mb-1 fw-bold">
                      {match.local_team}
                      <span className="text-muted mx-2">vs</span>
                      {match.visitante_team}
                    </h5>

                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                      🕒 {new Date(match.fecha).toLocaleString()}
                    </p>
                  </div>

                  <hr />

                  {predictions[match.id]?.saved ? (
                    <div className="text-center py-3">
                      <span className="text-success fw-bold fs-5">
                        ✔ Guardado
                      </span>
                    </div>
                  ) : (
                    <div>

                      <div className="d-flex gap-3 align-items-center">

                        <div className="flex-fill">
                          <input
                            type="number"
                            min="0"
                            className="form-control text-center py-2"
                            placeholder={match.local_team}
                            value={predictions[match.id]?.home || ""}
                            disabled={match.cerrado == 1}
                            onChange={e =>
                              handlePrediction(match.id, "home", e.target.value)
                            }
                          />
                        </div>

                        <span className="fw-bold text-muted fs-5">-</span>

                        <div className="flex-fill">
                          <input
                            type="number"
                            min="0"
                            className="form-control text-center py-2"
                            placeholder={match.visitante_team}
                            value={predictions[match.id]?.away || ""}
                            disabled={match.cerrado == 1}
                            onChange={e =>
                              handlePrediction(match.id, "away", e.target.value)
                            }
                          />
                        </div>

                      </div>

                      {match.cerrado == 0 && (
                        <div className="d-grid mt-4">
                          <button
                            onClick={() => savePrediction(match.id)}
                            className="btn btn-success rounded-3 shadow-sm py-2"
                          >
                            💾 Guardar Pronóstico
                          </button>
                        </div>
                      )}

                    </div>
                  )}

                  {match.cerrado == 1 && (
                    <div className="alert alert-danger mt-4 py-2 mb-0 text-center rounded-3">
                      🔒 Partido cerrado
                    </div>
                  )}

                </div>
              </div>

            </React.Fragment>
          )
        })}

      </div>
    )
  }

  return (

    <div className="container py-4" style={{ maxWidth: "700px" }}>

      <h2 className="text-center mb-4 fw-bold">
        📝 Pronósticos
      </h2>
      
      <p className="text-center text-muted mb-4">
        Tocá un grupo para ver los equipos y completar tu prode.
      </p>

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

export default Pronosticos
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const URL_PRONOSTICOSECHOS =
  'https://cpem41.edu.ar/backend.php/Nmundial/pronosticosechos.php'

const URL_EDITARPRONOSTICO =
  'https://cpem41.edu.ar/backend.php/Nmundial/pronosticoseditar.php'

const MisPronosticos = ({ user }) => {

  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)

  const [predLocal, setPredLocal] = useState('')
  const [predVisitante, setPredVisitante] = useState('')

  const [secciones, setSecciones] = useState()

  // =========================
  // GET INFO
  // =========================

  useEffect(() => {
    getInformacion()
  }, [])

  const getInformacion = async () => {

    try {

      const response = await axios.post(
        URL_PRONOSTICOSECHOS,
        {
          usuario_id: user.id
        }
      )

      setMatches(response.data)

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron obtener los pronósticos'
      })

    } finally {

      setLoading(false)

    }
  }

  // =========================
  // MODAL
  // =========================

  const Modificar = (match) => {

    setSelectedMatch(match)

    setPredLocal(match.pred_local)
    setPredVisitante(match.pred_visitante)

    setModalOpen(true)
  }

  // =========================
  // UPDATE
  // =========================

  const updatePronostico = async (
    selectedPronostico,
    selectPartido,
    predLocal,
    predVisitante
  ) => {

    try {

      await axios.post(
        URL_EDITARPRONOSTICO,
        {
          usuario_id: user.id,
          pred_local: predLocal,
          pred_visitante: predVisitante,
          pronostico_id: selectedPronostico,
          partido_id: selectPartido
        }
      )

      Swal.fire({
        icon: 'success',
        title: 'Pronóstico modificado',
        text: 'Se modificó correctamente'
      })

      getInformacion()

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo modificar el pronóstico'
      })

    } finally {

      setLoading(false)

    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="text-center py-5">

        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <p className="mt-3 text-muted">
          Cargando pronósticos...
        </p>

      </div>
    )
  }

  // =========================
  // COMPONENTE GRUPO
  // =========================

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

          <div className="mx-auto"
            style={{ maxWidth: "300px" }}
          >
            <hr className="border-2 border-primary opacity-50" />
          </div>

        </div>

        {/* SIN PARTIDOS */}

        {partidosGrupo.length === 0 && (

          <div className="text-center mt-4">

            <div className="alert alert-success rounded-4 shadow-sm py-3 px-4 d-inline-block">

              <div className="text-muted">
                ⚠️ No realizaste pronósticos en este grupo!!!
              </div>

            </div>

          </div>
        )}

        {/* PARTIDOS */}

        {partidosGrupo.map((match, index, arr) => {

          const mostrarSeparador = match.cerrado == 1 && ( index === 0 || arr[index - 1].cerrado == 0)

          return (

            <React.Fragment key={match.id}>

              {/* SEPARADOR */}

              {mostrarSeparador && (

                <div className="mb-4 mt-5">

                  <div className="d-flex align-items-center gap-2 pb-2 border-bottom border-2">

                    <span style={{ fontSize: "1.3rem" }}>
                      🔒
                    </span>

                    <h4 className="fw-bold mb-0">
                      Partidos cerrados (no se pueden modificar)
                    </h4>

                  </div>

                </div>
              )}

              {/* CARD */}
              <div
                key={match.id}
                className="card mb-4 border shadow rounded-4"
              >

                <div className="card-body">

                  {/* Equipos */}

                  <div className="d-flex justify-content-center align-items-center mb-3">

                    <h5 className="fw-bold mb-0 text-center">

                      {match.local_team}

                      <span className="text-muted">
                        {' '}vs{' '}
                      </span>

                      {match.visitante_team}

                    </h5>

                  </div>

                  {/* Fecha */}

                  <p className="text-muted small mb-3">

                    🕒 {new Date(match.fecha).toLocaleString()}

                  </p>

                  {/* Predicción */}

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top">

                    <div>

                      <span className="text-muted">
                        Tu predicción
                      </span>

                    </div>

                    <div>

                      <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">

                        {match.pred_local} - {match.pred_visitante}

                      </span>

                    </div>

                    {/* BOTON  rounded-3 shadow-sm py-10  */}
                    <div>

                      {match.cerrado === 0 ? (

                        <button
                          className="btn btn-sm btn-outline-primary "
                          onClick={() => Modificar(match)}
                        >
                          ✏️ Modificar
                        </button>

                      ) : (

                        <span className="badge bg-danger">
                          🔒 Cerrado
                        </span>

                      )}

                    </div>

                  </div>

                </div>

              </div>

            </React.Fragment>
          )
        })}

      </div>
    )
  }

  // =========================
  // RENDER
  // =========================

  return (

    <div className="container py-4" style={{ maxWidth: "700px" }}>

      <h2 className="text-center mb-4 fw-bold">
        🧾 Mis Pronósticos
      </h2>

      <p className="text-center text-muted mb-4">
        Seleccioná un grupo para consultar o actualizar tu prode.
      </p>

      {/* BOTONES */}

      <div className="d-flex flex-wrap gap-2 justify-content-center mb-5">

        <button className={`btn btn-sm ${secciones === "A" ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones("A")}>GRUPO A</button>
        <button className={`btn btn-sm ${secciones === "B" ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones("B")}>GRUPO B</button>
        <button className={`btn btn-sm ${secciones === "C" ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones("C")}>GRUPO C</button>
        <button className={`btn btn-sm ${secciones === "D" ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones("D")}>GRUPO D</button>
        <button className={`btn btn-sm ${secciones === "E" ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones("E")}>GRUPO E</button>
        <button className={`btn btn-sm ${secciones === "F" ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones("F")}>GRUPO F</button>
        <button className={`btn btn-sm ${secciones === "G" ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones("G")}>GRUPO G</button>
        <button className={`btn btn-sm ${secciones === "H" ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSecciones("H")}>GRUPO H</button>

      </div>

      {/* CONTENIDO */}

      {secciones === "A" && <Grupo nombre="A" />}
      {secciones === "B" && <Grupo nombre="B" />}
      {secciones === "C" && <Grupo nombre="C" />}
      {secciones === "D" && <Grupo nombre="D" />}
      {secciones === "E" && <Grupo nombre="E" />}
      {secciones === "F" && <Grupo nombre="F" />}
      {secciones === "G" && <Grupo nombre="G" />}
      {secciones === "H" && <Grupo nombre="H" />}

      {/* MODAL */}

      {modalOpen && selectedMatch && (

        <div onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >

          <div onClick={(e) => e.stopPropagation()}
            className="bg-white p-4 rounded-4 shadow"
            style={{
              width: "400px",
              maxWidth: "90%"
            }}
          >

            <h4 className="fw-bold text-center mb-4">
              ✏️ Modificar Pronóstico
            </h4>

            <div className="text-center mb-3">

              <h5>

                {selectedMatch.local_team}

                <span className="text-muted mx-2">
                  vs
                </span>

                {selectedMatch.visitante_team}

              </h5>

            </div>

            <div className="d-flex align-items-center gap-3">

              <input
                type="number"
                min="0"
                className="form-control text-center"
                value={predLocal}
                onChange={(e) =>
                  setPredLocal(e.target.value)
                }
              />

              <span className="fw-bold fs-5">
                -
              </span>

              <input
                type="number"
                min="0"
                className="form-control text-center"
                value={predVisitante}
                onChange={(e) =>
                  setPredVisitante(e.target.value)
                }
              />

            </div>

            <div className="d-flex gap-2 mt-4">

              <button
                className="btn btn-secondary flex-fill"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>

              <button
                className="btn btn-success flex-fill"
                onClick={() => {

                  updatePronostico(
                    selectedMatch.id,
                    selectedMatch.partido_id,
                    predLocal,
                    predVisitante
                  )

                  setModalOpen(false)

                }}
              >
                💾 Guardar
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default MisPronosticos
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const URL_RESULTADOS =
  'https://cpem41.edu.ar/backend.php/Nmundial/resultadospartidos.php'

const ResultadosPartidos = ({ user }) => {

  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

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

    } finally {
      setLoading(false)
    }
  }

  // =========================
  // FECHAS
  // =========================

  const hoy = new Date()

  const ayer = new Date()
  ayer.setDate(hoy.getDate() - 1)

  const esMismoDia = (fecha1, fecha2) => {
    return (
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear()
    )
  }

  // =========================
  // GRUPOS
  // =========================

  const partidosHoy = matches.filter(match =>
    esMismoDia(new Date(match.fecha), hoy)
  )

  const partidosAyer = matches.filter(match =>
    esMismoDia(new Date(match.fecha), ayer)
  )

  const otros = matches.filter(match => {

    const fecha = new Date(match.fecha)

    return (
      !esMismoDia(fecha, hoy) &&
      !esMismoDia(fecha, ayer)
    )
  })

  // =========================
  // CARD
  // =========================

  const renderMatch = (match) => (

    <div
      key={match.id}
      className="card mb-4 rounded-4"
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

              <span className={
                match.acierto === 3
                  ? "text-success fw-bold small"
                  : match.acierto === 1
                  ? "text-warning fw-bold small"
                  : "text-danger fw-bold small"
              }>

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

            ) : (

              <div className="alert alert-danger d-inline-flex align-items-center gap-2 py-1 px-3 mb-0 rounded-4">

                <span style={{ fontSize: "12px" }}>
                  ❌
                </span>

                <small
                  style={{ fontSize: "11px" }}
                  className="fw-semibold"
                >
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

  )

  // =========================
  // RENDER
  // =========================

  return (

    <div className="container py-4" style={{ maxWidth: '700px' }}>

      <h2 className="text-center fw-bold mb-5">
        ⚽ Resultados de Partidos
      </h2>

      {loading ? (

        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          ></div>

          <p className="mt-3 text-muted">
            Cargando resultados...
          </p>

        </div>

      ) : matches.length === 0 ? (

        <div className="alert alert-warning text-center rounded-4 shadow-sm">
          ⚠️ No hay resultados disponibles.
        </div>

      ) : (

        <>

          {/* HOY */}
          {partidosHoy.length > 0 && (
            <section className="mb-5">

              <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-2">

                <span style={{ fontSize: '1.4rem' }}>
                  📅
                </span>

                <h4 className="fw-bold mb-0">
                  Hoy
                </h4>

              </div>

              {partidosHoy.map(renderMatch)}

            </section>
          )}

          {/* AYER */}
          {partidosAyer.length > 0 && (
            <section className="mb-5">

              <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-2">

                <span style={{ fontSize: '1.4rem' }}>
                  🕘
                </span>

                <h4 className="fw-bold mb-0">
                  Ayer
                </h4>

              </div>

              {partidosAyer.map(renderMatch)}

            </section>
          )}

          {/* OTROS */}
          {otros.length > 0 && (
            <section className="mb-5">

              <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-2">

                <span style={{ fontSize: '1.4rem' }}>
                  📂
                </span>

                <h4 className="fw-bold mb-0">
                  Anteriores
                </h4>

              </div>

              {otros.map(renderMatch)}

            </section>
          )}

        </>

      )}

    </div>

  )
}

export default ResultadosPartidos
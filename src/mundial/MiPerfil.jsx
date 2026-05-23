import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const URL_POSICIONES = 'https://cpem41.edu.ar/backend.php/Nmundial/posiciones.php'


const MiPerfil = ({ user }) => {

  const [positions, setPositions] = useState([])

  useEffect(() => {
    getPositions()
  }, [])

  const getPositions = async () => {
    try {
      const response = await axios.get(URL_POSICIONES)

      const data = response.data?.data || response.data

      setPositions(Array.isArray(data) ? data : [])

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron obtener las posiciones'
      })
    } 
  }

  const stats = {
    ranking: 0,
    puntosTotales: 0
  }

  for (let i = 0; i < positions.length; i++) {
    if (positions[i].id == user.id) {
      stats.ranking = i + 1
      stats.puntosTotales = positions[i].puntos
    }
  }

  return (

    <div className="container py-4" style={{ maxWidth: '700px' }}>

      {/* TÍTULO */}
      <div className="text-center mb-4">

        <div style={{ fontSize: "60px" }}>
          ⚽
        </div>

        <h1 className="fw-bold">
          {user.nombre}
        </h1>

        <p className="text-muted">
          Tu equipo en Prode Mundial
        </p>

      </div>

      {/* TARJETAS */}
      <div className="row g-3">

        {/* PUNTOS */}
        <div className="col-md-6">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body text-center">

              <div style={{ fontSize: "40px" }}>
                🏆
              </div>

              <h5 className="fw-bold mt-2">
                Puntos Totales
              </h5>

              <h2 className="text-success fw-bold">
                {stats.puntosTotales}
              </h2>

            </div>

          </div>

        </div>

        {/* RANKING */}
        <div className="col-md-6">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body text-center">

              <div style={{ fontSize: "40px" }}>
                📊
              </div>

              <h5 className="fw-bold mt-2">
                Ranking
              </h5>

              <h2 className="text-primary fw-bold">
                #{stats.ranking}
              </h2>

            </div>

          </div>

        </div>

        {/* ACTIVIDAD */}
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h5 className="fw-bold mb-4">
                🔥 Últimas novedades
              </h5>
              <div className="d-flex flex-column gap-3">
                <div className="border-start border-4 border-success ps-3">
                {/* 
                  <small className="text-muted d-block">
                    Último resultado
                  </small>
                  <span className="fw-semibold">
                    ⚽ Flamengo 1 - 0 Estudiantes
                  </span> 
                */}
                </div>  
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  )
}

export default MiPerfil
import React, { useState, useEffect } from 'react'
import axios from 'axios'


const URL_POSICIONES = 'https://cpem41.edu.ar/backend.php/Nmundial/posiciones.php'


const Posiciones = ({ user }) => {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>

      <h2 className="text-center fw-bold mb-4">📊 Tabla de Posiciones</h2>

      {loading ? (

        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2 text-muted">Cargando posiciones...</p>
        </div>

      ) : (

        <div className="table-responsive">

          <table className="table table-hover text-center shadow-sm">

            <thead className="table-dark">
              <tr>
                <th>Pos</th>
                <th className="text-start">Equipo</th>
                <th>Pts</th>
              </tr>
            </thead>

            <tbody>

                {Array.isArray(positions) && positions.map((team, index) => {
                  const pos = index + 1
                  return (
                    <tr key={team.id} className={ pos === 1 ? "table-success fw-bold fs-5": pos === 2? "table-info fw-semibold": ""}>

                      <td>
                        {pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos}
                      </td>

                      <td className="text-start fw-semibold">
                        {team.nombre}
                      </td>

                      <td className="fw-bold">
                        {team.puntos}
                      </td>

                    </tr>
                  )
                })}

            </tbody>

          </table>

        </div>

      )}

    </div>
  )
}

export default Posiciones
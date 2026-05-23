import React from 'react'

const reglas = [
  {
    titulo: 'Fase de grupos',
    descripcion:
      'Cada partido acertado suma puntos según el nivel de precisión del pronóstico.'
  },
  {
    titulo: 'Resultado exacto',
    descripcion:
      'Si acertás el resultado exacto del partido (ejemplo: 2-1), obtenés 3 puntos.'
  },
  {
    titulo: 'Ganador o empate',
    descripcion:
      'Si acertás solamente el ganador o el empate, pero no el resultado exacto, obtenés 1 puntos.'
  },
  {
    titulo: 'Partidos cerrados',
    descripcion:
      'Los pronósticos se pueden modificar hasta 30 minutos antes del inicio del partido. Pasado ese plazo, el partido se cierra automáticamente y ya no se permiten cambios.'
  },
  {
    titulo: 'Fases eliminatorias',
    descripcion:
      'En octavos, cuartos, semifinal y final se toma como resultado válido el marcador al finalizar el tiempo reglamentario (90 minutos) más la prórroga (hasta 120 minutos). Si el partido se define por penales, no se considera el resultado de la tanda de penales en el pronóstico.'
  },
  {
    titulo: 'Tabla general',
    descripcion:
      'Los puntos acumulados de todos los partidos determinarán la posición en la tabla general del Prode.'
  },
  {
    titulo: 'Desempates',
    descripcion:
      'En caso de empate en puntos el premio se divide en partes iguales entre los participantes empatados.'
  }
]

const Reglas = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="bg-primary text-white text-center py-4">
              <h1 className="fw-bold mb-2">📋 Reglas del Prode Mundial</h1>
              <p className="mb-0 opacity-80"> 
                Leé atentamente cómo funciona el sistema de puntuación.
              </p>
            </div>

            <div className="card-body p-4 p-md-5 bg-light">
              <div className="row g-4">
                {reglas.map((regla, index) => (
                  <div className="" key={index}>
                    <div className="card h-100 border-0 shadow-sm rounded-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '45px', height: '45px' }}>
                            {index + 1}
                          </div>
                          <h5 className="fw-bold mb-0">{regla.titulo}</h5>
                        </div>

                        <p className="text-muted mb-0">{regla.descripcion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="alert alert-warning mt-5 rounded-4 shadow-sm border-0">
                <h5 className="fw-bold mb-2">⚠ Importante</h5>
                <p className="mb-0">
                  Revisá bien tus pronósticos 30 min antes del comienzo de cada partido. <br/> Una vez cerrado el encuentro, no podrán realizarse cambios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reglas

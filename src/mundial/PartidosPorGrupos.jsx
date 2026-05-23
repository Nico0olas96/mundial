
    <div
      className="container py-4"
      style={{ maxWidth: '700px' }}
    >

      {matches.length === 0 ? (

        <h2 className="text-center mb-4 fw-bold">
          ✅ Ya completaste todos tus pronósticos
        </h2>

      ) : (

        <h2 className="text-center mb-5 fw-bold">
          ⚽ Realizá tus pronósticos
        </h2>

      )}

      {matches.map((match, index) => {

        // Mostrar separador SOLO una vez
        const mostrarSeparador =
          match.cerrado == 1 &&
          (
            index === 0 ||
            matches[index - 1].cerrado == 0
          )

        return (

          <React.Fragment key={match.id}>

            {/* SEPARADOR */}
            {mostrarSeparador && (

              <div className="mb-4 mt-5">

                <div className="d-flex align-items-center gap-2 pb-2 border-bottom border-2">

                  <span style={{ fontSize: '1.3rem' }}>
                    🔒
                  </span>

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
                border: '1px solid #e9ecef',
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
              }}
            >

              <div className="card-body">

                {/* EQUIPOS */}
                <div className="text-center mb-3">

                  <h5 className="mb-1 fw-bold">

                    {match.local_team}

                    <span className="text-muted mx-2">
                      vs
                    </span>

                    {match.visitante_team}

                  </h5>

                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: '13px' }}
                  >
                    🕒 {new Date(match.fecha).toLocaleString()}
                  </p>

                </div>

                <hr />

                {/* GUARDADO */}
                {predictions[match.id]?.saved ? (

                  <div className="text-center py-3">

                    <span className="text-success fw-bold fs-5">
                      ✔ Guardado
                    </span>

                  </div>

                ) : (

                  <div>

                    {/* INPUTS */}
                    <div className="d-flex gap-3 align-items-center">

                      <div className="flex-fill">

                        <input
                          type="number"
                          min="0"
                          className="form-control text-center py-2"
                          placeholder={match.local_team}
                          value={predictions[match.id]?.home || ''}
                          disabled={match.cerrado == 1}
                          onChange={e =>
                            handlePrediction(
                              match.id,
                              'home',
                              e.target.value
                            )
                          }
                        />

                      </div>

                      <span className="fw-bold text-muted fs-5">
                        -
                      </span>

                      <div className="flex-fill">

                        <input
                          type="number"
                          min="0"
                          className="form-control text-center py-2"
                          placeholder={match.visitante_team}
                          value={predictions[match.id]?.away || ''}
                          disabled={match.cerrado == 1}
                          onChange={e =>
                            handlePrediction(
                              match.id,
                              'away',
                              e.target.value
                            )
                          }
                        />

                      </div>

                    </div>

                    {/* BOTÓN */}
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

                {/* CERRADO */}
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
    
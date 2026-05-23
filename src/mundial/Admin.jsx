import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

const URL_PARTIDOS = 'https://cpem41.edu.ar/backend.php/Nmundial/adminpartidosp.php'
const URL_GUARDAR = 'https://cpem41.edu.ar/backend.php/Nmundial/adminguardar.php'
const URL_USERCREAR = 'https://cpem41.edu.ar/backend.php/Nmundial/admincrear.php'
const URL_USEREDIT = 'https://cpem41.edu.ar/backend.php/Nmundial/admineditar.php'
const URL_USER = 'https://cpem41.edu.ar/backend.php/Nmundial/adminuser.php'

const Admin = ({ user }) => {

  const [partidos, setPartidos] = useState([])
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null)
  const [goles, setGoles] = useState({ local: '', visitante: '' })
  const [modalOpen, setModalOpen] = useState(false)

  const [seccion, setSeccion] = useState('')
  const [usuarios, setUsuarios] = useState([]);

  const [nuevo, setNuevo] = useState({
    nombre: "",
    usuario: "",
    password: "aa123",
    rol: "usuario",
  });


  //PROBANDO API
  const probanodapi = async () => {
    try {
      //GET https://v3.football.api-sports.io/fixtures?league=1

      const response = await axios.get(
      'https://v3.football.api-sports.io/fixtures',
      {
        withCredentials: false,
        headers: {
          "x-apisports-key": "858d6ba56736d8fc155e3f37ec221c00"
        },
        params: {
          league: 1,
          season: 2026
        }
      }
      );
      console.log(response.data)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ERROR' + err
      })
    }
  }  

  const cambiarSeccion = (id) => {
    setSeccion(id)
    setPartidoSeleccionado(null)
    setGoles({ local: '', visitante: '' })
    setNuevo(
      {
        nombre: "",
        usuario: "",
        password: "aa123",
        equipo: "",
        rol: "usuario",
      },
    )

  }

  // 🔥 traer partidos
  const fetchPartidos = async () => {
    try {
      const response = await axios.get(URL_PARTIDOS)
      const data = response.data?.data || response.data
      setPartidos(Array.isArray(data) ? data : [])
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ERROR' + err
      })
    }
  }


  // 📌 seleccionar partido
  const handleSelect = (id) => {
    const p = partidos.find(x => x.id == id)
    setPartidoSeleccionado(p || null)

    // opcional: precargar si ya tiene goles
    if (p) {
      setGoles({
        local: p.goles_local ?? '',
        visitante: p.goles_visitante ?? ''
      })
    }
  }

  const vaciar = () => {
    setPartidoSeleccionado(null)
    setGoles({ local: '', visitante: '' })
  }

  // 💾 guardar resultado
  const guardar = async () => {
    if (!partidoSeleccionado) return

    const fecha = new Intl.DateTimeFormat('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'short',
      timeStyle: 'medium'
    }).format(new Date()) // 👈 SIEMPRE actual antes que supiera que se puede hacer por sql

    try {
      await axios.post(URL_GUARDAR, {
        partido_id: partidoSeleccionado.id,
        goles_local: goles.local,
        goles_visitante: goles.visitante,
        usuario: user.usuario,
        user_rol: user.rol,
        fecha: fecha
      })

      Swal.fire({
        icon: 'success',
        title: 'Resultado guardado ✔',
        showConfirmButton: false,
        timer: 1500
      })

      setPartidoSeleccionado(null)
      setGoles({ local: '', visitante: '' })

      fetchPartidos()

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ERROR' + err
      })
    }
  }

  const cargarUsuarios = async () => {
    setUsuarios([])
    try {
      const res = await  axios.post(URL_USER, {
          usuario_id: user
      })      
      // axios ya trae el JSON parseado
      const data = res.data;
      // si viene error desde PHP
      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '' + data.error
        })
        return;
      }
      setUsuarios(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ERROR' + err
      })
    }
  }
  const crearUsuario = async () => {
    try {
      const res = await fetch(URL_USERCREAR, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...nuevo,
          user: user.usuario,
          user_rol: user.rol
        }),
      })
      const data = await res.json()
      if (data.status === "ok") {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado ✔',
          showConfirmButton: false,
          timer: 1500
        })

        setNuevo({
          nombre: "",
          usuario: "",
          password: "aa123",
          equipo: "",
          rol: "",
        })

        cargarUsuarios()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'ERROR' + err
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ERROR' + err
      })
    }
  }

  const restContra = async (id) => {
    const usuario = usuarios.find((u) => u.id === id);

    const confirm = await Swal.fire({
      title: "Resetear contraseña",
      text: `¿Resetear contraseña de ${usuario.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, resetear",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(URL_USEREDIT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: usuario.id,
          password: "aa123",
          user: user.usuario,
          user_rol: user.rol,
          reset_password: true
        }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        Swal.fire("OK", "Contraseña reseteada a aa123", "success");
      } else {
        Swal.fire("Error", data.error, "error");
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ERROR' + err
      })
    }
  }

  const editarUsuario = async (id) => {
    const usuario = usuarios.find((u) => u.id === id);

    const { value: formValues } = await Swal.fire({
      title: "Editar Usuario",
      html: `
        <label for="swal-nombre">Nombre</label>
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${usuario.nombre}">
        <label for="swal-usuario">Usuario</label>
        <input id="swal-usuario" class="swal2-input" placeholder="usuario" value="${usuario.usuario}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      preConfirm: () => {
        return {
          nombre: document.getElementById("swal-nombre").value,
          usuario: document.getElementById("swal-usuario").value,
        }
      },
    })

    if (!formValues) return

    try {
      const res = await fetch(URL_USEREDIT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          nombre: formValues.nombre,
          equipo: formValues.equipo,
          usuario: formValues.usuario,
          user: user.usuario,
          user_rol: user.rol
        }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        Swal.fire("OK", "Usuario actualizado", "success");
        cargarUsuarios();
      } else {
        Swal.fire("Error", data.error, "error");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ERROR' + err
      })
    }
  }


  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>PANEL ADMINISTRADOR</h2>

      <div className="container mb-4">

        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-3">

            <div className="d-flex flex-wrap gap-2 justify-content-center">

              <button
                className={`btn px-4 py-2 rounded-3 fw-semibold ${seccion === '1' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {cambiarSeccion('1'), fetchPartidos()}}
              >
                ⚽ Partidos
              </button>

              <button
                className={`btn px-4 py-2 rounded-3 fw-semibold ${seccion === '2' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => {cambiarSeccion('2');cargarUsuarios()}}
              >
                👥 Usuarios
              </button>

              <button
                className={`btn px-4 py-2 rounded-3 fw-semibold ${seccion === '3' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => cambiarSeccion('3')}
              >
                ⚙️ Configuración
              </button>

            </div>

          </div>
        </div>

      </div>
  


      {seccion == '1' && (
        <div>
          <div className="alert alert-info border-0 shadow-sm rounded-4 mb-3">
            <h5 className="fw-bold mb-2">
              ⚽ Administración de resultados
            </h5>
            <p className="mb-0">
              Seleccioná un partido finalizado para cargar el resultado final del encuentro.
            </p>
          </div>      
          <button onClick={() => {
            setModalOpen(true) 
            vaciar()
          }} style={{padding:"8px 14px",background:"#1976d2",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14}}
            onMouseEnter={(e) => e.currentTarget.style.background = "#125ea6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#1976d2"}>
              📌 Seleccionar partido
          </button>
          <br/>
          <br/>
          {/* CARD PARTIDO */}
            {partidoSeleccionado && (
              <div className="card mb-3 shadow-sm border-1 rounded-4" style={{maxWidth:"600px",margin:"0 auto"}}>
                <div className="card-body p-2">

                  <h4 className="text-center mb-3 fw-bold">
                    {partidoSeleccionado.local_team} <span className="text-muted">vs</span> {partidoSeleccionado.visitante_team}
                  </h4>

                  <div className="d-flex gap-3 align-items-center">

                    <div className="flex-fill">
                      <input
                        type="number"
                        min="0"
                        className="form-control text-center"
                        placeholder={partidoSeleccionado.local_team}
                        value={goles.local}
                        onChange={(e) => setGoles({ ...goles, local: e.target.value })}
                      />
                    </div>

                    <span className="fw-bold text-muted">-</span>

                    <div className="flex-fill">
                      <input
                        type="number"
                        min="0"
                        className="form-control text-center"
                        placeholder={partidoSeleccionado.visitante_team}
                        value={goles.visitante}
                        onChange={(e) => setGoles({ ...goles, visitante: e.target.value })}
                      />
                    </div>

                  </div>

                  <div className="d-grid mt-3">
                    <button
                      onClick={guardar}
                      className="btn btn-success rounded-3 shadow-sm py-1"
                      style={{ fontSize: "15px" }}
                    >
                      💾 Guardar resultado
                    </button>
                  </div>

                </div>

              </div>
            )}
            {modalOpen && (
              <div onClick={() => setModalOpen(false)} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div onClick={(e) => e.stopPropagation()} style={{background:"white",width:"90%",maxWidth:500,borderRadius:12,padding:20,maxHeight:"80vh",overflowY:"auto"}}>
                  {partidos.length > 0 && (
                    <h3>⚽ Gestionar partido</h3>
                  )}
                  {partidos.length > 0 ? (
                  partidos.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {handleSelect(p.id);setModalOpen(false)}}
                      onMouseEnter={(e) => e.currentTarget.style.background="#b9e1fd"}
                      onMouseLeave={(e) => e.currentTarget.style.background="white"}
                      style={{padding:12,marginBottom:10,border:"1px solid #ddd",borderRadius:10,cursor:"pointer",transition:"0.2s"}}
                    >
                      <strong>{p.local_team} vs {p.visitante_team}</strong>
                      <div style={{fontSize:12,color:"#666"}}>{p.fecha}</div>
                    </div>
                  ))
                ) : (
                  <div className="alert alert-warning text-center rounded-3 mb-0">
                    ⚠️ No hay partidos disponibles para cargar resultados
                  </div>
                )}

                </div>
              </div>
            )}
        </div>
      )}
      
      {seccion == '2' && (
        <div className="p-4">
          <div className="alert alert-info border-0 shadow-sm rounded-4 mb-3">
            <h5 className="fw-bold mb-1">
              👤 Administración de usuarios
            </h5>

            <p className="mb-0 small">
              Creá usuarios y restablecé contraseñas.
            </p>
          </div>

          <div className="card mb-4">
            <div className="card-header fw-bold">
              ➕ Crear nuevo usuario
            </div>
            <div className="card-body">
              <div className="row g-2">

                <div className="col-md-4"><input type="text" className="form-control" placeholder="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} /></div>

                <div className="col-md-4"><input type="text" className="form-control" placeholder="Usuario" value={nuevo.usuario} onChange={(e) => setNuevo({ ...nuevo, usuario: e.target.value })} /></div>

                <div className="col-md-4"> <input type="text" className="form-control" value="aa123" disabled readOnly /> </div>
                
              </div>
              <div className="row justify-content-center" style={{paddingTop:"20px"}}>
                <div className="col-md-4">
                  <button className="btn btn-primary w-100" onClick={crearUsuario}>Crear</button>
                </div>
              </div>
              
            </div>
          </div>

          <div className="card">
            <div className="card-header fw-bold">
              👥 Gestión de usuarios
            </div>
            <div className="card-body table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                    {usuarios.map((u) => ( 
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.nombre}</td>
                        <td>{u.usuario}</td>
                        <td>
                          {u.rol === 'usuario' && (<button className="btn btn-warning btn-sm" onClick={() => editarUsuario(u.id)}>✏️ Editar</button>)} 
                          <button className="btn btn-danger btn-sm ms-2" onClick={() => restContra(u.id)}>🔑 Reset</button>
                        </td>
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      )}

      {seccion == '3' && (
        <div>
          <h1>PROXIMAMENTE...</h1>
          <p>probando api...</p>
          <button onClick={probanodapi}>Traer partidos (ver consola)</button>
        </div>
      )}

    </div>
  )
}

export default Admin
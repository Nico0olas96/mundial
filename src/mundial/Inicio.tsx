import React, { use, useEffect, useState } from 'react'
import axios from 'axios'
import IndexPrincipal from './IndexPrincipal'
import Swal from 'sweetalert2'

type Usuario = {
  id: number
  usuario: string
  rol: string
  equipo: string
  nombre: string
}

const Inicio = () => {

  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<Usuario | null>(null)

  // LOGIN PHP
  const URL_LOGIN = 'https://cpem41.edu.ar/backend.php/Nmundial/check-user.php'
  const URL_API = 'https://cpem41.edu.ar/backend.php/Nmundial/check_partidos.php'
  const URL_PASSWORD = 'https://cpem41.edu.ar/backend.php/Nmundial/cambiar_password.php'

  // HEARTBEAT
  useEffect(() => {

    if (!isLoggedIn || !userData) return

    const sendHeartbeat = async () => {

      try {

        const fecha = new Intl.DateTimeFormat('es-AR', {
          timeZone: 'America/Argentina/Buenos_Aires',
          dateStyle: 'short',
          timeStyle: 'medium'
        }).format(new Date())

        await axios.post(URL_API, {
          evento: 'INICIO',
          usuario: userData.usuario,
          fecha
        })

      } catch (err) {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el heartbeat ' + err
        })

      }

    }

    // ENVÍA INMEDIATAMENTE
    sendHeartbeat()

    // CADA 5 MIN
    const interval = setInterval(sendHeartbeat, 5 * 60 * 1000)

    // LIMPIA INTERVAL
    return () => clearInterval(interval)

  }, [isLoggedIn, userData])


  // LOGOUT
  const cerrarSesion = () => {

    setIsLoggedIn(false)
    setUserData(null)
    setUsuario('')
    setPassword('')

  }

  // LOGIN
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    setLoading(true)
    setError('')

    try {

      const formData = new FormData()

      formData.append('usuario', usuario)
      formData.append('password', password)

      const response = await axios.post(
        URL_LOGIN,
        formData,
        {
          withCredentials: true
        }
      )

      if (response.data.success) {

        // OBJETO USER
        const user: Usuario = {
          id: response.data.id,
          usuario: response.data.usuario,
          rol: response.data.rol,
          equipo: response.data.equipo,
          nombre: response.data.nombre,
        }

        // PASSWORD TEMPORAL
        if (response.data.force_password_change) {

          const result = await Swal.fire({
            icon: 'warning',
            title: 'Cambiar contraseña',
            text: 'Debés cambiar tu contraseña para continuar',
            input: 'password',
            inputLabel: 'Nueva contraseña',
            inputPlaceholder: 'Ingresá nueva contraseña',
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            inputValidator: (value) => {

              if (!value || value.length < 4) {
                return 'La contraseña debe tener al menos 4 caracteres'
              }

              if (value === 'aa123') {
                return 'No podés usar la contraseña temporal'
              }

              // mínimo 2 letras
              const letras = (value.match(/[A-Za-z]/g) || []).length

              // mínimo 2 números
              const numeros = (value.match(/[0-9]/g) || []).length

              if (letras < 2 || numeros < 2) {
                return 'La contraseña debe tener al menos 2 letras y 2 números'
              }

              return undefined

            }
          })

          // CANCELÓ
          if (!result.isConfirmed) {

            cerrarSesion()
            return

          }

          // GUARDAR PASSWORD
          await axios.post(
            URL_PASSWORD,
            {
              nueva_password: result.value,
              usuario_id: user.id
            }
          )

          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
            text: 'Tu contraseña fue cambiada correctamente'
          })

        }

        // LOGIN OK
        setIsLoggedIn(true)
        setUserData(user)

      } else {

        setError(response.data.message)

      }

    } catch (err) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo iniciar sesión ' + err
      })

    } finally {

      setLoading(false)

    }

  }

  // SI ESTÁ LOGEADO
  if (isLoggedIn) {

    return (
      <IndexPrincipal
        user={userData}
        logout={cerrarSesion}
      />
    )

  }

  return (

    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: '100vh' }}>
      <div
        className="card shadow-lg border-0 rounded-4 p-4"
        style={{ maxWidth: '400px', width: '100%' }}
      >

        <div className="text-center mb-4">

          <h2 className="fw-bold">
            🔐 Inicio de Sesión
          </h2>

          <p className="text-muted small">
            Ingresá con tu usuario y contraseña
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* USUARIO */}
          <div className="mb-3">

            <label className="form-label">
              Usuario
            </label>

            <input
              type="text"
              className="form-control rounded-3"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              disabled={loading}
              placeholder="Ej: nicolas"
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-3">

            <label className="form-label">
              Contraseña
            </label>

            <input
              type="password"
              className="form-control rounded-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="********"
            />

          </div>

          {/* ERROR */}
          {error && (
            <div className="alert alert-danger py-2 text-center small">
              {error}
            </div>
          )}

          {/* BOTÓN */}
          <div className="d-grid">

            <button
              type="submit"
              className="btn btn-primary rounded-3 fw-bold"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}

            </button>

          </div>

        </form>

      </div>

    </div>

  )

}

export default Inicio
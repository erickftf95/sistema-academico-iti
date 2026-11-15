import { useState } from "react";
import { useNavigate } from "react-router-dom";
 
function Login() {
  //Estados del formulario
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
 
  //Estados de la navegación
  const navigate = useNavigate();
 
  //Función para iniciar sesión
  const iniciarSesion = (e) => {
    e.preventDefault();
 
    //Validar campos vacíos
    if (correo.trim() === "" || clave.trim() === "") {
      setError("Por favor, complete todos los campos.");
      return;
    }
 
    if (correo === "admin@iti.edu.ec" && clave === "12345") {
      navigate("/inicio");
    } else {
      setError("Usuario o contraseña inválidas.");
    }
  };
 
  return (
    <div className="login-container d-flex justify-content-center align-items-center p-3">
      <div className="card login-card p-4">
        <div className="card-body">
          <div className="login-logo">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
 
          <h3 className="login-title text-center mb-2">Sistema Académico</h3>
 
          <h5 className="text-center text-secondary mb-4">Instituto Tecnológico ITI</h5>
 
          <p className="text-center text-muted mb-4">Ingrese sus credenciales para continuar</p>
 
          <form onSubmit={iniciarSesion}>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">
                Correo electrónico
              </label>
 
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
 
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="correo@iti.edu.ec"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="clave" className="form-label">
                Contraseña
              </label>
 
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
 
                <input
                  type="password"
                  className="form-control"
                  id="clave"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  placeholder="Ingrese su contraseña"
                />
              </div>
            </div>
            {/* Mostrar mensaje de error si existe */}
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Ingresar al sistema
            </button>
          </form>
 
          <hr className="my-4" />
 
          <p className="text-center text-muted small mb-0">© 2026 ITI - Sistema Académico</p>
        </div>
      </div>
    </div>
  );
}
 
export default Login;
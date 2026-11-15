import { useState } from "react";

const estudianteInicial = {
  cedula: "",
  fechaNacimiento: "",
  nombres: "",
  apellidos: "",
  correo: "",
  carrera: "",
  estado: "Activo",
};

function Estudiantes() {
  const [estudiante, setEstudiante] = useState(estudianteInicial);
  const [estudiantes, setEstudiantes] = useState([]);
  const [esEdicion, setEsEdicion] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setEstudiante({
      ...estudiante,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setEstudiante(estudianteInicial);
    setEsEdicion(false);
    setError("");
    setMensaje("");
  };

  const prepararActualizacion = (est) => {
    setEstudiante(est);
    setEsEdicion(true);
    setError("");
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarEstudiante = (cedula) => {
    if (window.confirm("¿Está seguro de que desea eliminar este estudiante?")) {
      setEstudiantes(estudiantes.filter((est) => est.cedula !== cedula));
      setMensaje("Estudiante eliminado exitosamente.");
      setError("");
      if (esEdicion && estudiante.cedula === cedula) {
        limpiarFormulario();
      }
    }
  };

  const grabarEstudiante = (e) => {
    e.preventDefault();
    setError("");

    if (
      !estudiante.cedula.trim() ||
      !estudiante.fechaNacimiento.trim() ||
      !estudiante.nombres.trim() ||
      !estudiante.apellidos.trim() ||
      !estudiante.correo.trim() ||
      !estudiante.carrera.trim()
    ) {
      setError("Campos vacios.");
      setMensaje("");
      return;
    }

    const soloNumeros = /^[0-9]+$/;
    if (!soloNumeros.test(estudiante.cedula)) {
      setError("La cédula debe ser yipo numérico.");
      setMensaje("");
      return;
    }
    if (estudiante.cedula.length !== 10) {
      setError("La cédula debe contener 10 dígitos.");
      setMensaje("");
      return;
    }

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!soloLetras.test(estudiante.nombres)) {
      setError("En los nombres no pueden contener números.");
      setMensaje("");
      return;
    }
    if (!soloLetras.test(estudiante.apellidos)) {
      setError("En los apellidos no pueden contener números.");
      setMensaje("");
      return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(estudiante.correo)) {
      setError("El correo electrónico debe contener un '@' y terminar con un punto y su extensión (ej. correo@ejemplo.com).");
      setMensaje("");
      return;
    }

    const fechaNac = new Date(estudiante.fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    if (edad < 18) {
      setError("El estudiante no puede ser menor de 18 años.");
      setMensaje("");
      return;
    }

    if (esEdicion) {
      setEstudiantes(
        estudiantes.map((est) => (est.cedula === estudiante.cedula ? estudiante : est))
      );
      setMensaje("Estudiante actualizado exitosamente.");
    } else {
      const cedulaRepetida = estudiantes.some((est) => est.cedula === estudiante.cedula);
      if (cedulaRepetida) {
        setError("La cédula ingresada ya está registrada.");
        setMensaje("");
        return;
      }

      setEstudiantes([...estudiantes, estudiante]);
      setMensaje("Estudiante registrado exitosamente.");
    }

    setError("");
    limpiarFormulario();
  };

  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <h3 className="fw-bold">
          <i className="bi bi-people me-2"></i>
          Estudiantes
        </h3>
        <p className="text-muted">Administración y registro de estudiantes</p>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            <i className={`bi ${esEdicion ? "bi-pencil-square" : "bi-person-plus"} me-2`}></i>
            {esEdicion ? "Actualizar Estudiante" : "Registro de estudiantes"}
          </h5>
        </div>

        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {mensaje && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {mensaje}
            </div>
          )}

          <form onSubmit={grabarEstudiante}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  className="form-control"
                  placeholder="Ingrese la cédula (solo números)"
                  maxLength={10}
                  value={estudiante.cedula}
                  onChange={manejarCambio}
                  disabled={esEdicion}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  className="form-control"
                  value={estudiante.fechaNacimiento}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  className="form-control"
                  placeholder="Ingrese los nombres (sin números)"
                  value={estudiante.nombres}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  className="form-control"
                  placeholder="Ingrese los apellidos (sin números)"
                  value={estudiante.apellidos}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  className="form-control"
                  placeholder="correo@ejemplo.com"
                  value={estudiante.correo}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Carrera</label>
                <select
                  name="carrera"
                  className="form-select"
                  value={estudiante.carrera}
                  onChange={manejarCambio}
                  required
                >
                  <option value="">Seleccione una carrera</option>
                  <option value="Desarrollo de Software">Desarrollo de Software</option>
                  <option value="Administración">Administración</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Estado</label>
                <select
                  name="estado"
                  className="form-select"
                  value={estudiante.estado}
                  onChange={manejarCambio}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              {esEdicion && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              )}
              
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={limpiarFormulario}
              >
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Limpiar
              </button>

              <button type="submit" className="btn btn-primary">
                <i className="bi bi-floppy me-2"></i>
                {esEdicion ? "Guardar cambios" : "Guardar estudiante"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* TABLA DE ESTUDIANTES */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Estudiantes registrados
          </h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Carrera</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {estudiantes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No hay estudiantes registrados.
                    </td>
                  </tr>
                ) : (
                  estudiantes.map((est) => (
                    <tr key={est.cedula}>
                      <td>{est.cedula}</td>
                      <td>{est.nombres}</td>
                      <td>{est.apellidos}</td>
                      <td>{est.correo}</td>
                      <td>{est.carrera}</td>
                      <td>
                        <span className={`badge ${est.estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
                          {est.estado}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => prepararActualizacion(est)}
                            title="Actualizar"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarEstudiante(est.cedula)}
                            title="Eliminar"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estudiantes;
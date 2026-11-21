import { useEffect, useState } from "react";
import { estudiantesService } from "../services/estudiantesService";

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
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarEstudiantes = async () => {
    try {
      setError("");
      setCargando(true);
      const data = await estudiantesService.listar();
      setEstudiantes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo obtener la lista de estudiantes desde el servidor."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    if (name === "cedula") {
      const soloNumeros = value.replace(/\D/g, "");
      setEstudiante((prev) => ({ ...prev, [name]: soloNumeros }));
      return;
    }

    if (name === "nombres" || name === "apellidos") {
      const sinNumeros = value.replace(/[0-9]/g, "");
      setEstudiante((prev) => ({ ...prev, [name]: sinNumeros }));
      return;
    }

    setEstudiante((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMensaje("");
      setCargando(true);

      if (esEdicion) {
        await estudiantesService.modificar(estudiante.cedula, estudiante);
        setMensaje("Estudiante actualizado correctamente.");
        setEsEdicion(false);
      } else {
        await estudiantesService.crear(estudiante);
        setMensaje("Estudiante registrado correctamente.");
      }

      setEstudiante(estudianteInicial);
      await cargarEstudiantes();
      setMostrarTabla(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Ocurrió un error al guardar los datos del estudiante."
      );
    } finally {
      setCargando(false);
    }
  };

  const manejarEditar = (item) => {
    setError("");
    setMensaje("");
    setEstudiante({
      cedula: item.cedula ?? "",
      fechaNacimiento: item.fechaNacimiento
        ? String(item.fechaNacimiento).slice(0, 10)
        : "",
      nombres: item.nombres ?? "",
      apellidos: item.apellidos ?? "",
      correo: item.correo ?? "",
      carrera: item.carrera ?? "",
      estado: item.estado ?? "Activo",
    });
    setEsEdicion(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const manejarCancelarEdicion = () => {
    setEstudiante(estudianteInicial);
    setEsEdicion(false);
    setError("");
    setMensaje("");
  };

  const manejarEliminar = async (cedula) => {
    try {
      setError("");
      setMensaje("");
      setCargando(true);
      await estudiantesService.eliminar(cedula);
      setMensaje("Estudiante eliminado correctamente.");
      await cargarEstudiantes();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo eliminar el estudiante."
      );
    } finally {
      setCargando(false);
    }
  };

  const alternarTabla = async () => {
    const siguienteEstado = !mostrarTabla;
    setMostrarTabla(siguienteEstado);
    if (siguienteEstado) {
      await cargarEstudiantes();
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="mb-3">
        <h4 className="mb-0">
          <i className="bi bi-person-plus me-2"></i>
          {esEdicion ? "Editar estudiante" : "Registro de estudiantes"}
        </h4>
      </div>

      {mensaje && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {mensaje}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensaje("")}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={manejarSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="cedula" className="form-label">
                  Cédula
                </label>
                <input
                  id="cedula"
                  type="text"
                  name="cedula"
                  className="form-control"
                  placeholder="Ingrese la cédula (solo números)"
                  value={estudiante.cedula}
                  onChange={manejarCambio}
                  disabled={esEdicion}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="fechaNacimiento" className="form-label">
                  Fecha de nacimiento
                </label>
                <input
                  id="fechaNacimiento"
                  type="date"
                  name="fechaNacimiento"
                  className="form-control"
                  value={estudiante.fechaNacimiento}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="nombres" className="form-label">
                  Nombres
                </label>
                <input
                  id="nombres"
                  type="text"
                  name="nombres"
                  className="form-control"
                  placeholder="Ingrese los nombres (sin números)"
                  value={estudiante.nombres}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="apellidos" className="form-label">
                  Apellidos
                </label>
                <input
                  id="apellidos"
                  type="text"
                  name="apellidos"
                  className="form-control"
                  placeholder="Ingrese los apellidos (sin números)"
                  value={estudiante.apellidos}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="correo" className="form-label">
                  Correo electrónico
                </label>
                <input
                  id="correo"
                  type="email"
                  name="correo"
                  className="form-control"
                  placeholder="correo@ejemplo.com"
                  value={estudiante.correo}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="carrera" className="form-label">
                  Carrera
                </label>
                <select
                  id="carrera"
                  name="carrera"
                  className="form-select"
                  value={estudiante.carrera}
                  onChange={manejarCambio}
                  required
                >
                  <option value="">Seleccione una carrera</option>
                  <option value="Desarrollo de Software">Desarrollo de Software</option>
                  <option value="Redes y Telecomunicaciones">
                    Redes y Telecomunicaciones
                  </option>
                  <option value="Administración">Administración</option>
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="estado" className="form-label">
                  Estado
                </label>
                <select
                  id="estado"
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

            <div className="mt-4 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={cargando}
              >
                {cargando
                  ? "Guardando..."
                  : esEdicion
                  ? "Guardar cambios"
                  : "Registrar estudiante"}
              </button>

              {esEdicion && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={manejarCancelarEdicion}
                  disabled={cargando}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h5 className="mb-0">Listado de estudiantes</h5>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={alternarTabla}
        >
          <i className={`bi ${mostrarTabla ? "bi-eye-slash" : "bi-table"} me-1`}></i>
          {mostrarTabla ? "Ocultar lista" : `Ver lista (${estudiantes.length})`}
        </button>
      </div>

      {mostrarTabla && (
        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombres y apellidos</th>
                  <th>Correo</th>
                  <th>Carrera</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-3">
                      {cargando
                        ? "Cargando estudiantes..."
                        : "No hay estudiantes registrados."}
                    </td>
                  </tr>
                ) : (
                  estudiantes.map((item) => (
                    <tr key={item.cedula || item.id}>
                      <td>{item.cedula}</td>
                      <td>
                        {item.nombres} {item.apellidos}
                      </td>
                      <td>{item.correo}</td>
                      <td>{item.carrera}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.estado === "Activo"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {item.estado}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => manejarEditar(item)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => manejarEliminar(item.cedula)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Estudiantes;
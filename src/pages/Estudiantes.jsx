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

const calcularEdad = (fechaStr) => {
  if (!fechaStr) return -1;
  const [anio, mes, dia] = String(fechaStr).slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return -1;

  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  const mesActual = hoy.getMonth() + 1;
  const diaActual = hoy.getDate();

  if (mesActual < mes || (mesActual === mes && diaActual < dia)) {
    edad--;
  }
  return edad;
};

const obtenerClaveEstudiante = (est) =>
  String(est?.cedula ?? est?.id ?? est?._id ?? "").trim();

function Estudiantes() {
  const [estudiante, setEstudiante] = useState(estudianteInicial);
  const [estudiantes, setEstudiantes] = useState([]);
  const [esEdicion, setEsEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cargarEstudiantes = async () => {
    try {
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

  const limpiarCamposFormulario = () => {
    setEstudiante(estudianteInicial);
    setEsEdicion(false);
    setIdEditando("");
  };

  const abrirNuevoEstudiante = () => {
    setError("");
    setMensaje("");
    limpiarCamposFormulario();
    setMostrarFormulario(true);
  };

  const manejarEditar = (item) => {
    setError("");
    setMensaje("");
    setEstudiante({
      cedula: item.cedula ? String(item.cedula) : "",
      fechaNacimiento: item.fechaNacimiento
        ? String(item.fechaNacimiento).slice(0, 10)
        : "",
      nombres: item.nombres ?? "",
      apellidos: item.apellidos ?? "",
      correo: item.correo ?? "",
      carrera: item.carrera ?? "",
      estado: item.estado ?? "Activo",
    });
    setIdEditando(obtenerClaveEstudiante(item));
    setEsEdicion(true);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const manejarCancelar = () => {
    setError("");
    limpiarCamposFormulario();
    setMostrarFormulario(false);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    if (name === "cedula") {
      const soloNumeros = value.replace(/\D/g, "").slice(0, 10);
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

  const validarFormulario = () => {
    const cedulaLimpia = estudiante.cedula.trim();
    const nombresLimpios = estudiante.nombres.trim();
    const apellidosLimpios = estudiante.apellidos.trim();
    const correoLimpio = estudiante.correo.trim().toLowerCase();
    const carreraLimpia = estudiante.carrera.trim();

    if (
      !cedulaLimpia ||
      !estudiante.fechaNacimiento ||
      !nombresLimpios ||
      !apellidosLimpios ||
      !correoLimpio ||
      !carreraLimpia
    ) {
      return "Por favor complete todos los campos obligatorios sin espacios en blanco.";
    }

    if (!/^\d{10}$/.test(cedulaLimpia)) {
      return "La cédula debe tener exactamente 10 dígitos numéricos.";
    }

    const edad = calcularEdad(estudiante.fechaNacimiento);
    if (edad < 18) {
      return "El estudiante debe ser mayor de edad (18 años o más).";
    }

    const cedulaDuplicada = estudiantes.some((est) => {
      const claveActual = obtenerClaveEstudiante(est);
      const mismaCedula = String(est.cedula ?? "").trim() === cedulaLimpia;
      return mismaCedula && claveActual !== idEditando;
    });

    if (cedulaDuplicada) {
      return "La cédula ingresada ya está registrada.";
    }

    const correoDuplicado = estudiantes.some((est) => {
      const claveActual = obtenerClaveEstudiante(est);
      const mismoCorreo =
        String(est.correo ?? "").trim().toLowerCase() === correoLimpio;
      return mismoCorreo && claveActual !== idEditando;
    });

    if (correoDuplicado) {
      return "El correo electrónico ingresado ya está registrado.";
    }

    return "";
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const mensajeValidacion = validarFormulario();
    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    const payload = {
      ...estudiante,
      cedula: estudiante.cedula.trim(),
      nombres: estudiante.nombres.trim(),
      apellidos: estudiante.apellidos.trim(),
      correo: estudiante.correo.trim().toLowerCase(),
      carrera: estudiante.carrera.trim(),
    };

    try {
      setGuardando(true);

      if (esEdicion) {
        await estudiantesService.modificar(payload.cedula, payload);
        setMensaje("Estudiante actualizado correctamente.");
      } else {
        await estudiantesService.crear(payload);
        setMensaje("Estudiante registrado correctamente.");
      }

      limpiarCamposFormulario();
      setMostrarFormulario(false);
      await cargarEstudiantes();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Ocurrió un error al guardar los datos del estudiante."
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = async (cedula) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este estudiante?")) {
      return;
    }

    try {
      setError("");
      setMensaje("");
      setGuardando(true);
      await estudiantesService.eliminar(cedula);
      setMensaje("Estudiante eliminado correctamente.");
      await cargarEstudiantes();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo eliminar el estudiante."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">
            <i
              className={`bi ${
                mostrarFormulario
                  ? esEdicion
                    ? "bi-pencil-square"
                    : "bi-person-plus"
                  : "bi-people"
              } me-2`}
            ></i>
            {mostrarFormulario
              ? esEdicion
                ? "Editar estudiante"
                : "Registro de estudiantes"
              : "Estudiantes"}
          </h4>
        </div>

        {!mostrarFormulario && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={abrirNuevoEstudiante}
          >
            <i className="bi bi-person-plus me-1"></i>
            Nuevo estudiante
          </button>
        )}
      </div>

      {mensaje && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
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
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      {mostrarFormulario ? (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={manejarSubmit} noValidate>
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
                    placeholder="Ingrese la cédula (10 dígitos)"
                    maxLength="10"
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
                    <option value="Desarrollo de Software">
                      Desarrollo de Software
                    </option>
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
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : esEdicion
                    ? "Guardar cambios"
                    : "Registrar estudiante"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={manejarCancelar}
                  disabled={guardando}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">Listado de estudiantes</h5>
          </div>
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
                          disabled={guardando}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => manejarEliminar(item.cedula)}
                          disabled={guardando}
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
import { useEffect, useState } from "react";
import { materiasService } from "../services/materiasService";

const materiaInicial = {
  codigo: "",
  nombre: "",
  descripcion: "",
  creditos: "",
  estado: "Activo",
  carrera: "",
};

const obtenerClaveMateria = (mat) =>
  String(mat?.id ?? mat?._id ?? mat?.codigo ?? "").trim();

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [materia, setMateria] = useState(materiaInicial);
  const [esEdicion, setEsEdicion] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarMaterias = async () => {
    setCargando(true);
    try {
      const data = await materiasService.listar();
      setMaterias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudieron obtener las materias desde el servidor."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setMateria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setMateria(materiaInicial);
    setEsEdicion(false);
    setError("");
  };

  const abrirModalNuevo = () => {
    setMensaje("");
    setError("");
    limpiarFormulario();
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setError("");
    limpiarFormulario();
    setMostrarModal(false);
  };

  const prepararActualizacion = (mat) => {
    setMensaje("");
    setError("");
    setMateria({
      codigo: mat.codigo || "",
      nombre: mat.nombre || "",
      descripcion: mat.descripcion || "",
      creditos: mat.creditos ?? "",
      estado: mat.estado || "Activo",
      carrera:
        typeof mat.carrera === "object"
          ? mat.carrera?.nombre || ""
          : mat.carrera || "",
    });
    setEsEdicion(true);
    setMostrarModal(true);
  };

  const eliminarMateria = async (codigo) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta materia?")) {
      return;
    }

    setError("");
    setMensaje("");
    try {
      await materiasService.eliminar(codigo);
      setMensaje("Materia eliminada exitosamente.");
      await cargarMaterias();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo eliminar la materia. Intente nuevamente."
      );
    }
  };

  const guardarMateria = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const codigoLimpio = materia.codigo.trim().toUpperCase();
    const nombreLimpio = materia.nombre.trim();
    const descripcionLimpia = materia.descripcion.trim();
    const carreraLimpia = materia.carrera.trim();
    const creditosNum = Number(materia.creditos);

    if (!codigoLimpio) {
      setError("El código de la materia es obligatorio.");
      return;
    }

    if (!nombreLimpio) {
      setError("El nombre de la materia es obligatorio.");
      return;
    }

    if (!descripcionLimpia) {
      setError("La descripción de la materia es obligatoria.");
      return;
    }

    if (!carreraLimpia) {
      setError("La carrera es obligatoria.");
      return;
    }

    if (
      materia.creditos === "" ||
      !Number.isInteger(creditosNum) ||
      creditosNum <= 0
    ) {
      setError("Los créditos deben ser números enteros mayores que cero.");
      return;
    }

    if (!["Activo", "Inactivo"].includes(materia.estado)) {
      setError("El estado debe ser Activo o Inactivo.");
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        codigo: codigoLimpio,
        nombre: nombreLimpio,
        descripcion: descripcionLimpia,
        creditos: creditosNum,
        estado: materia.estado,
        carrera: carreraLimpia,
      };

      if (esEdicion) {
        await materiasService.actualizar(codigoLimpio, payload);
        setMensaje("Materia actualizada exitosamente.");
      } else {
        const codigoRepetido = materias.some(
          (mat) => (mat.codigo || "").trim().toUpperCase() === codigoLimpio
        );
        if (codigoRepetido) {
          setError("El código de la materia ya se encuentra registrado.");
          setGuardando(false);
          return;
        }

        await materiasService.crear(payload);
        setMensaje("Materia registrada exitosamente.");
      }

      setMostrarModal(false);
      limpiarFormulario();
      await cargarMaterias();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Ocurrió un error al comunicarse con el servidor."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">
            <i className="bi bi-book me-2"></i>
            Materias
          </h3>
          <p className="text-muted mb-0">
            Administración y registro de asignaturas
          </p>
        </div>
        {!(mostrarModal && esEdicion) && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={abrirModalNuevo}
          >
            <i className="bi bi-journal-plus me-2"></i>
            Nueva Materia
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

      {!mostrarModal && error && (
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

      {/* TABLA DE MATERIAS: se oculta al seleccionar Editar */}
      {!(mostrarModal && esEdicion) && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i>
              Materias registradas
            </h5>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Créditos</th>
                    <th>Estado</th>
                    <th>Carrera</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {cargando ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        Cargando materias...
                      </td>
                    </tr>
                  ) : materias.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No hay materias registradas.
                      </td>
                    </tr>
                  ) : (
                    materias.map((mat, index) => (
                      <tr key={obtenerClaveMateria(mat) || index}>
                        <td>{mat.codigo}</td>
                        <td>{mat.nombre}</td>
                        <td>{mat.descripcion}</td>
                        <td>{mat.creditos}</td>
                        <td>
                          <span
                            className={`badge ${
                              mat.estado === "Activo"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {mat.estado}
                          </span>
                        </td>
                        <td>
                          {typeof mat.carrera === "object"
                            ? mat.carrera?.nombre || "-"
                            : mat.carrera || "-"}
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => prepararActualizacion(mat)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => eliminarMateria(mat.codigo)}
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
      )}

      {/* VENTANA POP-UP / MODAL PARA REGISTRAR Y EDITAR */}
      {mostrarModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div
                className={`modal-header ${
                  esEdicion ? "bg-warning text-dark" : "bg-primary text-white"
                }`}
              >
                <h5 className="modal-title">
                  <i
                    className={`bi ${
                      esEdicion ? "bi-pencil-square" : "bi-journal-plus"
                    } me-2`}
                  ></i>
                  {esEdicion ? "Editar Materia" : "Registro de nueva materia"}
                </h5>
                <button
                  type="button"
                  className={`btn-close ${esEdicion ? "" : "btn-close-white"}`}
                  onClick={cerrarModal}
                  disabled={guardando}
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body p-4">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={guardarMateria} noValidate>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Código</label>
                      <input
                        type="text"
                        name="codigo"
                        className="form-control"
                        placeholder="Ej. MAT006"
                        value={materia.codigo}
                        onChange={manejarCambio}
                        disabled={esEdicion}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        placeholder="Ej. Arquitectura de Software"
                        value={materia.nombre}
                        onChange={manejarCambio}
                        required
                      />
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea
                        name="descripcion"
                        className="form-control"
                        rows="2"
                        placeholder="Breve descripción de la asignatura"
                        value={materia.descripcion}
                        onChange={manejarCambio}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Créditos</label>
                      <input
                        type="number"
                        name="creditos"
                        className="form-control"
                        min="1"
                        step="1"
                        placeholder="Ej. 4"
                        value={materia.creditos}
                        onChange={manejarCambio}
                        required
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Estado</label>
                      <select
                        name="estado"
                        className="form-select"
                        value={materia.estado}
                        onChange={manejarCambio}
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Carrera</label>
                      <input
                        type="text"
                        name="carrera"
                        className="form-control"
                        placeholder="Ej. Desarrollo de Software"
                        value={materia.carrera}
                        onChange={manejarCambio}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer px-0 pb-0 pt-3 border-0 d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={cerrarModal}
                      disabled={guardando}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={guardando}
                    >
                      <i className="bi bi-floppy me-2"></i>
                      {guardando
                        ? "Guardando..."
                        : esEdicion
                        ? "Guardar"
                        : "Guardar materia"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Materias;
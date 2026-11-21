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

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [materia, setMateria] = useState(materiaInicial);
  const [esEdicion, setEsEdicion] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarMaterias = async () => {
    setCargando(true);
    try {
      const data = await materiasService.listar();
      setMaterias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar las materias desde el servidor.");
      console.error(err);
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
    limpiarFormulario();
    setMostrarModal(true);
  };

  const prepararActualizacion = (mat) => {
    setMensaje("");
    setMateria({
      codigo: mat.codigo || "",
      nombre: mat.nombre || "",
      descripcion: mat.descripcion || "",
      creditos: mat.creditos ?? "",
      estado: mat.estado || "Activo",
      carrera: typeof mat.carrera === "object" ? mat.carrera?.nombre || "" : mat.carrera || "",
    });
    setEsEdicion(true);
    setError("");
    setMostrarModal(true);
  };

  const eliminarMateria = async (codigo) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta materia?")) return;

    setError("");
    setMensaje("");
    try {
      await materiasService.eliminar(codigo);
      setMensaje("Materia eliminada exitosamente.");
      await cargarMaterias();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo eliminar la materia.");
      console.error(err);
    }
  };

  const guardarMateria = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (
      !materia.codigo.trim() ||
      !materia.nombre.trim() ||
      !materia.descripcion.trim() ||
      !materia.carrera.trim() ||
      !materia.creditos
    ) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    if (Number(materia.creditos) <= 0) {
      setError("El número de créditos debe ser mayor que cero.");
      return;
    }

    try {
      if (esEdicion) {
        await materiasService.actualizar(materia.codigo, materia);
        setMensaje("Materia actualizada exitosamente.");
      } else {
        const codigoRepetido = materias.some(
          (mat) => mat.codigo.toUpperCase() === materia.codigo.trim().toUpperCase()
        );
        if (codigoRepetido) {
          setError("El código de la materia ya está registrado.");
          return;
        }

        await materiasService.crear(materia);
        setMensaje("Materia registrada exitosamente.");
      }

      setMostrarModal(false);
      limpiarFormulario();
      await cargarMaterias();
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error al guardar la materia.");
      console.error(err);
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
          <p className="text-muted mb-0">Administración y registro de asignaturas</p>
        </div>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>
          <i className="bi bi-journal-plus me-2"></i>
          Nueva Materia
        </button>
      </div>

      {mensaje && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {mensaje}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensaje("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* TABLA DE MATERIAS */}
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
                  materias.map((mat) => (
                    <tr key={mat.codigo}>
                      <td>{mat.codigo}</td>
                      <td>{mat.nombre}</td>
                      <td>{mat.descripcion}</td>
                      <td>{mat.creditos}</td>
                      <td>
                        <span
                          className={`badge ${
                            mat.estado === "Activo" ? "bg-success" : "bg-secondary"
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
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => prepararActualizacion(mat)}
                            title="Actualizar"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
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

      {/* VENTANA MODAL / POP-UP PARA REGISTRAR / ACTUALIZAR */}
      {mostrarModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i
                    className={`bi ${
                      esEdicion ? "bi-pencil-square" : "bi-journal-plus"
                    } me-2`}
                  ></i>
                  {esEdicion ? "Actualizar Materia" : "Registro de nueva materia"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={guardarMateria}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Código alfanumérico</label>
                      <input
                        type="text"
                        name="codigo"
                        className="form-control"
                        placeholder="Ej. MAT-001"
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
                        placeholder="Nombre de la materia"
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
                      <label className="form-label">Número de créditos</label>
                      <input
                        type="number"
                        name="creditos"
                        className="form-control"
                        min="1"
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
                      onClick={() => setMostrarModal(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-floppy me-2"></i>
                      {esEdicion ? "Guardar cambios" : "Guardar materia"}
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
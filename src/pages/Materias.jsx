import { useState } from "react";

const materiaInicial = {
  codigo: "",
  nombre: "",
  descripcion: "",
  creditos: "",
  estado: "Activo",
};

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [materia, setMateria] = useState(materiaInicial);
  const [esEdicion, setEsEdicion] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setMateria({
      ...materia,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setMateria(materiaInicial);
    setEsEdicion(false);
    setError("");
    setMensaje("");
  };

  const abrirModalNuevo = () => {
    limpiarFormulario();
    setMostrarModal(true);
  };

  const prepararActualizacion = (mat) => {
    setMateria(mat);
    setEsEdicion(true);
    setError("");
    setMensaje("");
    setMostrarModal(true);
  };

  const eliminarMateria = (codigo) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta materia?")) {
      setMaterias(materias.filter((mat) => mat.codigo !== codigo));
      setMensaje("Materia eliminada exitosamente.");
      setError("");
    }
  };

  const guardarMateria = (e) => {
    e.preventDefault();
    setError("");

    if (
      !materia.codigo.trim() ||
      !materia.nombre.trim() ||
      !materia.descripcion.trim() ||
      !materia.creditos
    ) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    if (Number(materia.creditos) <= 0) {
      setError("El número de créditos debe ser mayor que cero.");
      return;
    }

    if (esEdicion) {
      setMaterias(
        materias.map((mat) => (mat.codigo === materia.codigo ? materia : mat))
      );
      setMensaje("Materia actualizada exitosamente.");
    } else {
      const codigoRepetido = materias.some((mat) => mat.codigo === materia.codigo);
      if (codigoRepetido) {
        setError("El código de la materia ya está registrado.");
        return;
      }

      setMaterias([...materias, materia]);
      setMensaje("Materia registrada exitosamente.");
    }

    setError("");
    setMostrarModal(false);
    limpiarFormulario();
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
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {materias.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
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
                        <span className={`badge ${mat.estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
                          {mat.estado}
                        </span>
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
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className={`bi ${esEdicion ? "bi-pencil-square" : "bi-journal-plus"} me-2`}></i>
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

                    <div className="col-md-6 mb-3">
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

                    <div className="col-md-6 mb-3">
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
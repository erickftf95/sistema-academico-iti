import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_URL || "https://backend-academico-iti.onrender.com/api";

// Normaliza barras duplicadas o finales para evitar "//materias"
const baseURL = rawBaseUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Deja únicamente los campos permitidos al crear o actualizar una materia
const normalizarPayloadMateria = (materia) => ({
  codigo: materia.codigo.trim().toUpperCase(),
  nombre: materia.nombre.trim(),
  descripcion: (materia.descripcion || "").trim(),
  creditos: Number(materia.creditos),
  estado: materia.estado,
  carrera: (materia.carrera || "").trim(),
});

export const materiasService = {
  listar: async () => {
    const response = await api.get("/materias");
    return response.data;
  },

  obtenerPorCodigo: async (codigo) => {
    const response = await api.get(`/materias/${encodeURIComponent(codigo.trim())}`);
    return response.data;
  },

  crear: async (materia) => {
    const payload = normalizarPayloadMateria(materia);
    const response = await api.post("/materias", payload);
    return response.data;
  },

  actualizar: async (codigo, materia) => {
    const payload = normalizarPayloadMateria(materia);
    const response = await api.put(
      `/materias/${encodeURIComponent(codigo.trim())}`,
      payload
    );
    return response.data;
  },

  eliminar: async (codigo) => {
    const response = await api.delete(
      `/materias/${encodeURIComponent(codigo.trim())}`
    );
    return response.data;
  },
};

export default materiasService;
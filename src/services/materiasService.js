import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-academico-iti.onrender.com/api";

const clienteApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const extraerDatos = (response) => {
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (Array.isArray(response.data?.materias)) return response.data.materias;
  return response.data;
};

export const materiasService = {
  listar: async () => {
    const response = await clienteApi.get("/materias");
    return extraerDatos(response);
  },

  crear: async (materia) => {
    const response = await clienteApi.post("/materias", materia);
    return response.data;
  },

  actualizar: async (codigo, materia) => {
    const response = await clienteApi.put(`/materias/${codigo}`, materia);
    return response.data;
  },

  eliminar: async (codigo) => {
    const response = await clienteApi.delete(`/materias/${codigo}`);
    return response.data;
  },
};
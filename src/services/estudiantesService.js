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
  if (Array.isArray(response.data?.estudiantes)) return response.data.estudiantes;
  return response.data;
};

export const estudiantesService = {
  listar: async () => {
    const response = await clienteApi.get("/estudiantes");
    return extraerDatos(response);
  },

  crear: async (estudiante) => {
    const response = await clienteApi.post("/estudiantes", estudiante);
    return response.data;
  },

  modificar: async (cedula, estudiante) => {
    const response = await clienteApi.put(`/estudiantes/${cedula}`, estudiante);
    return response.data;
  },

  actualizar: async (cedula, estudiante) => {
    const response = await clienteApi.put(`/estudiantes/${cedula}`, estudiante);
    return response.data;
  },

  eliminar: async (cedula) => {
    const response = await clienteApi.delete(`/estudiantes/${cedula}`);
    return response.data;
  },
};
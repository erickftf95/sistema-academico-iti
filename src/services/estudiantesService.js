import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  timeout: 5000,
});

export const estudiantesService = {
  listar: async () => (await api.get("/estudiantes")).data,

  crear: async (estudiante) => (await api.post("/estudiantes", estudiante)).data,

  modificar: async (cedula, estudiante) =>
    (await api.put(`/estudiantes/${encodeURIComponent(cedula)}`, estudiante)).data,

  eliminar: async (cedula) =>
    (await api.delete(`/estudiantes/${encodeURIComponent(cedula)}`)).data,
};
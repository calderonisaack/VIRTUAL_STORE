// src/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const obtenerProductos = async () => {
    try {
        const respuesta = await fetch(`${API_URL}productos/`);
        if (!respuesta.ok) throw new Error('Error al obtener productos');
        return await respuesta.json();
    } catch (error) {
        console.error("Error conectando con Django:", error);
        return [];
    }
};

export const obtenerProductoPorId = async (id) => {
    try {
        const respuesta = await fetch(`${API_URL}productos/${id}/`);
        if (!respuesta.ok) throw new Error('Producto no encontrado');
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const obtenerCategorias = async () => {
    try {
        const respuesta = await fetch(`${API_URL}categorias/`);
        if (!respuesta.ok) throw new Error('Error al obtener categorías');
        return await respuesta.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
};

export const crearProducto = async (datosProducto) => {
    try {
        const respuesta = await fetch(`${API_URL}productos/`, {
            method: 'POST',
            body: datosProducto 
        });
        
        if (!respuesta.ok) {
            const texto = await respuesta.text(); // Leemos como texto primero
            try {
                const errorData = JSON.parse(texto); // Intentamos convertir a JSON
                throw new Error(JSON.stringify(errorData));
            } catch (e) {
                // Si falla, es porque es HTML (Error de servidor o ruta)
                throw new Error(`Django falló (Error ${respuesta.status}). Revisa la terminal negra de Python.`);
            }
        }
        return await respuesta.json();
    } catch (error) {
        console.error("Error al crear producto:", error);
        throw error;
    }
};

export const actualizarProducto = async (id, datosActualizados) => {
    try {
        const respuesta = await fetch(`${API_URL}productos/${id}/`, {
            method: 'PUT',
            body: datosActualizados 
        });
        if (!respuesta.ok) {
            const texto = await respuesta.text();
            try {
                const errorData = JSON.parse(texto);
                throw new Error(JSON.stringify(errorData));
            } catch (e) {
                throw new Error(`Django falló (Error ${respuesta.status}). Revisa la terminal negra de Python.`);
            }
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const eliminarProducto = async (id) => {
    try {
        const respuesta = await fetch(`${API_URL}productos/${id}/`, {
            method: 'DELETE',
        });
        if (!respuesta.ok) throw new Error('Error al eliminar');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const crearCategoria = async (datosCategoria) => {
    try {
        const respuesta = await fetch(`${API_URL}categorias/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCategoria)
        });
        if (!respuesta.ok) throw new Error('Error al crear categoría');
        return await respuesta.json();
    } catch (error) {
        console.error("Error al crear categoría:", error);
        throw error;
    }
};

export const obtenerLotes = async () => {
    try {
        const respuesta = await fetch(`${API_URL}lotes/`);
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener lotes:", error);
        return [];
    }
};

export const registrarLoteInventario = async (datosLote) => {
    try {
        const respuesta = await fetch(`${API_URL}lotes/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosLote)
        });
        
        if (!respuesta.ok) {
            const texto = await respuesta.text();
            try {
                const errorData = JSON.parse(texto);
                throw new Error(JSON.stringify(errorData));
            } catch (e) {
                throw new Error(`Ruta de Lotes falló (Error ${respuesta.status}). Revisa la terminal negra de Python.`);
            }
        }
        return await respuesta.json();
    } catch (error) {
        console.error("Error al registrar lote:", error);
        throw error;
    }
};

// --- NUEVAS FUNCIONES PARA EDITAR Y ELIMINAR CATEGORÍAS ---

export const actualizarCategoria = async (id, datosActualizados) => {
    try {
        const respuesta = await fetch(`${API_URL}categorias/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });
        if (!respuesta.ok) throw new Error('Error al actualizar categoría');
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const eliminarCategoria = async (id) => {
    try {
        const respuesta = await fetch(`${API_URL}categorias/${id}/`, {
            method: 'DELETE',
        });
        // Si el servidor lanza error, usualmente es porque hay productos usando esta categoría
        if (!respuesta.ok) throw new Error('Error al eliminar. Posiblemente hay productos asociados.');
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// --- FUNCIONES PARA TRABAJADORES (USUARIOS) ---
export const obtenerTrabajadores = async () => {
    try {
        const respuesta = await fetch(`${API_URL}usuarios/`);
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener trabajadores:", error);
        return [];
    }
};

export const crearTrabajador = async (datosTrabajador) => {
    try {
        const respuesta = await fetch(`${API_URL}usuarios/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosTrabajador)
        });
        if (!respuesta.ok) throw new Error('Error al crear trabajador');
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const actualizarTrabajador = async (id, datosActualizados) => {
    try {
        const respuesta = await fetch(`${API_URL}usuarios/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });
        if (!respuesta.ok) throw new Error('Error al actualizar trabajador');
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const eliminarTrabajador = async (id) => {
    try {
        const respuesta = await fetch(`${API_URL}usuarios/${id}/`, {
            method: 'DELETE',
        });
        if (!respuesta.ok) throw new Error('Error al eliminar trabajador');
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// --- FUNCIÓN DE LOGIN ---
export const iniciarSesion = async (credenciales) => {
    try {
        const respuesta = await fetch(`${API_URL}login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciales)
        });
        if (!respuesta.ok) throw new Error('Usuario o contraseña incorrectos');
        return await respuesta.json(); // Nos devuelve los datos del usuario logueado
    } catch (error) {
        throw error;
    }
};
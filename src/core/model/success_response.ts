
/**
 * Define la estructura para los metadatos de paginación.
 */
export interface PaginationMetadata {
    rows: number;          // Número de registros en la página actual
    page: number;          // Número de la página actual
    total_data: number;    // Número total de registros disponibles (en todas las páginas)
}

/**
 * Interfaz para el cuerpo de la respuesta exitosa.
 * La propiedad 'data' es genérica para manejar cualquier tipo de contenido.
 */
export interface SuccessResponse<T> {
    code: string;
    message: string;
    data: T;
    metadata?: PaginationMetadata;
}
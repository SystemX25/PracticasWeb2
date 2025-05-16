// src/app/models/producto.model.ts
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  stock?: number; // Opcional si lo usas
}
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  stock?: number; // Hacer stock opcional ya que puede ser NULL
}
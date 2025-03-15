import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarProductos();
  }

  cargarProductos(): void {
    const productos = localStorage.getItem('productos');

    if (productos) {
      this.productosSubject.next(this.parseXML(productos));
    } else {
      this.http.get('productos.xml', { responseType: 'text' }).pipe(
        map(xml => this.parseXML(xml)),
        catchError(error => {
          console.error('Error al cargar los productos:', error);
          return [];
        })
      ).subscribe(productos => {
        this.productosSubject.next(productos);
        this.guardarCambios();
      });
    }
  }

  private parseXML(xml: string): Producto[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const productos: Producto[] = [];
    
    Array.from(xmlDoc.getElementsByTagName('producto')).forEach(prod => {
      const id = parseInt(prod.getAttribute('id') || '0');
      
      productos.push({
        id: id,
        nombre: prod.getElementsByTagName('nombre')[0]?.textContent || '',
        imagen: prod.getElementsByTagName('imagen')[0]?.textContent || '',
        precio: parseInt(prod.getElementsByTagName('precio')[0]?.textContent || '0'),
        cantidad: parseInt(prod.getElementsByTagName('cantidad')[0]?.textContent || '0')
      });
    });
    
    return productos;
  }

  agregarProducto(producto: Producto): void {
    const productos = this.productosSubject.value;
    const maxId = Math.max(...productos.map(p => p.id), 0);
    producto.id = maxId + 1;
    
    this.productosSubject.next([...productos, producto]);
    this.guardarCambios();
  }

  actualizarProducto(producto: Producto): void {
    const productos = this.productosSubject.value;
    const index = productos.findIndex(p => p.id === producto.id);
    
    if (index !== -1) {
      productos[index] = { ...producto };
      this.productosSubject.next([...productos]);
      this.guardarCambios();
    }
  }

  eliminarProducto(id: number): void {
    const productos = this.productosSubject.value;
    this.productosSubject.next(productos.filter(p => p.id !== id));
    this.guardarCambios();
  }

  private guardarCambios(): void {
    const productos = this.productosSubject.value;
    const xml = this.generarXML(productos);

    // Guardar en localStorage
    localStorage.setItem('productos', xml);

    // Descargar el archivo productos.xml automáticamente
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos.xml';
    a.click();
    window.URL.revokeObjectURL(url);

    console.log('XML actualizado y descargado:', xml);
  }

  private generarXML(productos: Producto[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<productos>\n';
  
    // Iteramos sobre cada producto
    productos.forEach(p => {
      xml += `  <producto>\n`; // Apertura de cada producto
      
      // Añadimos cada propiedad en su propia línea
      xml += `    <id>${p.id}</id>\n`;
      xml += `    <nombre>${p.nombre}</nombre>\n`;
      xml += `    <precio>${p.precio}</precio>\n`;
      xml += `    <imagen>${p.imagen}</imagen>\n`;
      
      xml += `  </producto>\n`; // Cierre de cada producto
    });
  
    xml += '</productos>';
  
    return xml;
  }  
}

import { Component } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  imports: [CommonModule, DatePipe, DecimalPipe],
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent {
  pedidos: any[] = [];

  constructor(private pedidosService: PedidosService) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    console.log(usuario.id);

    if (usuario?.id) {
      this.pedidosService.obtenerPedidosPorUsuario(usuario.id).subscribe({
        next: (data) => {
          console.log(data)
          this.pedidos = data.map(pedido => {
            return {
              ...pedido,
              productos: typeof pedido.productos === 'string'
                ? JSON.parse(pedido.productos)
                : pedido.productos
            };
          });
          console.log(this.pedidos)
        },
        error: (err) => console.error('Error al obtener pedidos:', err)
      });
      
    } else {
      console.warn('No se encontró el usuario en localStorage');
    }
  }
  
}

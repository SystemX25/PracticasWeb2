import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';
import { loadScript } from '@paypal/paypal-js';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, AfterViewInit, OnDestroy {
  carritoAgrupado: any[] = [];
  private paypalButtons: any;
  private paypalScriptLoaded = false;

  constructor(private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.agruparProductos();
  }

  ngAfterViewInit(): void {
    if (this.carritoAgrupado.length > 0) {
      this.loadPayPalScript();
    }
  }

  ngOnDestroy(): void {
    this.cleanUpPayPal();
  }

  generarXML(): void {
    this.carritoService.generarXML();
  }

  private cleanUpPayPal(): void {
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '';
    }
    if (this.paypalButtons) {
      this.paypalButtons.close();
      this.paypalButtons = null;
    }
    this.paypalScriptLoaded = false;
  }

  private async loadPayPalScript(): Promise<void> {
    // Limpiar antes de cargar
    this.cleanUpPayPal();

    try {
      const paypal = await loadScript({
        clientId: "ATz3ewUX5fga-YBSojxcxgUAlup6BMOITH2kEGhrF3F8-6yi-Ylrp6zK0beMKkNEd_37m5kio6p0Nciw",
        currency: "MXN",
        debug: true, 
        disableFunding: "card" // Deshabilitar otras opciones de financiamiento
      });
      
      if (paypal && paypal.Buttons) {
        this.paypalScriptLoaded = true;
        this.setupPayPalButtons(paypal);
      }
    } catch (error) {
      console.error("Error al cargar el SDK de PayPal:", error);
      alert('No se pudo cargar el sistema de pagos. Por favor recarga la página.');
    }
  }

  private setupPayPalButtons(paypal: any): void {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    // Crear un nuevo contenedor fresco
    container.innerHTML = '';
    const newContainer = document.createElement('div');
    newContainer.id = 'paypal-button-container-fresh';
    container.appendChild(newContainer);

    this.paypalButtons = paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: (data: any, actions: any) => {
        if (!actions.order) {
          throw new Error('PayPal actions.order is undefined');
        }
        
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              value: this.calcularTotal().toFixed(2),
              currency_code: "MXN",
              breakdown: {
                item_total: {
                  value: this.calcularSubtotal().toFixed(2),
                  currency_code: "MXN"
                },
                tax_total: {
                  value: this.calcularIVA().toFixed(2),
                  currency_code: "MXN"
                }
              }
            },
            items: this.getPayPalItems()
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        try {
          if (!actions.order) {
            throw new Error('PayPal actions.order is undefined');
          }
          
          const details = await actions.order.capture();
          const payerName = details.payer?.name?.given_name || 'cliente';
          
          // Limpiar el carrito después de pago exitoso
         
          this.carritoAgrupado = [];
          this.cleanUpPayPal();
          
          alert(`¡Pago completado por ${payerName}! Gracias por tu compra.`);

          this.generarXML();
           this.carritoService.limpiarCarrito();
        } catch (err) {
          console.error("Error al capturar el pago:", err);
          alert('Ocurrió un error al confirmar el pago. Por favor intenta nuevamente.');
        }
      },
      onError: (err: any) => {
        console.error("Error en el proceso de pago:", err);
        alert('Ocurrió un error durante el proceso de pago. Por favor intenta nuevamente.');
      },
      onCancel: (data: any) => {
        console.log("Pago cancelado por el usuario", data);
      }
    });

    
    this.paypalButtons.render('#paypal-button-container-fresh')
      .catch((err: any) => {
        console.error("Error al renderizar botones PayPal:", err);
      });
  }

  agruparProductos(): void {
    const carrito = this.carritoService.obtenerProducto();
    const agrupado: { [id: string]: any } = {};  
    
    carrito.forEach(producto => {
      if (agrupado[producto.id]) {
        agrupado[producto.id].cantidad++;
        agrupado[producto.id].precioTotal = producto.precio * agrupado[producto.id].cantidad;
      } else {
        agrupado[producto.id] = { 
          ...producto, 
          cantidad: 1, 
          precioTotal: producto.precio
        };
      }
    });
    
    this.carritoAgrupado = Object.values(agrupado);
    
    // Recargar botones de PayPal si el carrito cambia
    if (this.carritoAgrupado.length > 0) {
      if (this.paypalScriptLoaded) {
        this.setupPayPalButtons((window as any).paypal);
      } else {
        this.loadPayPalScript();
      }
    } else {
      this.cleanUpPayPal();
    }
  }

  calcularSubtotal(): number {
    return this.carritoAgrupado.reduce((total, producto) => 
      total + (producto.precio * producto.cantidad), 0);
  }

  calcularIVA(): number {
    return this.calcularSubtotal() * 0.16;
  }

  calcularTotal(): number {
    return this.calcularSubtotal() + this.calcularIVA();
  }

  getPayPalItems(): any[] {
    return this.carritoAgrupado.map(producto => ({
      name: producto.nombre.substring(0, 127),
      unit_amount: {
        value: producto.precio.toFixed(2),
        currency_code: "MXN"
      },
      quantity: producto.cantidad.toString(),
      sku: producto.id.toString().substring(0, 127)
    }));
  }

  eliminarProducto(id: number): void {
    this.carritoService.eliminarProducto(id);
    this.agruparProductos();
  }

  agregarProducto(producto: any): void {
    this.carritoService.agregarProducto(producto);
    this.agruparProductos();
  }
}
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Si necesitas pruebas HTTP
import { InventarioService } from './inventario.service';  // Importa el servicio a probar

describe('InventarioService', () => {
  let service: InventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Importa el módulo de pruebas HTTP si el servicio hace peticiones HTTP
    });
    service = TestBed.inject(InventarioService);  // Inyecta el servicio
  });

  it('should be created', () => {
    expect(service).toBeTruthy();  // Verifica si el servicio fue creado correctamente
  });

  // Agrega más pruebas si es necesario para métodos específicos del servicio
});

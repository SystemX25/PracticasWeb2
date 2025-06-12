import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/perfil.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {};
  mensaje: string = '';
  idUsuario: number = 0;
  editando: boolean = false;
  usuarioEditado: any = {};

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.idUsuario = usuario.id;

    this.usuarioService.obtenerPerfil(this.idUsuario).subscribe(data => {
      this.usuario = data;
      this.usuarioEditado = {...data}; 
    });
  }

  toggleEdicion(): void {
    this.editando = !this.editando;
    if (this.editando) {
      this.usuarioEditado = {...this.usuario}; 
    }
  }

  guardarCambios(): void {
    this.usuarioService.actualizarPerfil(this.idUsuario, this.usuarioEditado).subscribe({
      next: (res) => {
        this.mensaje = 'Perfil actualizado correctamente';
        this.usuario = {...this.usuarioEditado};
        this.editando = false;
        
        setTimeout(() => {
          this.mensaje = '';
        }, 10000);
      },
      error: (err) => {
        this.mensaje = 'Error al actualizar el perfil';
        console.error(err);
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.usuarioEditado = {...this.usuario};
  }
}
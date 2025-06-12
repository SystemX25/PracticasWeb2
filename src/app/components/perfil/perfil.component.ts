// src/app/components/perfil/perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/perfil.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {};
  mensaje: string = '';
  idUsuario: number = 0;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.idUsuario = usuario.id;

    this.usuarioService.obtenerPerfil(this.idUsuario).subscribe(data => {
      this.usuario = data;
    });
  }

  guardarCambios(): void {
    this.usuarioService.actualizarPerfil(this.idUsuario, this.usuario).subscribe(res => {
      this.mensaje = 'Perfil actualizado correctamente';
    });
  }
}

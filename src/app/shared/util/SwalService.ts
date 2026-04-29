import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class SwalService {

    success(title: string, text: string) {
        return Swal.fire({
            icon: 'success',
            title,
            text
        });
    }

    error(title: string, text: string) {
        return Swal.fire({
            icon: 'error',
            title,
            text
        });
    }

    warning(title: string, text: string) {
        return Swal.fire({
            icon: 'warning',
            title,
            text
        });
    }

    confirm(title: string, text: string = '¿Estás seguro?') {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        });
    }

    input(title: string, html: string) {
        return Swal.fire({
            title,
            html,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            preConfirm: () => true
        });
    }
}
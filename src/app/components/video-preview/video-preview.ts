import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-video-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-preview.html',
  styleUrl: './video-preview.scss'
})
export class VideoPreview {
  @Input() videoUrl: string = '';
  @Input() productName: string = '';
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // Prevenir que el modal se cierre al hacer clic en el contenido del video
  onVideoClick(event: Event): void {
    event.stopPropagation();
  }
}

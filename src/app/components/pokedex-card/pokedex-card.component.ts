import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokedex-card',
  templateUrl: './pokedex-card.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PokedexCardComponent {
  @Input() pokemon!: { name: string; url: string };

  getPokemonId(): string {
    const parts = this.pokemon.url.split('/');
    return parts[parts.length - 2];
  }
}

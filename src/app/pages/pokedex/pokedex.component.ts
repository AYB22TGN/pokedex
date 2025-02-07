import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PokedexCardComponent } from '../../components/pokedex-card/pokedex-card.component';



@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PokedexCardComponent]
})
export class PokedexComponent {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  searchTerm: string = '';

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe((data) => {
      this.pokemons = data.results;
      this.filteredPokemons = [...this.pokemons];
    });
  }

  // on filtre les pokémon en fonction de la recherche sur chaque lettre tapée
  filterPokemons(): void {
    this.filteredPokemons = this.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getPokemonId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
  
}

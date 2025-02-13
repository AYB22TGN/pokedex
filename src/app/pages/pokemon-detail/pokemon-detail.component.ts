import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonStatsDiagramComponent } from '../../components/pokemon-stats-diagram/pokemon-stats-diagram.component';


@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonStatsDiagramComponent]
})
export class PokemonDetailComponent {
  pokemon: any;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PokemonService) private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const pokemonId = params.get('id');
      if (pokemonId) {
        this.loadPokemonDetails(pokemonId);
      }
    });
  }

  loadPokemonDetails(id: string) {
    this.isLoading = true;
    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (data: any) => {
        this.pokemon = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Impossible de charger les données du Pokémon.";
        this.isLoading = false;
      }
    });
  }

  // dans notre cas, page précendente = pokedex
  goBack(): void {
    this.router.navigate(['/pokedex']);
  }

  navigatePokemon(direction: number): void {
    const newId = this.pokemon.id + direction;
    if (newId > 0) {
      this.router.navigate(['/pokemon', newId]);
    }
  }

  // on récupère les noms des types du pokémon dans une liste
  getAbilities(): string[] {
    return this.pokemon.abilities.map((a: { ability: { name: string } }) => a.ability.name);
  }

  // on récupère les noms des types et leurs couleurs dans une liste
  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: "#AAA67F",
      fire: "#F57D31",
      water: "#6493EB",
      electric: "#F9CF30",
      grass: "#74CB48",
      ice: "#9AD6DF",
      fighting: "#C12239",
      poison: "#A43E9E",
      ground: "#DEC16B",
      flying: "#A891EC",
      psychic: "#FB5584",
      bug: "#A7B723",
      rock: "#B69E31",
      ghost: "#70559B",
      dragon: "#7037FF",
      dark: "#75574C",
      steel: "#B7B9D0",
      fairy: "#E69EAC"
    };
    return typeColors[type] || "#777"; // si la couleur n'est pas trouvée, on renvoie une couleur grise
  }
}

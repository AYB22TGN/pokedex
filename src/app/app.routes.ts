import { Routes } from '@angular/router';
import { PokedexComponent } from './pages/pokedex/pokedex.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokedex', pathMatch: 'full' },
  { path: 'pokedex', component: PokedexComponent },
  { path: 'pokemon/:id', component: PokemonDetailComponent }
];

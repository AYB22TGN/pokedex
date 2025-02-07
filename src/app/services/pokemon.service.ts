import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) {}


  // J'ai limiter à 151 pokemons
  getPokemons(limit: number = 151): Observable<any> {
    return this.http.get(`${this.apiUrl}pokemon?limit=${limit}`);
  }


  getPokemonDetails(nameOrId: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}pokemon/${nameOrId}`);
  }
}

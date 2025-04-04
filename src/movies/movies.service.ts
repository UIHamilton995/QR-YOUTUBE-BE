// src/movies/movies.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MoviesService {
  private movies: any[] = [];

  async fetchMovies() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const response = await axios.get(
        'https://gist.githubusercontent.com/saniyusuf/406b843afdfb9c6a86e25753fe2761f4/raw/523c324c7fcc36efab8224f9ebb7556c09b69a14/Film.JSON',
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      this.movies = response.data; // Store fetched movies
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new Error('Failed to fetch movies');
    }
  }

  getRandomMovies(count: number): any[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const shuffled = [...this.movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count); // Return `count` random movies
  }
}

// src/movies/movies.module.ts
import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Module({
  providers: [MoviesService],
  exports: [MoviesService], // Export the service so it can be used in other modules
})
export class MoviesModule {}

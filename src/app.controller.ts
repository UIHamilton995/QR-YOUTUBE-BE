import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { MoviesService } from './movies/movies.service';
import { Movie } from './movies/movies.interface';

@Controller()
export class AppController {
  private currentLinkId: string;
  private moviesList: Movie[] = [];
  private readonly baseUrl: string;

  constructor(private readonly moviesService: MoviesService) {
    this.baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : '18.212.6.185';

    console.log('Initializing AppController...');
    void this.updateQRCode();
    setInterval(() => {
      console.log('Regenerating QR code...');
      void this.updateQRCode();
    }, 15000);
  }

  private async updateQRCode() {
    await this.moviesService.fetchMovies();
    this.currentLinkId = uuidv4();
    this.moviesList = this.moviesService.getRandomMovies(10);
    console.log(
      `Running on ${this.baseUrl}, Generated Link ID: ${this.currentLinkId}`,
    );
  }

  @Get('qr-code')
  async getQRCode(@Res() res: Response) {
    const qrData = `${this.baseUrl}/movies/${this.currentLinkId}`;
    console.log('QR Code Data:', qrData);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const qrCodeImage = await QRCode.toBuffer(qrData, {
        errorCorrectionLevel: 'H',
      });
      console.log('QR Code Successfully Encoded');
      res.set('Content-Type', 'image/png');
      res.send(qrCodeImage);
    } catch (error) {
      console.error('Error Generating QR Code:', error);
      res.status(500).send('Failed to generate QR code');
    }
  }

  @Get('movies/:id')
  getMovies(@Param('id') id: string, @Res() res: Response) {
    console.log('Request ID:', id);
    console.log('Current Link ID:', this.currentLinkId);

    if (id === this.currentLinkId && this.moviesList.length > 0) {
      const moviesHtml = this.moviesList
        .map(
          (movie) => `
          <div style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="margin: 0 0 10px;">${movie.Title} (${movie.Year})</h2>
            <div style="display: flex; gap: 20px;">
              <div>
                <img src="${movie.Poster}" alt="${movie.Title} Poster" style="width: 200px; height: auto; border-radius: 8px;" />
              </div>
              <div>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
                <p><strong>Awards:</strong> ${movie.Awards}</p>
                <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
                <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                <p><strong>Language:</strong> ${movie.Language}</p>
                <p><strong>Country:</strong> ${movie.Country}</p>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <h3>Additional Images</h3>
              <div style="display: flex; gap: 10px; overflow-x: auto;">
                ${
                  movie.Images
                    ? movie.Images.map(
                        (image) =>
                          `<img src="${image}" alt="Movie Image" style="width: 150px; height: auto; border-radius: 8px;" />`,
                      ).join('')
                    : '<p>No additional images available.</p>'
                }
              </div>
            </div>
          </div>
        `,
        )
        .join('');

      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hamilton NestJS Random Movies App</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              padding: 20px;
            }
            h1 {
              text-align: center;
              color: #333;
            }
          </style>
        </head>
        <body>
          <h1>Hamilton NestJS Random Movies App</h1>
          ${moviesHtml}
        </body>
        </html>
      `);
    } else {
      res.status(404).send('Link expired or invalid');
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  PostToTopScoreTable,
  Throw,
  TopScoreTable,
} from 'src/app/shared/bowling-game.interface';

@Injectable({
  providedIn: 'root',
})
export class BowlingGameService {
  apiUrl = 'http://localhost:3000/api/table';
  constructor(private http: HttpClient) {}

  getCurrentGameScore(): Observable<Throw[]> {
    return this.http.get<Throw[]>(this.apiUrl);
  }

  postFrameScoreGame(shot: Throw): Observable<Throw> {
    return this.http.post<Throw>(this.apiUrl, shot);
  }

  postTableScore(
    gameScore: PostToTopScoreTable,
  ): Observable<PostToTopScoreTable> {
    const data = JSON.stringify(gameScore);

    return this.http.post<PostToTopScoreTable>(`${this.apiUrl}/top`, { data });
  }

  getTopScores(): Observable<TopScoreTable[]> {
    return this.http.get<Array<any>>(`${this.apiUrl}/top`).pipe(
      map(topScores => {
        return topScores.map(score => {
          return JSON.parse(score.data) as TopScoreTable;
        });
      }),
    );
  }

  cleanTableGame(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}

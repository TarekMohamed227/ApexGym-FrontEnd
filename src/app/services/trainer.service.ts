import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { TrainerGetDto } from '../models/trainer.model';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  constructor(private http:HttpClient) { }
  private apiUrl = environment.apiUrl + '/trainers';
  tarinersSignal=signal<TrainerGetDto[]>([])
  isLoadingSignal=signal<boolean>(false)
  errorSignal=signal<string|null>(null)
  filteredtrainersSignal=signal<TrainerGetDto[]>([])
    loadTrainers(): void {
      this.isLoadingSignal.set(true);
      this.errorSignal.set(null);
      
      this.http.get<TrainerGetDto[]>(this.apiUrl).subscribe({
        next: (data) => {
          this.tarinersSignal.set(data);
          this.filteredtrainersSignal.set(data)
          this.isLoadingSignal.set(false);
          console.log('Trainers loaded successfully:', data.length);
        },
        error: (err) => {
          this.errorSignal.set('Failed to load Trainers. Please try again.');
          this.isLoadingSignal.set(false);
          console.error('Trainer loading error:', err);
        }
      });
    }


    addTrainer(trainer: TrainerGetDto): Observable<TrainerGetDto> {
        this.isLoadingSignal.set(true);
        this.errorSignal.set(null);
        
        return this.http.post<TrainerGetDto>(this.apiUrl, trainer).pipe(
          tap({
            next: (newTrainer) => {
              // Optimistic update
              this.tarinersSignal.update(trainers => [...trainers, newTrainer]);
              this.isLoadingSignal.set(false);
            },
            error: (err) => {
              this.errorSignal.set('Failed to add trainer. Please check the data and try again.');
              this.isLoadingSignal.set(false);
            }
          })
        );
      }
}

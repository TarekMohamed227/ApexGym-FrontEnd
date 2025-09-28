import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrainerService } from '../../services/trainer.service';
import { TrainerGetDto } from '../../models/trainer.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trainer',
  imports: [CommonModule, FormsModule],
  templateUrl: './trainer.component.html',
  styleUrl: './trainer.component.scss'
})
export class TrainerComponent  implements OnInit {
 public trainerService = inject(TrainerService);
  private subscriptions: Subscription = new Subscription();
 trainers = this.trainerService.tarinersSignal;
  filteredMembersSignal = this.trainerService.tarinersSignal;
  isLoading = this.trainerService.isLoadingSignal;
  error = this.trainerService.errorSignal;
    newTrainer: TrainerGetDto = this.initializeNewTrainer();
    showAddForm = signal(false);
  ngOnInit(): void {
     console.log('TrainersComponent initialized - loading trainers data');
    this.loadtrainers();
  }

    loadtrainers(): void {
    console.log('Loading members from API...');
    this.trainerService.loadTrainers();
  }

   private initializeNewTrainer(): TrainerGetDto {
      return {
        firstName: '',
        lastName: '',
        specialization: '',
        yearsOfExperience: 0,
        bio:''
      };
    }

      private isValidMember(): boolean {
    return !!this.newTrainer.firstName?.trim() &&
           !!this.newTrainer.lastName?.trim() &&
           !!this.newTrainer.specialization?.trim();
  }


   onAddTrainer(): void {
    if (!this.isValidMember()) {
      console.warn('Trainer validation failed - preventing submission');
      return;
    }

    console.log('Submitting new Trainer:', this.newTrainer);

    const addSub = this.trainerService.addTrainer(this.newTrainer).subscribe({
      next: (addedMember) => {
        console.log('Member added successfully:', addedMember);
        this.showAddForm.set(false);
        this.resetForm();
      },
      error: (err) => console.error('Member addition failed:', err)
    });

    this.subscriptions.add(addSub);
  }
    private resetForm(): void {
    console.log('Resetting member form');
    this.newTrainer = this.initializeNewTrainer();
  }

    toggleAddForm(): void {
    this.showAddForm.update(show => {
      const newState = !show;
      console.log(`Add form visibility: ${newState}`);
      if (!newState) this.resetForm();
      return newState;
    });
  }
}

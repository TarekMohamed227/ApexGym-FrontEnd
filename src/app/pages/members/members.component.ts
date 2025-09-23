// src/app/pages/members/members.component.ts - FINAL CORRECTED VERSION
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MemberService } from '../../services/member.service';
import { MemberCreateDto, MemberDto, MemberUpdateDto } from '../../models/member.model';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit, OnDestroy {
  public memberService = inject(MemberService);
  private subscriptions: Subscription = new Subscription();
  
  members = this.memberService.membersSignal;
  isLoading = this.memberService.isLoadingSignal;
  error = this.memberService.errorSignal;
  editingMember = this.memberService.editingMemberSignal;
  
  showAddForm = signal(false);
  newMember: MemberCreateDto = this.initializeNewMember();
  
  // Form model for editing
  editMemberForm: MemberUpdateDto = {};

  ngOnInit(): void {
    console.log('MembersComponent initialized - loading members data');
    this.loadMembers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  clearError(): void {
    this.memberService.errorSignal.set(null);
  }

  loadMembers(): void {
    console.log('Loading members from API...');
    this.memberService.loadMembers();
  }

  toggleAddForm(): void {
    this.showAddForm.update(show => {
      const newState = !show;
      console.log(`Add form visibility: ${newState}`);
      if (!newState) {
        this.resetForm();
      }
      return newState;
    });
  }

  onAddMember(): void {
    if (!this.isValidMember()) {
      console.warn('Member validation failed - preventing submission');
      return;
    }

    console.log('Submitting new member:', this.newMember);
    
    const addSub = this.memberService.addMember(this.newMember).subscribe({
      next: (addedMember) => {
        console.log('Member added successfully:', addedMember);
        this.showAddForm.set(false);
        this.resetForm();
      },
      error: (err) => {
        console.error('Member addition failed:', err);
      }
    });

    this.subscriptions.add(addSub);
  }

  onEditMember(member: MemberDto): void {
    console.log('Editing member:', member);
    
    // Populate the edit form with current member data
    this.editMemberForm = {
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      dateOfBirth: member.dateOfBirth,
      membershipPlanId: member.membershipPlanId
    };
    
    this.memberService.setEditingMember(member);
  }

  onUpdateMember(): void {
    const editingMember = this.editingMember();
    if (!editingMember) return;

    if (!this.isValidEditForm()) {
      console.warn('Edit form validation failed');
      return;
    }

    console.log('Updating member:', editingMember.id, 'with data:', this.editMemberForm);
    
    const updateSub = this.memberService.updateMember(editingMember.id, this.editMemberForm).subscribe({
      next: () => {
        console.log('Member updated successfully');
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Member update failed:', err);
      }
    });

    this.subscriptions.add(updateSub);
  }

  cancelEdit(): void {
    this.memberService.cancelEditing();
    this.editMemberForm = {};
  }

  onDeleteMember(memberId: number): void {
    const member = this.members().find(m => m.id === memberId);
    const memberName = member ? `${member.firstName} ${member.lastName}` : 'this member';
    
    const confirmation = confirm(`Are you sure you want to delete ${memberName}?`);
    
    if (!confirmation) {
      console.log('Member deletion cancelled by user');
      return;
    }

    console.log(`Deleting member ID: ${memberId}`);
    
    const deleteSub = this.memberService.deleteMember(memberId).subscribe({
      next: () => {
        console.log(`Member ${memberId} deleted successfully`);
      },
      error: (err) => {
        console.error(`Failed to delete member ${memberId}:`, err);
      }
    });

    this.subscriptions.add(deleteSub);
  }

  private isValidMember(): boolean {
    const isValid = !!this.newMember.firstName?.trim() && 
                   !!this.newMember.lastName?.trim() && 
                   !!this.newMember.email?.trim();
    
    return isValid;
  }

  private isValidEditForm(): boolean {
    const form = this.editMemberForm;
    const hasChanges = Object.keys(form).length > 0;
    
    if (!hasChanges) {
      alert('No changes detected!');
      return false;
    }
    
    return true;
  }

  private initializeNewMember(): MemberCreateDto {
    return {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: new Date(),
      membershipPlanId: 1
    };
  }

  private resetForm(): void {
    console.log('Resetting member form');
    this.newMember = this.initializeNewMember();
  }

  onRefresh(): void {
    console.log('Manual refresh triggered by user');
    this.loadMembers();
  }

  getMembershipPlanName(planId: number): string {
    const plans: { [key: number]: string } = {
      1: 'Basic ($49.99)',
      2: 'Premium ($99.99)', 
      3: 'VIP ($199.99)'
    };
    return plans[planId] || 'Unknown';
  }
  getMembershipBadgeClass(planId?: number): string {
  switch (planId) {
    case 1: return 'bg-primary';
    case 2: return 'bg-warning text-dark';
    case 3: return 'bg-danger';
    default: return 'bg-secondary';
  }
}
  // Helper method for statistics
getMembersByPlan(planId: number): number {
  return this.members().filter(member => member.membershipPlanId === planId).length;
}
// FIX: Helper method to check if form has changes
hasFormChanges(): boolean {
  return Object.keys(this.editMemberForm).length > 0;
}

// Helper method for date input value
getDateInputValue(date: Date | undefined): string {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}
}
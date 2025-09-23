// src/app/services/member.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { MemberDto, MemberCreateDto, MemberUpdateDto } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  // FIX: Add /api prefix to match your .NET API structure
  private apiUrl = environment.apiUrl + '/api/members';

  // Signals for state management
  membersSignal = signal<MemberDto[]>([]);
  isLoadingSignal = signal<boolean>(false);
  errorSignal = signal<string | null>(null);
  
  // Signal for currently editing member
  editingMemberSignal = signal<MemberDto | null>(null);

  constructor(private http: HttpClient) {}

  loadMembers(): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    
    this.http.get<MemberDto[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.membersSignal.set(data);
        this.isLoadingSignal.set(false);
        console.log('Members loaded successfully:', data.length);
      },
      error: (err) => {
        this.errorSignal.set('Failed to load members. Please try again.');
        this.isLoadingSignal.set(false);
        console.error('Member loading error:', err);
      }
    });
  }

  addMember(member: MemberCreateDto): Observable<MemberDto> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.post<MemberDto>(this.apiUrl, member).pipe(
      tap({
        next: (newMember) => {
          // Optimistic update
          this.membersSignal.update(members => [...members, newMember]);
          this.isLoadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set('Failed to add member. Please check the data and try again.');
          this.isLoadingSignal.set(false);
        }
      })
    );
  }

  // FIXED: Single updateMember method with proper typing
  updateMember(id: number, member: MemberUpdateDto): Observable<void> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    
    console.log('🔄 Updating member ID:', id, 'with data:', member);
    
    return this.http.put<void>(`${this.apiUrl}/${id}`, member).pipe(
      tap({
        next: () => {
          console.log('✅ Member updated successfully');
          // Update the local state
          this.membersSignal.update(members => 
            members.map(m => m.id === id ? { ...m, ...member } as MemberDto : m)
          );
          this.isLoadingSignal.set(false);
          this.editingMemberSignal.set(null); // Clear editing state
        },
        error: (err) => {
          console.error('❌ Member update failed:', err);
          this.errorSignal.set('Failed to update member. Please try again.');
          this.isLoadingSignal.set(false);
        }
      })
    );
  }

  deleteMember(id: number): Observable<void> {
    this.errorSignal.set(null);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.membersSignal.update(members => 
            members.filter(m => m.id !== id)
          );
        },
        error: (err) => {
          this.errorSignal.set('Failed to delete member.');
        }
      })
    );
  }

  getMember(id: number): Observable<MemberDto> {
    return this.http.get<MemberDto>(`${this.apiUrl}/${id}`);
  }

  // Set member for editing
  setEditingMember(member: MemberDto | null): void {
    this.editingMemberSignal.set(member);
  }

  // Cancel editing
  cancelEditing(): void {
    this.editingMemberSignal.set(null);
  }
}
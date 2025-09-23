export interface MemberDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: Date;
  registrationDate?: Date;
  membershipPlanId?: number;
}

export interface MemberCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  membershipPlanId: number;
}

export interface MemberUpdateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: Date;
  membershipPlanId?: number;
}
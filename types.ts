export interface Summary {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  currentMedications: string;
  impactOnDailyLife: string;
}

export type InputMode = 'text' | 'record' | 'upload';

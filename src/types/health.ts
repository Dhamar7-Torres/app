export interface HealthRecord {
  id: string;
  bovineId: string;
  date: string;
  condition: string;
  treatment: string;
  vetName?: string;
}

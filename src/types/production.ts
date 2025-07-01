export interface ProductionEntry {
  id: string;
  bovineId: string;
  type: "milk" | "meat" | "offspring";
  quantity: number;
  date: string;
}

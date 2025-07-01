export interface Bovine {
  id: string;
  name: string;
  type: string;
  birthDate: string;
  location: string;
  sex: "male" | "female";
  notes?: string;
}

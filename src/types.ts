export interface Publisher {
  id: string;
  nombre: string;
  grupo: number;
}

export interface MonthlyReport {
  publisherId: string;
  month: string;
  participo: boolean;
  cursos: number;
  precursorado: string;
  horas: number;
  notas: string;
}

export interface DB {
  publicadores: Publisher[];
  reports: MonthlyReport[];
}

export interface ChartPoint {
  label: string;
  value: number;
}

export function toChartPoints(values: Record<string, number>): ChartPoint[] {
  return Object.entries(values).map(([label, value]) => ({ label, value }));
}

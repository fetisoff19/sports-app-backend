export interface WorkoutMainInfo {
  id: number
  distance: number | null
  time: number | null
  elevation: number | null
  speed: number | null
  hr: number | null
  power: number | null
  cadence: number | null
  name: string | null
  sport: string | null
  note: string
  date: Date | null
  map: string | null
}

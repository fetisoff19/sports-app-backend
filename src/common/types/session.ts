export interface Session {
  start_time: Date;
  end_time: Date;

  time_step: number;
  smoothing: number;
  total_elapsed_time?: number;

  total_timer_time: number;
  total_distance: number;
  total_work?: number;
  total_strides?: number;

  enhanced_avg_speed?: number;
  enhanced_max_speed?: number;
  avg_speed?: number;
  max_speed?: number;

  avg_heart_rate?: number;
  max_heart_rate?: number;
  min_heart_rate?: number;

  cadence_coef?: 1 | 2;
  avg_cadence?: number;
  max_cadence?: number;
  avg_temperature?: number;
  max_temperature?: number;

  enhanced_max_altitude?: number;
  enhanced_min_altitude?: number;
  max_altitude?: number;
  avg_altitude?: number;
  min_altitude?: number;
  total_ascent?: number;
  total_descent?: number;

  avg_power?: number;
  max_power?: number;
  normalized_power?: number;
  left_right_balance?: number;
  avg_left_torque_effectiveness?: number;
  avg_right_torque_effectiveness?: number;
  avg_left_pedal_smoothness?: number;
  avg_right_pedal_smoothness?: number;

  total_calories?: number;
  training_stress_score?: number;
}

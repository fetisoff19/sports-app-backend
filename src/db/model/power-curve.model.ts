import { WorkoutModel } from '@/db/model';
import { IsInt, IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DefaultFields } from '@/db/model/_default';

@Entity({ name: 'power_curve' })
export class PowerCurveModel extends DefaultFields {

  @Column({ type: 'uuid', name: 'workout_uuid' })
  workoutUuid: string;

  @OneToOne(() => WorkoutModel,
    (model) => model.powerCurve,
    { cascade: ['remove'] }
  )
  @JoinColumn({ name: 'workout_uuid' })
  workout: WorkoutModel;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1', nullable: true })
  '1': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '2', nullable: true })
  '2': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '3', nullable: true })
  '3': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '4', nullable: true })
  '4': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '5', nullable: true })
  '5': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '6', nullable: true })
  '6': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '7', nullable: true })
  '7': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '8', nullable: true })
  '8': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '9', nullable: true })
  '9': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '10', nullable: true })
  '10': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '12', nullable: true })
  '12': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '14', nullable: true })
  '14': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '16', nullable: true })
  '16': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '18', nullable: true })
  '18': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '20', nullable: true })
  '20': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '22', nullable: true })
  '22': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '24', nullable: true })
  '24': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '26', nullable: true })
  '26': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '28', nullable: true })
  '28': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '30', nullable: true })
  '30': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '33', nullable: true })
  '33': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '36', nullable: true })
  '36': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '39', nullable: true })
  '39': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '42', nullable: true })
  '42': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '45', nullable: true })
  '45': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '48', nullable: true })
  '48': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '51', nullable: true })
  '51': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '54', nullable: true })
  '54': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '57', nullable: true })
  '57': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '60', nullable: true })
  '60': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '65', nullable: true })
  '65': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '70', nullable: true })
  '70': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '75', nullable: true })
  '75': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '80', nullable: true })
  '80': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '85', nullable: true })
  '85': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '90', nullable: true })
  '90': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '95', nullable: true })
  '95': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '100', nullable: true })
  '100': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '105', nullable: true })
  '105': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '110', nullable: true })
  '110': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '115', nullable: true })
  '115': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '120', nullable: true })
  '120': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '130', nullable: true })
  '130': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '140', nullable: true })
  '140': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '150', nullable: true })
  '150': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '160', nullable: true })
  '160': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '170', nullable: true })
  '170': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '180', nullable: true })
  '180': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '200', nullable: true })
  '200': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '220', nullable: true })
  '220': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '240', nullable: true })
  '240': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '260', nullable: true })
  '260': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '280', nullable: true })
  '280': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '300', nullable: true })
  '300': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '330', nullable: true })
  '330': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '360', nullable: true })
  '360': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '390', nullable: true })
  '390': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '420', nullable: true })
  '420': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '450', nullable: true })
  '450': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '480', nullable: true })
  '480': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '510', nullable: true })
  '510': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '540', nullable: true })
  '540': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '570', nullable: true })
  '570': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '600', nullable: true })
  '600': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '660', nullable: true })
  '660': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '720', nullable: true })
  '720': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '780', nullable: true })
  '780': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '840', nullable: true })
  '840': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '900', nullable: true })
  '900': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '960', nullable: true })
  '960': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1020', nullable: true })
  '1020': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1080', nullable: true })
  '1080': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1140', nullable: true })
  '1140': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1200', nullable: true })
  '1200': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1320', nullable: true })
  '1320': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1440', nullable: true })
  '1440': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1560', nullable: true })
  '1560': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1680', nullable: true })
  '1680': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1800', nullable: true })
  '1800': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '1920', nullable: true })
  '1920': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '2040', nullable: true })
  '2040': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '2160', nullable: true })
  '2160': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '2280', nullable: true })
  '2280': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '2400', nullable: true })
  '2400': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '2580', nullable: true })
  '2580': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '2760', nullable: true })
  '2760': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '2940', nullable: true })
  '2940': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '3120', nullable: true })
  '3120': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '3300', nullable: true })
  '3300': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '3480', nullable: true })
  '3480': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '3660', nullable: true })
  '3660': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '3840', nullable: true })
  '3840': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '4020', nullable: true })
  '4020': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '4200', nullable: true })
  '4200': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '4800', nullable: true })
  '4800': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '5600', nullable: true })
  '5600': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '6200', nullable: true })
  '6200': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '6600', nullable: true })
  '6600': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '7200', nullable: true })
  '7200': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '7800', nullable: true })
  '7800': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '8400', nullable: true })
  '8400': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '9000', nullable: true })
  '9000': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '9600', nullable: true })
  '9600': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '10200', nullable: true })
  '10200': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '10800', nullable: true })
  '10800': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '11700', nullable: true })
  '11700': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '12600', nullable: true })
  '12600': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '13500', nullable: true })
  '13500': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '14400', nullable: true })
  '14400': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '15300', nullable: true })
  '15300': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '16200', nullable: true })
  '16200': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '17100', nullable: true })
  '17100': number;

  @IsOptional()
  @IsInt()
  @Column({ type: 'int', name: '18000', nullable: true })
  '18000': number;
}

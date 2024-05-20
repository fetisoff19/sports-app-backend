import { ConvertValueHelper } from '@/common/helpers';
import { ChartPoint, WorkoutRecord, Session } from '@/common/types';
import { CustomError } from '@/custom-error';
import { ChartDataRepository } from '@/db/repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChartsDataService {
  constructor(private readonly chartPointRepository: ChartDataRepository) {}

  create(points: ChartPoint[], origLength: number, workoutUuid: string) {
    return this.chartPointRepository.create({
      points: JSON.stringify(points),
      arrayLength: points.length,
      origLength,
      workoutUuid,
    });
  }

  async findChartsDataByUuid(uuid: string) {
    return this.chartPointRepository.findByWorkoutUuid(uuid);
  }

  makeChartsData(
    records: WorkoutRecord[],
    session: Session,
  ): { chartPoints: ChartPoint[]; mutatedSession: Session } {
    try {
      const points: ChartPoint[] = [];
      const mutatedSession: Session = { ...session };
      const { smoothing, cadenceCoef } = session;

      let avgSpeedSmoothing = 0;
      let avgPowerSmoothing = 0;
      let avgHeartRateSmoothing = 0;
      let avgCadenceSmoothing = 0;
      let avgAltitudeSmoothing = 0;
      let timestamp = 0;
      const distance = 0;

      let maxSpeed = 0;
      let avgSpeed = 0;
      let avgPower = 0;
      let maxPower = 0;
      let minHeartRate = 250;
      let maxHeartRate = 0;
      let avgCadence = 0;
      let maxCadence = 0;
      let minAltitude = 10000;
      let avgAltitude = 0;
      let maxAltitude = -500;

      records.forEach((record, index) => {
        // if(!record.hasOwnProperty('distance') ||)
        const distance =
          ConvertValueHelper.convertDistance(record?.distance) || 0; // км
        let speed = ConvertValueHelper.convertSpeed(
          record?.enhancedSpeed || record?.speed,
          cadenceCoef,
        );
        // cadenceCoef > 1 && record?.enhancedSpeed
        //   ? this.convertSpeed(record.enhancedSpeed)
        //   : +(record?.speed * 3.6).toFixed(1)
        let power = record?.power; // Вт
        let heartRate = record?.heartRate;
        let cadence = record?.cadence * cadenceCoef;
        let altitude = Math.round(record?.enhancedAltitude || record?.altitude); // м

        if (altitude) {
          minAltitude = Math.min(minAltitude, altitude);
          maxAltitude = Math.max(maxAltitude, altitude);
        }

        if (heartRate) {
          minHeartRate = Math.min(minHeartRate, heartRate);
        }

        if (isNaN(speed)) speed = 0;
        if (isNaN(power)) power = 0;
        if (isNaN(heartRate)) heartRate = 0;
        if (isNaN(cadence)) cadence = 0;
        if (isNaN(altitude)) altitude = 0;
        // if (cadenceCoef === 2 && speed < 1.5)
        //   speed = this.convertSpeed(mutatedSession?.enhancedAvgSpeed)
        if (index > 0) {
          const stepTime =
            (record.timestamp.getTime() -
              records[index - 1].timestamp.getTime()) /
            1000; // получаем время в секундах между соседними элементами массива
          timestamp += stepTime;
        }
        avgAltitude += altitude;
        avgCadence += cadence;
        avgSpeed += speed;
        avgPower += power;

        if (smoothing === 1) {
          points.push({
            distance,
            speed,
            heartRate,
            power,
            cadence,
            altitude,
            timestamp,
          });
        } else {
          if (index === 0) {
            points.push({
              distance,
              speed,
              heartRate,
              power,
              cadence,
              altitude,
              timestamp,
            });
          }

          avgSpeedSmoothing += speed;
          maxSpeed = Math.max(maxSpeed, speed);

          avgPowerSmoothing += power;
          maxPower = Math.max(maxPower, power);

          avgHeartRateSmoothing += heartRate;
          minHeartRate = Math.min(minHeartRate, heartRate);
          maxHeartRate = Math.max(maxHeartRate, heartRate);
          minHeartRate = Math.min(minHeartRate, heartRate);

          avgCadenceSmoothing += cadence;
          maxCadence = Math.max(maxCadence, cadence);

          avgAltitudeSmoothing += altitude;

          if (!(index % smoothing) && index > 0) {
            points.push({
              distance,
              speed: Number((avgSpeedSmoothing / smoothing).toFixed(1)),
              heartRate: Math.round(avgHeartRateSmoothing / smoothing),
              power: Math.round(avgPowerSmoothing / smoothing),
              cadence: Math.round(avgCadenceSmoothing / smoothing),
              altitude: Math.round(avgAltitudeSmoothing / smoothing),
              timestamp,
            });

            avgSpeedSmoothing = 0;
            avgPowerSmoothing = 0;
            avgHeartRateSmoothing = 0;
            avgCadenceSmoothing = 0;
            avgAltitudeSmoothing = 0;
          }
        }
      });
      // мутируем session, корректируя показатели:
      if (!mutatedSession.enhancedAvgSpeed && avgSpeed > 0)
        mutatedSession.enhancedAvgSpeed = Math.round(avgSpeed / records.length);
      if (!mutatedSession.enhancedMaxSpeed && maxSpeed > 0)
        mutatedSession.enhancedMaxSpeed = maxSpeed;
      if (!mutatedSession.totalDistance && records.at(-1)?.distance > 0)
        mutatedSession.totalDistance = records.at(-1).distance;
      if (!mutatedSession.avgPower && avgPower > 0)
        mutatedSession.avgPower = Math.round(avgPower / records.length);
      if (!mutatedSession.maxPower && maxPower > 0)
        mutatedSession.maxPower = maxPower;
      if (!mutatedSession.minHeartRate && minHeartRate < 250)
        mutatedSession.minHeartRate = minHeartRate;
      if (!mutatedSession.maxHeartRate && maxHeartRate > 0)
        mutatedSession.maxHeartRate = maxHeartRate;
      if (!mutatedSession.avgCadence && avgCadence > 0)
        mutatedSession.avgCadence = Math.round(avgCadence / records.length);
      if (!mutatedSession.maxCadence && maxCadence > 0)
        mutatedSession.maxCadence = maxCadence * cadenceCoef;
      if (!mutatedSession.avgAltitude && avgAltitude)
        mutatedSession.avgAltitude = Math.round(avgAltitude / records.length);
      if (!mutatedSession.minAltitude && minAltitude !== 10000)
        mutatedSession.minAltitude = minAltitude;
      if (!mutatedSession.maxAltitude && maxAltitude !== -500)
        mutatedSession.maxAltitude = maxAltitude;
      return { chartPoints: points, mutatedSession };
    } catch (e) {
      throw new CustomError(500, 'Error while creating charts');
    }
  }
}

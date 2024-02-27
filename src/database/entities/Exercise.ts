import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workout } from "./Workout";
import { Equipment } from "./Equipment";

Entity()
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date

  @Column({length: 20})
  type: string

  @Column({length: 255})
  notes: string

  @ManyToOne(() => Workout, workout => workout.exercise)
  @JoinColumn({name: 'workout_id'})
  workout: Workout

  @ManyToMany(() => Equipment, equipment => equipment.exercises)
  @JoinTable()
  equipment: Equipment[];
}
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workout } from "./Workout";
import { Equipment } from "./Equipment";

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  workout_id:string

  @Column({type:"date"})
  date: Date

  @Column({length: 20, type:"varchar"})
  type: string

  @Column({length: 255, type:"varchar", nullable:true})
  notes: string

  @ManyToOne(() => Workout, workout => workout.exercise)
  @JoinColumn({name: 'workout_id', referencedColumnName:'id'})
  workout: Workout

  @ManyToMany(() => Equipment, equipment => equipment.exercises)
  @JoinTable()
  equipment: Equipment[];
}
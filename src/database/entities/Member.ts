import { UUID } from "crypto";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Workout } from "./Workout";
import { Measurement } from "./Measurement";
import { Meal } from "./Meal";
@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({length: 30})
  first_name:string

  @Column({length: 30})
  last_name:string
  
  @Column({length: 50})
  email:string
  
  @Column()
  join_date: Date

  @OneToMany(() => Workout, workout => workout.member)
  workouts: Workout[]

  @OneToMany(() => Measurement, measurement => measurement.member)
  measurements: Measurement[]

  @OneToMany(() => Meal, meal => meal.member)
  meals: Meal[]
}
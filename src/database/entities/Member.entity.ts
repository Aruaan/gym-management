import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Workout } from "./Workout.entity";
import { Measurement } from "./Measurement.entity";
import { Meal } from "./Meal.entity";
@Entity({name:'members'})
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({length: 30, type:"varchar", name:'first_name'})
  firstName: string

  @Column({length: 30, type:"varchar", name:'last_name'})
  lastName:string
  
  @Column({length: 50, type:"varchar"})
  email:string
  
  @Column({type:"date", name:'join_date'})
  joinDate: Date

  @OneToMany(() => Workout, (workout) => workout.member)
  workouts: Workout[]

  @OneToMany(() => Measurement, (measurement) => measurement.member)
  measurements: Measurement[]

  @OneToMany(() => Meal, (meal) => meal.member)
  meals: Meal[]
}
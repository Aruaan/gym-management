import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exercise } from "./Exercise";

Entity()
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id:string

  @Column({length: 30})
  name: string

  @Column ({length: 30})
  type:string

  @Column ()
  purchase_date: Date

  @Column ({length: 255})
  notes: string

  @ManyToMany(() => Exercise, exercise => exercise.equipment)
  exercises: Exercise[]
}
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exercise } from "./Exercise.entity";

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id:string

  @Column({length: 30, type:"varchar"})
  name: string

  @Column ({length: 30, type:"varchar"})
  type:string

  @Column ({type:"date", nullable:true, name: 'purchase_date'})
  purchaseDate: Date

  @Column ({length: 255, type:"varchar", nullable:true})
  notes: string | null

  @ManyToMany(() => Exercise, exercise => exercise.equipment)
  exercises: Exercise[]
}
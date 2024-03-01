import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";
import { Exercise } from "./Exercise";

@Entity()
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type:'date'})
  date: Date

  @Column ({type:'uuid'})
  member_id: string

  @Column({type:'varchar', length: 30, nullable:true})
  type: string

  @Column({type:'varchar', length: 255, nullable:true})
  notes: string

  @ManyToOne(() => Member, member => member.workouts)
  @JoinColumn({name:'member_id', referencedColumnName: 'id'})
  member: Member

  @OneToMany(() => Exercise, exercise => exercise.workout)
  exercise: Exercise[]

}
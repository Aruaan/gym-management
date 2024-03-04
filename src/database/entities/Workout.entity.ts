import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member.entity";
import { Exercise } from "./Exercise.entity";

@Entity({name:'workouts'})
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type:'date'})
  date: Date

  @Column ({type:'uuid', name:'member_id'})
  memberId: string

  @Column({type:'varchar', length: 30, nullable:true})
  type: string | null

  @Column({type:'varchar', length: 255, nullable:true})
  notes: string | null

  @ManyToOne(() => Member, member => member.workouts)
  @JoinColumn({name:'member_id', referencedColumnName: 'id'})
  member: Member

  @OneToMany(() => Exercise, exercise => exercise.workout)
  exercise: Exercise[]

}
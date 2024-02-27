import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";
import { Exercise } from "./Exercise";

@Entity()
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  date: Date

  @Column()
  type: string

  @Column()
  notes: string

  @ManyToOne(() => Member, member => member.workouts)
  @JoinColumn({name:'member_id'})
  member: Member

  @OneToMany(() => Exercise, exercise => exercise.workout)
  exercise: Exercise[]

}
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Member } from './Member.entity'
import { Exercise } from './Exercise.entity'
import { WorkoutType } from '../enums/Workout.enum'

@Entity({ name: 'workouts' })
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @Column({ type: 'uuid', name: 'member_id' })
  memberId: string

  @Column({ type: 'enum', enum: WorkoutType, nullable: true })
  type: WorkoutType | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes: string | null

  @ManyToOne(() => Member, (member) => member.workouts)
  @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
  member?: Member

  @OneToMany(() => Exercise, (exercise) => exercise.workout)
  exercises?: Exercise[]
}

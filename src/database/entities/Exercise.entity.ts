import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Workout } from './Workout.entity'
import { Equipment } from './Equipment.entity'
import { ExerciseType } from '../enums/Exercise.enum'

@Entity({ name: 'exercises' })
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid', { name: 'workout_id' })
  workoutId: string

  @Column({ length: 40, type: 'varchar' })
  name: string

  @Column({ type: 'int' })
  setCount: number

  @Column({ type: 'int' })
  repCount: number

  @Column({ type: 'float' })
  weight: number

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @Column({ type: 'enum', enum: ExerciseType, nullable: true })
  type: ExerciseType | null

  @Column({ length: 255, type: 'varchar', nullable: true })
  notes: string | null

  @ManyToOne(() => Workout, (workout) => workout.exercises)
  @JoinColumn({ name: 'workout_id', referencedColumnName: 'id' })
  workout?: Workout

  @ManyToMany(() => Equipment, (equipment) => equipment.exercises)
  @JoinTable({
    name: 'exercise_equipment',
    joinColumn: {
      name: 'exercise_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'equipment_id',
      referencedColumnName: 'id',
    },
  })
  equipment?: Equipment[]
}

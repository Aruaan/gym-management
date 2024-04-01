import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Workout } from './Workout.entity'
import { Measurement } from './Measurement.entity'
import { Meal } from './Meal.entity'
import * as bcrypt from 'bcrypt'
@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 30, type: 'varchar', name: 'first_name' })
  firstName: string

  @Column({ length: 30, type: 'varchar', name: 'last_name' })
  lastName: string

  @Column({ length: 100, type: 'varchar' })
  @Index({ unique: true })
  email: string

  @Column({ length: 500, type: 'varchar' })
  password: string

  @CreateDateColumn({ type: 'timestamp', name: 'join_date' })
  joinDate: Date

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
  }

  @OneToMany(() => Workout, (workout) => workout.member)
  workouts?: Workout[]

  @OneToMany(() => Measurement, (measurement) => measurement.member)
  measurements?: Measurement[]

  @OneToMany(() => Meal, (meal) => meal.member)
  meals?: Meal[]
}

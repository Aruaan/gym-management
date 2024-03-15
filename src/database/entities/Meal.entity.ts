import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Member } from './Member.entity'

@Entity({ name: 'meals' })
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'member_id' })
  memberId: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @Column({ length: 40, type: 'varchar' })
  name: string

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  calories: number

  @Column({ length: 255, type: 'varchar', nullable: true })
  notes: string | null

  @ManyToOne(() => Member, (member) => member.meals)
  @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
  member: Member
}

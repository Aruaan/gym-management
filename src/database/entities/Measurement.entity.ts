import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Member } from './Member.entity'

@Entity({ name: 'measurements' })
export class Measurement {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'member_id' })
  memberId: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'bodyfat_percentage',
  })
  bodyFatPercentage: number | null

  @ManyToOne(() => Member, (member) => member.measurements)
  @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
  member?: Member
}

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exercise } from './Exercise.entity'
import { EquipmentType } from '../enums/Equipment.enum'

@Entity()
export class Equipment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 30, type: 'varchar' })
  name: string

  @Column({ type: 'enum', enum: EquipmentType })
  type: EquipmentType

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'purchase_date',
  })
  purchaseDate: Date | null

  @Column({ length: 255, type: 'varchar', nullable: true })
  notes: string | null

  @ManyToMany(() => Exercise, (exercise) => exercise.equipment)
  @JoinTable({
    name: 'exercise_equipment',
    joinColumn: {
      name: 'equipment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'exercise_id',
      referencedColumnName: 'id',
    },
  })
  exercises?: Exercise[]
}

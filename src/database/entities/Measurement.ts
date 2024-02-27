import { Column, Decimal128, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";

Entity()
export class Measurement {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  date: Date

  @Column()
  weight: Decimal128
  
  @Column()
  bodyfat_percentage: Decimal128

  @ManyToOne (() => Member, member => member.measurements)
  @JoinColumn({name:'member_id'})
  member: Member
}
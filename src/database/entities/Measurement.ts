import { Column, Decimal128, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn('uuid')
  id: string
  
  @Column ({type:'uuid'})
  member_id: string

  @Column({type:'date'})
  date: Date

  @Column({type:'decimal', precision: 5, scale: 2})
  weight: number
  
  @Column({type:'decimal', precision: 5, scale: 2, nullable:true})
  bodyfat_percentage: number

  @ManyToOne (() => Member, (member) => member.measurements)
  @JoinColumn({name:'member_id', referencedColumnName: 'id'})
  member: Member
}
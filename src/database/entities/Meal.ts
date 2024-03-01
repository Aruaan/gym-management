import { Column, Decimal128, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Member } from "./Member";

@Entity()
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column ({type:'uuid'})
  member_id: string

  @Column({type: 'datetime'})
  created_at: Date

  @Column({length: 40, type:"varchar"})
  name: string

  @Column({type:'decimal', precision: 5, scale: 2})
  calories: number

  @Column({length:255, type:"varchar", nullable:true})
  notes:string

  @ManyToOne(() => Member, member => member.meals)
  @JoinColumn({name:'member_id', referencedColumnName: 'id'})
  member = Member

}
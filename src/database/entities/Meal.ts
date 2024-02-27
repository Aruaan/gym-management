import { Column, Decimal128, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Member } from "./Member";

Entity()
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: 'timestamp'})
  created_at: Date

  @Column({length: 40})
  name: string

  @Column()
  calories: Decimal128

  @Column({length:255})
  notes:string

  @ManyToOne(() => Member, member => member.meals)
  @JoinColumn({name:'member_id'})
  member = Member

}
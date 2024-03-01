import {getConnectionManager, Connection, getRepository} from 'typeorm'
import { Member } from '../entities/Member'
import { faker } from '@faker-js/faker'

async function seedMembers (connection: Connection){ 
  const memberRepository = connection.getRepository(Member)

  for (let i = 0; i < 20; i++){
    const member = new Member()
    member.first_name = faker.person.firstName()
    member.last_name = faker.person.lastName()
    member.email = faker.internet.email()
    member.join_date = faker.date.anytime()

    await memberRepository.save(member)
    }

    console.log('Member seeding completed')
}
export default seedMembers
import { Connection } from 'typeorm'
import { Member } from '../entities/Member.entity'
import { faker } from '@faker-js/faker'

async function seedMembers(connection: Connection) {
  const memberRepository = connection.getRepository(Member)

  for (let i = 0; i < 20; i++) {
    const member = new Member()
    member.firstName = faker.person.firstName()
    member.lastName = faker.person.lastName()
    member.email = faker.internet.email()
    member.joinDate = faker.date.anytime()

    await memberRepository.save(member)
  }

  console.log('Member seeding completed')
}
export default seedMembers

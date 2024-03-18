import { Connection } from 'typeorm'
import { faker } from '@faker-js/faker'
import { Member } from '../entities/Member.entity'
import { Measurement } from '../entities/Measurement.entity'

async function seedMeasurements(connection: Connection) {
  const memberRepository = connection.getRepository(Member)
  const measurementRepository = connection.getRepository(Measurement)

  const allMembers = await memberRepository.find()
  const memberIds = allMembers.map((member) => member.id)

  for (let i = 0; i < 20; i++) {
    const measurement = new Measurement()
    measurement.memberId = faker.helpers.arrayElement(Object.values(memberIds))
    measurement.weight = faker.number.float()
    measurement.bodyFatPercentage = faker.number.float(10)

    await measurementRepository.save(measurement)
  }

  console.log('Measurement seeding completed')
}
export default seedMeasurements

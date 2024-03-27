import { Connection } from 'typeorm'
import { Workout } from '../entities/Workout.entity'
import { faker } from '@faker-js/faker'
import { WorkoutType } from '../../modules/enums/Workout.enum'
import { Member } from '../entities/Member.entity'

async function seedMembers(connection: Connection) {
  const memberRepository = connection.getRepository(Member)
  const workoutRepository = connection.getRepository(Workout)

  const allMembers = await memberRepository.find()
  const memberIds = allMembers.map((member) => member.id)

  for (let i = 0; i < 20; i++) {
    const workout = new Workout()
    workout.memberId = faker.helpers.arrayElement(Object.values(memberIds))
    workout.type = faker.helpers.arrayElement(Object.values(WorkoutType))
    workout.notes = faker.lorem.sentence()

    await workoutRepository.save(workout)
  }

  console.log('Workout seeding completed')
}
export default seedMembers

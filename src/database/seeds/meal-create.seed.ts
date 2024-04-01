import { Connection } from 'typeorm'
import { Meal } from '../entities/Meal.entity'
import { faker } from '@faker-js/faker'
import { Member } from '../entities/Member.entity'

async function seedMeals(connection: Connection) {
  const memberRepository = connection.getRepository(Member)
  const mealRepository = connection.getRepository(Meal)

  const allMembers = await memberRepository.find()
  const memberIds = allMembers.map((member) => member.id)

  for (let i = 0; i < 20; i++) {
    const meal = new Meal()
    meal.memberId = faker.helpers.arrayElement(Object.values(memberIds))
    meal.name = faker.helpers.arrayElement([
      'Chicken and Rice',
      'Beef and potatoes',
      'Pizza',
      'Salmon',
    ])
    meal.calories = faker.number.float()
    meal.notes = faker.lorem.sentence()

    await mealRepository.save(meal)
  }

  console.log('Meal seeding completed')
}
export default seedMeals

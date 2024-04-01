import { Connection } from 'typeorm'
import { faker } from '@faker-js/faker'
import { Exercise } from '../entities/Exercise.entity'
import { Workout } from '../entities/Workout.entity'
import { ExerciseType } from '../enums/Exercise.enum'

async function seedExercises(connection: Connection) {
  const exerciseRepository = connection.getRepository(Exercise)
  const workoutRepository = connection.getRepository(Workout)
  const allWorkouts = await workoutRepository.find()
  const workoutIds = allWorkouts.map((workout) => workout.id)

  for (let i = 0; i < 20; i++) {
    const exercise = new Exercise()
    exercise.workoutId = faker.helpers.arrayElement(Object.values(workoutIds))
    exercise.name = faker.helpers.arrayElement(['Bench', 'Deadlift', 'Squat', 'Lat Pulldown'])
    exercise.setCount = faker.number.int(10)
    exercise.repCount = faker.number.int(10)
    exercise.weight = faker.number.float()
    exercise.type = faker.helpers.arrayElement(Object.values(ExerciseType))
    exercise.notes = faker.lorem.sentence()

    await exerciseRepository.save(exercise)
  }

  console.log('Exercise seeding completed')
}
export default seedExercises

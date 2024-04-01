import { Connection } from 'typeorm'
import { faker } from '@faker-js/faker'
import { EquipmentType } from '../enums/Equipment.enum'
import { Equipment } from '../entities/Equipment.entity'

async function seedEquipment(connection: Connection) {
  const equipmentRepository = connection.getRepository(Equipment)

  for (let i = 0; i < 20; i++) {
    const equipment = new Equipment()
    equipment.name = faker.helpers.arrayElement(
      Object.values(['Olympic Barbell', 'Women Olympic Barbell', 'Cable Machine'])
    )
    equipment.type = faker.helpers.arrayElement(Object.values(EquipmentType))
    equipment.notes = faker.lorem.sentence()

    await equipmentRepository.save(equipment)
  }

  console.log('Equipment seeding completed')
}
export default seedEquipment

import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
export class MemberCreateSeed implements Seeder{
  public async run (factory: Factory, connection: Connection): Promise<void> {
    console.log("123456")
  }
}
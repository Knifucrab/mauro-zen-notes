import "reflect-metadata";
import { DataSource } from "typeorm";
import { Note } from "./entity/Note";
import { Tag } from "./entity/Tag";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "notes.sqlite",
  synchronize: true,
  logging: false,
  entities: [Note, Tag, User],
  migrations: [],
  subscribers: [],
});

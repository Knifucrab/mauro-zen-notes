import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Note } from "./Note";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 20 })
  name!: string;

  @Column()
  color!: string;

  @ManyToMany(() => Note, note => note.tags)
  notes!: Note[];
}

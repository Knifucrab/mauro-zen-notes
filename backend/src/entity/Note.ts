import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Tag } from "./Tag";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  creationDate!: string;

  @Column({ default: false })
  archived!: boolean;

  @ManyToMany(() => Tag, tag => tag.notes)
  @JoinTable()
  tags!: Tag[];
}

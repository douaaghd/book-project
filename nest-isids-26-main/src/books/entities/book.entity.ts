import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TimeStampISIDS } from "../shared/timestamp";
import { AuthorEntity } from "./author.entity";
import { UserEntity } from "src/auth/entities/user.entity";


@Entity('livre')
export class BookEntity extends TimeStampISIDS {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    title: string;

    @Column()
    year: number;

    @Column({ type: "varchar" })
    editor: string;

    @Column()
    image: string;

    @Column()
    authorId: number;

    @ManyToOne(() => AuthorEntity, (author) => author.id)
    author: AuthorEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user: UserEntity;
}
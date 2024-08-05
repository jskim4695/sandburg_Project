import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'announce'
})
export class Announce {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'int', nullable: false })
  user_id: number;

  @Column( {type: 'varchar', nullable: false})
  title_a: string;

  @Column( {type: 'varchar', nullable: false})
  contents_a: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.announce, {
    onDelete: 'CASCADE',
  })
  @JoinColumn() 
  user: User;
}
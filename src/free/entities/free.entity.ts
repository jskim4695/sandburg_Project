import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'free'
})
export class Free {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'int', nullable: false })
  user_id: number;

  @Column( {type: 'varchar', nullable: false})
  title: string;

  @Column( {type: 'varchar', nullable: false})
  contents: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.free, {
    onDelete: 'CASCADE',
  })
  @JoinColumn() 
  user: User;
}
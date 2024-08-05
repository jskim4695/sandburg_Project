import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'manage'
})
export class Manage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'int', nullable: false })
  user_id: number;

  @Column( {type: 'varchar', nullable: false})
  title_m: string;

  @Column( {type: 'varchar', nullable: false})
  contents_m: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.manage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn() 
  user: User;
}
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'free'})
export class Free {
  @PrimaryColumn()
  id: number;

  @Column( {type: 'varchar', nullable: false})
  title: string;

  @Column( {type: 'varchar', nullable: false})
  contents: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.free)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column('int', {name: 'user_id', nullable: false})
  user_id: number;
}
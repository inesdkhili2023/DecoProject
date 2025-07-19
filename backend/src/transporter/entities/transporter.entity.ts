import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Transporter')
export class Transporter {
  @PrimaryGeneratedColumn('increment', { 
    type: 'int',
    name: 'idTransporter' })
  idTransporter: number;

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
    name: 'nameCompany',
  })
  nameCompany: string;

  @Column({
    type: 'text',
    array: true, 
    nullable: true,
    name: 'phones',
  })
  phones: string[]; 

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
    name: 'taxCode',
  })
  taxCode: string;

  @Column({
    type: 'date', 
    nullable: true,
    name: 'dealdate',
  })
  dealdate: Date;

  @Column({
    type: 'text',
    nullable: true,
    name: 'areaOperation',
  })
  areaOperation: string;
}

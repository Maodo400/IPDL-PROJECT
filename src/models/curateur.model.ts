import {Entity, hasOne, model, property, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {DossierSoutenance} from './dossier-soutenance.model';

@model()
export class Curateur extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @hasOne(() => User)
  user: User;

  @hasMany(() => DossierSoutenance)
  dossierSoutenances: DossierSoutenance[];

  constructor(data?: Partial<Curateur>) {
    super(data);
  }
}

export interface CurateurRelations {
  // describe navigational properties here
}

export type CurateurWithRelations = Curateur & CurateurRelations;

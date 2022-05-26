import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {DossierSoutenance} from './dossier-soutenance.model';

@model()
export class Rapporteur extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @hasOne(() => User)
  user: User;

  @hasMany(() => DossierSoutenance)
  dossierSoutenances: DossierSoutenance[];

  constructor(data?: Partial<Rapporteur>) {
    super(data);
  }
}

export interface RapporteurRelations {
  // describe navigational properties here
}

export type RapporteurWithRelations = Rapporteur & RapporteurRelations;

import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {DossierSoutenance} from './dossier-soutenance.model';

@model()
export class Recteur extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @hasOne(() => User)
  user: User;

  @hasMany(() => DossierSoutenance)
  dossierSoutenances: DossierSoutenance[];

  constructor(data?: Partial<Recteur>) {
    super(data);
  }
}

export interface RecteurRelations {
  // describe navigational properties here
}

export type RecteurWithRelations = Recteur & RecteurRelations;

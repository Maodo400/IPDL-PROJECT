import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {DossierAdmission} from './dossier-admission.model';

@model()
export class DirecteurDeThese extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @hasOne(() => User)
  user: User;

  @hasMany(() => DossierAdmission)
  dossierAdmissions: DossierAdmission[];

  constructor(data?: Partial<DirecteurDeThese>) {
    super(data);
  }
}

export interface DirecteurDeTheseRelations {
  // describe navigational properties here
}

export type DirecteurDeTheseWithRelations = DirecteurDeThese & DirecteurDeTheseRelations;

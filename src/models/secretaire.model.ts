import {Entity, model, property, hasOne} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Secretaire extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @hasOne(() => User)
  user: User;

  @property({
    type: 'string',
  })
  ecoleDoctoraleId?: string;

  constructor(data?: Partial<Secretaire>) {
    super(data);
  }
}

export interface SecretaireRelations {
  // describe navigational properties here
}

export type SecretaireWithRelations = Secretaire & SecretaireRelations;

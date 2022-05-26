import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {DossierSoutenance} from './dossier-soutenance.model';
import {DossierAdmission} from './dossier-admission.model';

@model()
export class ResponsableEdmi extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @hasOne(() => User)
  user: User;

  @hasMany(() => DossierSoutenance)
  dossierSoutenances: DossierSoutenance[];

  @hasMany(() => DossierAdmission)
  dossierAdmissions: DossierAdmission[];

  constructor(data?: Partial<ResponsableEdmi>) {
    super(data);
  }
}

export interface ResponsableEdmiRelations {
  // describe navigational properties here
}

export type ResponsableEdmiWithRelations = ResponsableEdmi & ResponsableEdmiRelations;

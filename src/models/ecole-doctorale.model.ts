import {Entity, model, property, hasMany} from '@loopback/repository';
import {DossierInscription} from './dossier-inscription.model';
import {DossierAdmission} from './dossier-admission.model';
import {Secretaire} from './secretaire.model';

@model()
export class EcoleDoctorale extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  nom?: string;

  @property({
    type: 'string',
  })
  adresse?: string;

  @hasMany(() => DossierInscription)
  dossierInscriptions: DossierInscription[];

  @hasMany(() => DossierAdmission)
  dossierAdmissions: DossierAdmission[];

  @hasMany(() => Secretaire)
  secretaires: Secretaire[];

  constructor(data?: Partial<EcoleDoctorale>) {
    super(data);
  }
}

export interface EcoleDoctoraleRelations {
  // describe navigational properties here
}

export type EcoleDoctoraleWithRelations = EcoleDoctorale & EcoleDoctoraleRelations;

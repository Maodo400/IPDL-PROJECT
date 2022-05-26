import {Entity, model, property} from '@loopback/repository';

@model()
export class DossierInscription extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'date',
  })
  date?: string;

  @property({
    type: 'string',
  })
  doctorantId?: string;

  @property({
    type: 'string',
  })
  ecoleDoctoraleId?: string;

  constructor(data?: Partial<DossierInscription>) {
    super(data);
  }
}

export interface DossierInscriptionRelations {
  // describe navigational properties here
}

export type DossierInscriptionWithRelations = DossierInscription & DossierInscriptionRelations;

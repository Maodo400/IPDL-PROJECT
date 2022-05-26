import {Entity, model, property, hasMany} from '@loopback/repository';
import {Doctorant} from './doctorant.model';

@model()
export class DossierAdmission extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  SearchProject?: string;

  @property({
    type: 'string',
  })
  directeurEdmiId?: string;

  @hasMany(() => Doctorant)
  doctorants: Doctorant[];

  @property({
    type: 'string',
  })
  directeurDeTheseId?: string;

  @property({
    type: 'string',
  })
  ecoleDoctoraleId?: string;

  @property({
    type: 'string',
  })
  responsableEdmiId?: string;

  @property({
    type: 'string',
  })
  directeurLaboratoireId?: string;

  constructor(data?: Partial<DossierAdmission>) {
    super(data);
  }
}

export interface DossierAdmissionRelations {
  // describe navigational properties here
}

export type DossierAdmissionWithRelations = DossierAdmission & DossierAdmissionRelations;

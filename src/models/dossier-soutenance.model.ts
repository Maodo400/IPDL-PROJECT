import {Entity, model, property} from '@loopback/repository';

@model()
export class DossierSoutenance extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
  })
  step?: string;

  @property({
    type: 'date',
  })
  date?: string;

  @property({
    type: 'string',
  })
  rapporteurId?: string;

  @property({
    type: 'string',
  })
  curateurId?: string;

  @property({
    type: 'string',
  })
  directeurLaboratoireId?: string;

  @property({
    type: 'string',
  })
  responsableEdmiId?: string;

  @property({
    type: 'string',
  })
  recteurId?: string;

  @property({
    type: 'string',
  })
  directeurEdmiId?: string;

  @property({
    type: 'string',
  })
  secretaireScientifiqueId?: string;

  @property({
    type: 'string',
  })
  doctorantId?: string;

  constructor(data?: Partial<DossierSoutenance>) {
    super(data);
  }
}

export interface DossierSoutenanceRelations {
  // describe navigational properties here
}

export type DossierSoutenanceWithRelations = DossierSoutenance & DossierSoutenanceRelations;

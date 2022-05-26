import {Entity, model, property, hasOne} from '@loopback/repository';
import {User} from './user.model';
import {DossierSoutenance} from './dossier-soutenance.model';
import {DossierInscription} from './dossier-inscription.model';

@model()
export class Doctorant extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'date',
  })
  birthday?: string;

  @property({
    type: 'string',
  })
  lieuDeNaissance?: string;

  @hasOne(() => User)
  user: User;

  @hasOne(() => DossierSoutenance)
  dossierSoutenance: DossierSoutenance;

  @hasOne(() => DossierInscription)
  dossierInscription: DossierInscription;

  @property({
    type: 'string',
  })
  dossierAdmissionId?: string;

  constructor(data?: Partial<Doctorant>) {
    super(data);
  }
}

export interface DoctorantRelations {
  // describe navigational properties here
}

export type DoctorantWithRelations = Doctorant & DoctorantRelations;

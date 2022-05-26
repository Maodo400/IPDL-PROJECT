import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  firstname: string;

  @property({
    type: 'string',
    required: true,
  })
  lastname: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    nullable: false,
  })
  role: string;

  @property({
    type: 'string',
  })
  resetKey: string;

  @property({
    type: 'string',
  })
  curateurId?: string;

  @property({
    type: 'string',
  })
  directeurDeTheseId?: string;

  @property({
    type: 'string',
  })
  directeurEdmiId?: string;

  @property({
    type: 'string',
  })
  directeurLaboratoireId?: string;

  @property({
    type: 'string',
  })
  doctorantId?: string;

  @property({
    type: 'string',
  })
  rapporteurId?: string;

  @property({
    type: 'string',
  })
  recteurId?: string;

  @property({
    type: 'string',
  })
  responsableEdmiId?: string;

  @property({
    type: 'string',
  })
  secretaireScientifiqueId?: string;

  @property({
    type: 'string',
  })
  secretaireId?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

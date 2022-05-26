import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Curateur,
  User
} from '../models';
import {CurateurRepository} from '../repositories';

export class CurateurUserController {
  constructor(
    @repository(CurateurRepository) protected curateurRepository: CurateurRepository,
  ) { }

  @get('/curateurs/{id}/user', {
    responses: {
      '200': {
        description: 'Curateur has one User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User> {
    return this.curateurRepository.user(id).get(filter);
  }

  @post('/curateurs/{id}/user', {
    responses: {
      '200': {
        description: 'Curateur model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Curateur.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInCurateur',
            exclude: ['id'],
            optional: ['curateurId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.curateurRepository.user(id).create(user);
  }

  @patch('/curateurs/{id}/user', {
    responses: {
      '200': {
        description: 'Curateur.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.curateurRepository.user(id).patch(user, where);
  }

  @del('/curateurs/{id}/user', {
    responses: {
      '200': {
        description: 'Curateur.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.curateurRepository.user(id).delete(where);
  }
}
/*
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "where": {
    "additionalProp1": {}
  },
  "fields": {
    "id": true,
    "firstname": true,
    "lastname": true
  },
  "include": [
    {
      "relation": "user",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "fields": {},
        "include": [

        ]
      }
    },
    "user"
  ]
}
*/

//filtre à inclure pour afficher les relations d'inclusions
/*
{
  "fields": {
    "id": true,
    "firstname": true,
    "lastname": true
  },
  "include": [
    {
      "relation": "user",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "fields": {},
        "include": [

        ]
      }
    },
    "user"
  ]
}
*/

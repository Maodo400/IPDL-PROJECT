import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  SecretaireScientifique,
  User,
} from '../models';
import {SecretaireScientifiqueRepository} from '../repositories';

export class SecretaireScientifiqueUserController {
  constructor(
    @repository(SecretaireScientifiqueRepository) protected secretaireScientifiqueRepository: SecretaireScientifiqueRepository,
  ) { }

  @get('/secretaire-scientifiques/{id}/user', {
    responses: {
      '200': {
        description: 'SecretaireScientifique has one User',
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
    return this.secretaireScientifiqueRepository.user(id).get(filter);
  }

  @post('/secretaire-scientifiques/{id}/user', {
    responses: {
      '200': {
        description: 'SecretaireScientifique model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof SecretaireScientifique.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInSecretaireScientifique',
            exclude: ['id'],
            optional: ['secretaireScientifiqueId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.secretaireScientifiqueRepository.user(id).create(user);
  }

  @patch('/secretaire-scientifiques/{id}/user', {
    responses: {
      '200': {
        description: 'SecretaireScientifique.User PATCH success count',
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
    return this.secretaireScientifiqueRepository.user(id).patch(user, where);
  }

  @del('/secretaire-scientifiques/{id}/user', {
    responses: {
      '200': {
        description: 'SecretaireScientifique.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.secretaireScientifiqueRepository.user(id).delete(where);
  }
}

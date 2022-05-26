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
  Secretaire,
  User,
} from '../models';
import {SecretaireRepository} from '../repositories';

export class SecretaireUserController {
  constructor(
    @repository(SecretaireRepository) protected secretaireRepository: SecretaireRepository,
  ) { }

  @get('/secretaires/{id}/user', {
    responses: {
      '200': {
        description: 'Secretaire has one User',
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
    return this.secretaireRepository.user(id).get(filter);
  }

  @post('/secretaires/{id}/user', {
    responses: {
      '200': {
        description: 'Secretaire model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Secretaire.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInSecretaire',
            exclude: ['id'],
            optional: ['secretaireId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.secretaireRepository.user(id).create(user);
  }

  @patch('/secretaires/{id}/user', {
    responses: {
      '200': {
        description: 'Secretaire.User PATCH success count',
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
    return this.secretaireRepository.user(id).patch(user, where);
  }

  @del('/secretaires/{id}/user', {
    responses: {
      '200': {
        description: 'Secretaire.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.secretaireRepository.user(id).delete(where);
  }
}

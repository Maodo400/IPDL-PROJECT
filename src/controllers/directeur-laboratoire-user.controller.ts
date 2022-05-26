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
  DirecteurLaboratoire,
  User,
} from '../models';
import {DirecteurLaboratoireRepository} from '../repositories';

export class DirecteurLaboratoireUserController {
  constructor(
    @repository(DirecteurLaboratoireRepository) protected directeurLaboratoireRepository: DirecteurLaboratoireRepository,
  ) { }

  @get('/directeur-laboratoires/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurLaboratoire has one User',
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
    return this.directeurLaboratoireRepository.user(id).get(filter);
  }

  @post('/directeur-laboratoires/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurLaboratoire model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DirecteurLaboratoire.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInDirecteurLaboratoire',
            exclude: ['id'],
            optional: ['directeurLaboratoireId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.directeurLaboratoireRepository.user(id).create(user);
  }

  @patch('/directeur-laboratoires/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurLaboratoire.User PATCH success count',
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
    return this.directeurLaboratoireRepository.user(id).patch(user, where);
  }

  @del('/directeur-laboratoires/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurLaboratoire.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.directeurLaboratoireRepository.user(id).delete(where);
  }
}

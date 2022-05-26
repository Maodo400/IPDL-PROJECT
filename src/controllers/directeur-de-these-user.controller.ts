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
  DirecteurDeThese,
  User,
} from '../models';
import {DirecteurDeTheseRepository} from '../repositories';

export class DirecteurDeTheseUserController {
  constructor(
    @repository(DirecteurDeTheseRepository) protected directeurDeTheseRepository: DirecteurDeTheseRepository,
  ) { }

  @get('/directeur-de-these/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurDeThese has one User',
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
    return this.directeurDeTheseRepository.user(id).get(filter);
  }

  @post('/directeur-de-these/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurDeThese model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DirecteurDeThese.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInDirecteurDeThese',
            exclude: ['id'],
            optional: ['directeurDeTheseId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.directeurDeTheseRepository.user(id).create(user);
  }

  @patch('/directeur-de-these/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurDeThese.User PATCH success count',
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
    return this.directeurDeTheseRepository.user(id).patch(user, where);
  }

  @del('/directeur-de-these/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurDeThese.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.directeurDeTheseRepository.user(id).delete(where);
  }
}

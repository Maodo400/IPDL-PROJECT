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
  ResponsableEdmi,
  User,
} from '../models';
import {ResponsableEdmiRepository} from '../repositories';

export class ResponsableEdmiUserController {
  constructor(
    @repository(ResponsableEdmiRepository) protected responsableEdmiRepository: ResponsableEdmiRepository,
  ) { }

  @get('/responsable-edmis/{id}/user', {
    responses: {
      '200': {
        description: 'ResponsableEdmi has one User',
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
    return this.responsableEdmiRepository.user(id).get(filter);
  }

  @post('/responsable-edmis/{id}/user', {
    responses: {
      '200': {
        description: 'ResponsableEdmi model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ResponsableEdmi.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInResponsableEdmi',
            exclude: ['id'],
            optional: ['responsableEdmiId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.responsableEdmiRepository.user(id).create(user);
  }

  @patch('/responsable-edmis/{id}/user', {
    responses: {
      '200': {
        description: 'ResponsableEdmi.User PATCH success count',
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
    return this.responsableEdmiRepository.user(id).patch(user, where);
  }

  @del('/responsable-edmis/{id}/user', {
    responses: {
      '200': {
        description: 'ResponsableEdmi.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.responsableEdmiRepository.user(id).delete(where);
  }
}

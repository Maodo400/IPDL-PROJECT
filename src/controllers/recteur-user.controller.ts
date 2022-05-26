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
  Recteur,
  User,
} from '../models';
import {RecteurRepository} from '../repositories';

export class RecteurUserController {
  constructor(
    @repository(RecteurRepository) protected recteurRepository: RecteurRepository,
  ) { }

  @get('/recteurs/{id}/user', {
    responses: {
      '200': {
        description: 'Recteur has one User',
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
    return this.recteurRepository.user(id).get(filter);
  }

  @post('/recteurs/{id}/user', {
    responses: {
      '200': {
        description: 'Recteur model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recteur.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInRecteur',
            exclude: ['id'],
            optional: ['recteurId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.recteurRepository.user(id).create(user);
  }

  @patch('/recteurs/{id}/user', {
    responses: {
      '200': {
        description: 'Recteur.User PATCH success count',
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
    return this.recteurRepository.user(id).patch(user, where);
  }

  @del('/recteurs/{id}/user', {
    responses: {
      '200': {
        description: 'Recteur.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.recteurRepository.user(id).delete(where);
  }
}

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
  Rapporteur,
  User,
} from '../models';
import {RapporteurRepository} from '../repositories';

export class RapporteurUserController {
  constructor(
    @repository(RapporteurRepository) protected rapporteurRepository: RapporteurRepository,
  ) { }

  @get('/rapporteurs/{id}/user', {
    responses: {
      '200': {
        description: 'Rapporteur has one User',
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
    return this.rapporteurRepository.user(id).get(filter);
  }

  @post('/rapporteurs/{id}/user', {
    responses: {
      '200': {
        description: 'Rapporteur model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Rapporteur.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInRapporteur',
            exclude: ['id'],
            optional: ['rapporteurId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.rapporteurRepository.user(id).create(user);
  }

  @patch('/rapporteurs/{id}/user', {
    responses: {
      '200': {
        description: 'Rapporteur.User PATCH success count',
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
    return this.rapporteurRepository.user(id).patch(user, where);
  }

  @del('/rapporteurs/{id}/user', {
    responses: {
      '200': {
        description: 'Rapporteur.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.rapporteurRepository.user(id).delete(where);
  }
}

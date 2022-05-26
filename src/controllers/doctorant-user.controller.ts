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
  Doctorant,
  User,
} from '../models';
import {DoctorantRepository} from '../repositories';

export class DoctorantUserController {
  constructor(
    @repository(DoctorantRepository) protected doctorantRepository: DoctorantRepository,
  ) { }

  @get('/doctorants/{id}/user', {
    responses: {
      '200': {
        description: 'Doctorant has one User',
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
    return this.doctorantRepository.user(id).get(filter);
  }

  @post('/doctorants/{id}/user', {
    responses: {
      '200': {
        description: 'Doctorant model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Doctorant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInDoctorant',
            exclude: ['id'],
            optional: ['doctorantId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.doctorantRepository.user(id).create(user);
  }

  @patch('/doctorants/{id}/user', {
    responses: {
      '200': {
        description: 'Doctorant.User PATCH success count',
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
    return this.doctorantRepository.user(id).patch(user, where);
  }

  @del('/doctorants/{id}/user', {
    responses: {
      '200': {
        description: 'Doctorant.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.doctorantRepository.user(id).delete(where);
  }
}

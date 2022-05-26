import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {EcoleDoctorale} from '../models';
import {EcoleDoctoraleRepository} from '../repositories';

export class EcoleDoctoraleController {
  constructor(
    @repository(EcoleDoctoraleRepository)
    public ecoleDoctoraleRepository : EcoleDoctoraleRepository,
  ) {}

  @post('/ecole-doctorales')
  @response(200, {
    description: 'EcoleDoctorale model instance',
    content: {'application/json': {schema: getModelSchemaRef(EcoleDoctorale)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EcoleDoctorale, {
            title: 'NewEcoleDoctorale',
            exclude: ['id'],
          }),
        },
      },
    })
    ecoleDoctorale: Omit<EcoleDoctorale, 'id'>,
  ): Promise<EcoleDoctorale> {
    return this.ecoleDoctoraleRepository.create(ecoleDoctorale);
  }

  @get('/ecole-doctorales/count')
  @response(200, {
    description: 'EcoleDoctorale model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(EcoleDoctorale) where?: Where<EcoleDoctorale>,
  ): Promise<Count> {
    return this.ecoleDoctoraleRepository.count(where);
  }

  @get('/ecole-doctorales')
  @response(200, {
    description: 'Array of EcoleDoctorale model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(EcoleDoctorale, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(EcoleDoctorale) filter?: Filter<EcoleDoctorale>,
  ): Promise<EcoleDoctorale[]> {
    return this.ecoleDoctoraleRepository.find(filter);
  }

  @patch('/ecole-doctorales')
  @response(200, {
    description: 'EcoleDoctorale PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EcoleDoctorale, {partial: true}),
        },
      },
    })
    ecoleDoctorale: EcoleDoctorale,
    @param.where(EcoleDoctorale) where?: Where<EcoleDoctorale>,
  ): Promise<Count> {
    return this.ecoleDoctoraleRepository.updateAll(ecoleDoctorale, where);
  }

  @get('/ecole-doctorales/{id}')
  @response(200, {
    description: 'EcoleDoctorale model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(EcoleDoctorale, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(EcoleDoctorale, {exclude: 'where'}) filter?: FilterExcludingWhere<EcoleDoctorale>
  ): Promise<EcoleDoctorale> {
    return this.ecoleDoctoraleRepository.findById(id, filter);
  }

  @patch('/ecole-doctorales/{id}')
  @response(204, {
    description: 'EcoleDoctorale PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EcoleDoctorale, {partial: true}),
        },
      },
    })
    ecoleDoctorale: EcoleDoctorale,
  ): Promise<void> {
    await this.ecoleDoctoraleRepository.updateById(id, ecoleDoctorale);
  }

  @put('/ecole-doctorales/{id}')
  @response(204, {
    description: 'EcoleDoctorale PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ecoleDoctorale: EcoleDoctorale,
  ): Promise<void> {
    await this.ecoleDoctoraleRepository.replaceById(id, ecoleDoctorale);
  }

  @del('/ecole-doctorales/{id}')
  @response(204, {
    description: 'EcoleDoctorale DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ecoleDoctoraleRepository.deleteById(id);
  }
}

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
  EcoleDoctorale,
  Secretaire,
} from '../models';
import {EcoleDoctoraleRepository} from '../repositories';

export class EcoleDoctoraleSecretaireController {
  constructor(
    @repository(EcoleDoctoraleRepository) protected ecoleDoctoraleRepository: EcoleDoctoraleRepository,
  ) { }

  @get('/ecole-doctorales/{id}/secretaires', {
    responses: {
      '200': {
        description: 'Array of EcoleDoctorale has many Secretaire',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Secretaire)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Secretaire>,
  ): Promise<Secretaire[]> {
    return this.ecoleDoctoraleRepository.secretaires(id).find(filter);
  }

  @post('/ecole-doctorales/{id}/secretaires', {
    responses: {
      '200': {
        description: 'EcoleDoctorale model instance',
        content: {'application/json': {schema: getModelSchemaRef(Secretaire)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof EcoleDoctorale.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Secretaire, {
            title: 'NewSecretaireInEcoleDoctorale',
            exclude: ['id'],
            optional: ['ecoleDoctoraleId']
          }),
        },
      },
    }) secretaire: Omit<Secretaire, 'id'>,
  ): Promise<Secretaire> {
    return this.ecoleDoctoraleRepository.secretaires(id).create(secretaire);
  }

  @patch('/ecole-doctorales/{id}/secretaires', {
    responses: {
      '200': {
        description: 'EcoleDoctorale.Secretaire PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Secretaire, {partial: true}),
        },
      },
    })
    secretaire: Partial<Secretaire>,
    @param.query.object('where', getWhereSchemaFor(Secretaire)) where?: Where<Secretaire>,
  ): Promise<Count> {
    return this.ecoleDoctoraleRepository.secretaires(id).patch(secretaire, where);
  }

  @del('/ecole-doctorales/{id}/secretaires', {
    responses: {
      '200': {
        description: 'EcoleDoctorale.Secretaire DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Secretaire)) where?: Where<Secretaire>,
  ): Promise<Count> {
    return this.ecoleDoctoraleRepository.secretaires(id).delete(where);
  }
}

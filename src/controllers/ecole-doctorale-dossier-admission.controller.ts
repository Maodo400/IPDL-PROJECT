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
  DossierAdmission,
} from '../models';
import {EcoleDoctoraleRepository} from '../repositories';

export class EcoleDoctoraleDossierAdmissionController {
  constructor(
    @repository(EcoleDoctoraleRepository) protected ecoleDoctoraleRepository: EcoleDoctoraleRepository,
  ) { }

  @get('/ecole-doctorales/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'Array of EcoleDoctorale has many DossierAdmission',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DossierAdmission)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<DossierAdmission>,
  ): Promise<DossierAdmission[]> {
    return this.ecoleDoctoraleRepository.dossierAdmissions(id).find(filter);
  }

  @post('/ecole-doctorales/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'EcoleDoctorale model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierAdmission)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof EcoleDoctorale.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierAdmission, {
            title: 'NewDossierAdmissionInEcoleDoctorale',
            exclude: ['id'],
            optional: ['ecoleDoctoraleId']
          }),
        },
      },
    }) dossierAdmission: Omit<DossierAdmission, 'id'>,
  ): Promise<DossierAdmission> {
    return this.ecoleDoctoraleRepository.dossierAdmissions(id).create(dossierAdmission);
  }

  @patch('/ecole-doctorales/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'EcoleDoctorale.DossierAdmission PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierAdmission, {partial: true}),
        },
      },
    })
    dossierAdmission: Partial<DossierAdmission>,
    @param.query.object('where', getWhereSchemaFor(DossierAdmission)) where?: Where<DossierAdmission>,
  ): Promise<Count> {
    return this.ecoleDoctoraleRepository.dossierAdmissions(id).patch(dossierAdmission, where);
  }

  @del('/ecole-doctorales/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'EcoleDoctorale.DossierAdmission DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierAdmission)) where?: Where<DossierAdmission>,
  ): Promise<Count> {
    return this.ecoleDoctoraleRepository.dossierAdmissions(id).delete(where);
  }
}

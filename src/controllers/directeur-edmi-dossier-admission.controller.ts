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
  DirecteurEdmi,
  DossierAdmission,
} from '../models';
import {DirecteurEdmiRepository} from '../repositories';

export class DirecteurEdmiDossierAdmissionController {
  constructor(
    @repository(DirecteurEdmiRepository) protected directeurEdmiRepository: DirecteurEdmiRepository,
  ) { }

  @get('/directeur-edmis/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'Array of DirecteurEdmi has many DossierAdmission',
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
    return this.directeurEdmiRepository.dossierAdmissions(id).find(filter);
  }

  @post('/directeur-edmis/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'DirecteurEdmi model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierAdmission)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DirecteurEdmi.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierAdmission, {
            title: 'NewDossierAdmissionInDirecteurEdmi',
            exclude: ['id'],
            optional: ['directeurEdmiId']
          }),
        },
      },
    }) dossierAdmission: Omit<DossierAdmission, 'id'>,
  ): Promise<DossierAdmission> {
    return this.directeurEdmiRepository.dossierAdmissions(id).create(dossierAdmission);
  }

  @patch('/directeur-edmis/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'DirecteurEdmi.DossierAdmission PATCH success count',
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
    return this.directeurEdmiRepository.dossierAdmissions(id).patch(dossierAdmission, where);
  }

  @del('/directeur-edmis/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'DirecteurEdmi.DossierAdmission DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierAdmission)) where?: Where<DossierAdmission>,
  ): Promise<Count> {
    return this.directeurEdmiRepository.dossierAdmissions(id).delete(where);
  }
}

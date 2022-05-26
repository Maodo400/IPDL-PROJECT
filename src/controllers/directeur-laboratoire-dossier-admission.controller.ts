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
  DossierAdmission,
} from '../models';
import {DirecteurLaboratoireRepository} from '../repositories';

export class DirecteurLaboratoireDossierAdmissionController {
  constructor(
    @repository(DirecteurLaboratoireRepository) protected directeurLaboratoireRepository: DirecteurLaboratoireRepository,
  ) { }

  @get('/directeur-laboratoires/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'Array of DirecteurLaboratoire has many DossierAdmission',
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
    return this.directeurLaboratoireRepository.dossierAdmissions(id).find(filter);
  }

  @post('/directeur-laboratoires/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'DirecteurLaboratoire model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierAdmission)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DirecteurLaboratoire.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierAdmission, {
            title: 'NewDossierAdmissionInDirecteurLaboratoire',
            exclude: ['id'],
            optional: ['directeurLaboratoireId']
          }),
        },
      },
    }) dossierAdmission: Omit<DossierAdmission, 'id'>,
  ): Promise<DossierAdmission> {
    return this.directeurLaboratoireRepository.dossierAdmissions(id).create(dossierAdmission);
  }

  @patch('/directeur-laboratoires/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'DirecteurLaboratoire.DossierAdmission PATCH success count',
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
    return this.directeurLaboratoireRepository.dossierAdmissions(id).patch(dossierAdmission, where);
  }

  @del('/directeur-laboratoires/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'DirecteurLaboratoire.DossierAdmission DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierAdmission)) where?: Where<DossierAdmission>,
  ): Promise<Count> {
    return this.directeurLaboratoireRepository.dossierAdmissions(id).delete(where);
  }
}

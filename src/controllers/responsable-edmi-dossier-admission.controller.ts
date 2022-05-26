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
  DossierAdmission,
} from '../models';
import {ResponsableEdmiRepository} from '../repositories';

export class ResponsableEdmiDossierAdmissionController {
  constructor(
    @repository(ResponsableEdmiRepository) protected responsableEdmiRepository: ResponsableEdmiRepository,
  ) { }

  @get('/responsable-edmis/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'Array of ResponsableEdmi has many DossierAdmission',
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
    return this.responsableEdmiRepository.dossierAdmissions(id).find(filter);
  }

  @post('/responsable-edmis/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'ResponsableEdmi model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierAdmission)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ResponsableEdmi.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierAdmission, {
            title: 'NewDossierAdmissionInResponsableEdmi',
            exclude: ['id'],
            optional: ['responsableEdmiId']
          }),
        },
      },
    }) dossierAdmission: Omit<DossierAdmission, 'id'>,
  ): Promise<DossierAdmission> {
    return this.responsableEdmiRepository.dossierAdmissions(id).create(dossierAdmission);
  }

  @patch('/responsable-edmis/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'ResponsableEdmi.DossierAdmission PATCH success count',
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
    return this.responsableEdmiRepository.dossierAdmissions(id).patch(dossierAdmission, where);
  }

  @del('/responsable-edmis/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'ResponsableEdmi.DossierAdmission DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierAdmission)) where?: Where<DossierAdmission>,
  ): Promise<Count> {
    return this.responsableEdmiRepository.dossierAdmissions(id).delete(where);
  }
}

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
  DossierAdmission,
  Doctorant,
} from '../models';
import {DossierAdmissionRepository} from '../repositories';

export class DossierAdmissionDoctorantController {
  constructor(
    @repository(DossierAdmissionRepository) protected dossierAdmissionRepository: DossierAdmissionRepository,
  ) { }

  @get('/dossier-admissions/{id}/doctorants', {
    responses: {
      '200': {
        description: 'Array of DossierAdmission has many Doctorant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Doctorant)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Doctorant>,
  ): Promise<Doctorant[]> {
    return this.dossierAdmissionRepository.doctorants(id).find(filter);
  }

  @post('/dossier-admissions/{id}/doctorants', {
    responses: {
      '200': {
        description: 'DossierAdmission model instance',
        content: {'application/json': {schema: getModelSchemaRef(Doctorant)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DossierAdmission.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctorant, {
            title: 'NewDoctorantInDossierAdmission',
            exclude: ['id'],
            optional: ['dossierAdmissionId']
          }),
        },
      },
    }) doctorant: Omit<Doctorant, 'id'>,
  ): Promise<Doctorant> {
    return this.dossierAdmissionRepository.doctorants(id).create(doctorant);
  }

  @patch('/dossier-admissions/{id}/doctorants', {
    responses: {
      '200': {
        description: 'DossierAdmission.Doctorant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctorant, {partial: true}),
        },
      },
    })
    doctorant: Partial<Doctorant>,
    @param.query.object('where', getWhereSchemaFor(Doctorant)) where?: Where<Doctorant>,
  ): Promise<Count> {
    return this.dossierAdmissionRepository.doctorants(id).patch(doctorant, where);
  }

  @del('/dossier-admissions/{id}/doctorants', {
    responses: {
      '200': {
        description: 'DossierAdmission.Doctorant DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Doctorant)) where?: Where<Doctorant>,
  ): Promise<Count> {
    return this.dossierAdmissionRepository.doctorants(id).delete(where);
  }
}

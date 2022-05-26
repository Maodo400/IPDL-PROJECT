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
  DirecteurDeThese,
  DossierAdmission,
} from '../models';
import {DirecteurDeTheseRepository} from '../repositories';

export class DirecteurDeTheseDossierAdmissionController {
  constructor(
    @repository(DirecteurDeTheseRepository) protected directeurDeTheseRepository: DirecteurDeTheseRepository,
  ) { }

  @get('/directeur-de-these/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'Array of DirecteurDeThese has many DossierAdmission',
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
    return this.directeurDeTheseRepository.dossierAdmissions(id).find(filter);
  }

  @post('/directeur-de-these/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'DirecteurDeThese model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierAdmission)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DirecteurDeThese.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierAdmission, {
            title: 'NewDossierAdmissionInDirecteurDeThese',
            exclude: ['id'],
            optional: ['directeurDeTheseId']
          }),
        },
      },
    }) dossierAdmission: Omit<DossierAdmission, 'id'>,
  ): Promise<DossierAdmission> {
    return this.directeurDeTheseRepository.dossierAdmissions(id).create(dossierAdmission);
  }

  @patch('/directeur-de-these/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'DirecteurDeThese.DossierAdmission PATCH success count',
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
    return this.directeurDeTheseRepository.dossierAdmissions(id).patch(dossierAdmission, where);
  }

  @del('/directeur-de-these/{id}/dossier-admissions', {
    responses: {
      '200': {
        description: 'DirecteurDeThese.DossierAdmission DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierAdmission)) where?: Where<DossierAdmission>,
  ): Promise<Count> {
    return this.directeurDeTheseRepository.dossierAdmissions(id).delete(where);
  }
}

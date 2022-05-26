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
  DossierSoutenance,
} from '../models';
import {DirecteurEdmiRepository} from '../repositories';

export class DirecteurEdmiDossierSoutenanceController {
  constructor(
    @repository(DirecteurEdmiRepository) protected directeurEdmiRepository: DirecteurEdmiRepository,
  ) { }

  @get('/directeur-edmis/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Array of DirecteurEdmi has many DossierSoutenance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DossierSoutenance)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<DossierSoutenance>,
  ): Promise<DossierSoutenance[]> {
    return this.directeurEdmiRepository.dossierSoutenances(id).find(filter);
  }

  @post('/directeur-edmis/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'DirecteurEdmi model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierSoutenance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DirecteurEdmi.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {
            title: 'NewDossierSoutenanceInDirecteurEdmi',
            exclude: ['id'],
            optional: ['directeurEdmiId']
          }),
        },
      },
    }) dossierSoutenance: Omit<DossierSoutenance, 'id'>,
  ): Promise<DossierSoutenance> {
    return this.directeurEdmiRepository.dossierSoutenances(id).create(dossierSoutenance);
  }

  @patch('/directeur-edmis/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'DirecteurEdmi.DossierSoutenance PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {partial: true}),
        },
      },
    })
    dossierSoutenance: Partial<DossierSoutenance>,
    @param.query.object('where', getWhereSchemaFor(DossierSoutenance)) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.directeurEdmiRepository.dossierSoutenances(id).patch(dossierSoutenance, where);
  }

  @del('/directeur-edmis/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'DirecteurEdmi.DossierSoutenance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierSoutenance)) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.directeurEdmiRepository.dossierSoutenances(id).delete(where);
  }
}

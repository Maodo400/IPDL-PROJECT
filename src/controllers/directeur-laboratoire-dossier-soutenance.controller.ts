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
  DossierSoutenance,
} from '../models';
import {DirecteurLaboratoireRepository} from '../repositories';

export class DirecteurLaboratoireDossierSoutenanceController {
  constructor(
    @repository(DirecteurLaboratoireRepository) protected directeurLaboratoireRepository: DirecteurLaboratoireRepository,
  ) { }

  @get('/directeur-laboratoires/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Array of DirecteurLaboratoire has many DossierSoutenance',
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
    return this.directeurLaboratoireRepository.dossierSoutenances(id).find(filter);
  }

  @post('/directeur-laboratoires/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'DirecteurLaboratoire model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierSoutenance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DirecteurLaboratoire.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {
            title: 'NewDossierSoutenanceInDirecteurLaboratoire',
            exclude: ['id'],
            optional: ['directeurLaboratoireId']
          }),
        },
      },
    }) dossierSoutenance: Omit<DossierSoutenance, 'id'>,
  ): Promise<DossierSoutenance> {
    return this.directeurLaboratoireRepository.dossierSoutenances(id).create(dossierSoutenance);
  }

  @patch('/directeur-laboratoires/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'DirecteurLaboratoire.DossierSoutenance PATCH success count',
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
    return this.directeurLaboratoireRepository.dossierSoutenances(id).patch(dossierSoutenance, where);
  }

  @del('/directeur-laboratoires/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'DirecteurLaboratoire.DossierSoutenance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierSoutenance)) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.directeurLaboratoireRepository.dossierSoutenances(id).delete(where);
  }
}

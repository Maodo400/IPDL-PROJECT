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
  Recteur,
  DossierSoutenance,
} from '../models';
import {RecteurRepository} from '../repositories';

export class RecteurDossierSoutenanceController {
  constructor(
    @repository(RecteurRepository) protected recteurRepository: RecteurRepository,
  ) { }

  @get('/recteurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Array of Recteur has many DossierSoutenance',
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
    return this.recteurRepository.dossierSoutenances(id).find(filter);
  }

  @post('/recteurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Recteur model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierSoutenance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recteur.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {
            title: 'NewDossierSoutenanceInRecteur',
            exclude: ['id'],
            optional: ['recteurId']
          }),
        },
      },
    }) dossierSoutenance: Omit<DossierSoutenance, 'id'>,
  ): Promise<DossierSoutenance> {
    return this.recteurRepository.dossierSoutenances(id).create(dossierSoutenance);
  }

  @patch('/recteurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Recteur.DossierSoutenance PATCH success count',
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
    return this.recteurRepository.dossierSoutenances(id).patch(dossierSoutenance, where);
  }

  @del('/recteurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Recteur.DossierSoutenance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierSoutenance)) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.recteurRepository.dossierSoutenances(id).delete(where);
  }
}

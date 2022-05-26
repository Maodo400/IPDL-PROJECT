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
  Rapporteur,
  DossierSoutenance,
} from '../models';
import {RapporteurRepository} from '../repositories';

export class RapporteurDossierSoutenanceController {
  constructor(
    @repository(RapporteurRepository) protected rapporteurRepository: RapporteurRepository,
  ) { }

  @get('/rapporteurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Array of Rapporteur has many DossierSoutenance',
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
    return this.rapporteurRepository.dossierSoutenances(id).find(filter);
  }

  @post('/rapporteurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Rapporteur model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierSoutenance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Rapporteur.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {
            title: 'NewDossierSoutenanceInRapporteur',
            exclude: ['id'],
            optional: ['rapporteurId']
          }),
        },
      },
    }) dossierSoutenance: Omit<DossierSoutenance, 'id'>,
  ): Promise<DossierSoutenance> {
    return this.rapporteurRepository.dossierSoutenances(id).create(dossierSoutenance);
  }

  @patch('/rapporteurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Rapporteur.DossierSoutenance PATCH success count',
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
    return this.rapporteurRepository.dossierSoutenances(id).patch(dossierSoutenance, where);
  }

  @del('/rapporteurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Rapporteur.DossierSoutenance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierSoutenance)) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.rapporteurRepository.dossierSoutenances(id).delete(where);
  }
}

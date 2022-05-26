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
  Curateur,
  DossierSoutenance,
} from '../models';
import {CurateurRepository} from '../repositories';

export class CurateurDossierSoutenanceController {
  constructor(
    @repository(CurateurRepository) protected curateurRepository: CurateurRepository,
  ) { }

  @get('/curateurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Array of Curateur has many DossierSoutenance',
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
    return this.curateurRepository.dossierSoutenances(id).find(filter);
  }

  @post('/curateurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Curateur model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierSoutenance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Curateur.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {
            title: 'NewDossierSoutenanceInCurateur',
            exclude: ['id'],
            optional: ['curateurId']
          }),
        },
      },
    }) dossierSoutenance: Omit<DossierSoutenance, 'id'>,
  ): Promise<DossierSoutenance> {
    return this.curateurRepository.dossierSoutenances(id).create(dossierSoutenance);
  }

  @patch('/curateurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Curateur.DossierSoutenance PATCH success count',
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
    return this.curateurRepository.dossierSoutenances(id).patch(dossierSoutenance, where);
  }

  @del('/curateurs/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Curateur.DossierSoutenance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierSoutenance)) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.curateurRepository.dossierSoutenances(id).delete(where);
  }
}

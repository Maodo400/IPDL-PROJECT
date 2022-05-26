import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {DossierSoutenance} from '../models';
import {DossierSoutenanceRepository} from '../repositories';

export class DossierSoutenanceController {
  constructor(
    @repository(DossierSoutenanceRepository)
    public dossierSoutenanceRepository : DossierSoutenanceRepository,
  ) {}

  @post('/dossier-soutenances')
  @response(200, {
    description: 'DossierSoutenance model instance',
    content: {'application/json': {schema: getModelSchemaRef(DossierSoutenance)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {
            title: 'NewDossierSoutenance',
            exclude: ['id'],
          }),
        },
      },
    })
    dossierSoutenance: Omit<DossierSoutenance, 'id'>,
  ): Promise<DossierSoutenance> {
    return this.dossierSoutenanceRepository.create(dossierSoutenance);
  }

  @get('/dossier-soutenances/count')
  @response(200, {
    description: 'DossierSoutenance model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DossierSoutenance) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.dossierSoutenanceRepository.count(where);
  }

  @get('/dossier-soutenances')
  @response(200, {
    description: 'Array of DossierSoutenance model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DossierSoutenance, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DossierSoutenance) filter?: Filter<DossierSoutenance>,
  ): Promise<DossierSoutenance[]> {
    return this.dossierSoutenanceRepository.find(filter);
  }

  @patch('/dossier-soutenances')
  @response(200, {
    description: 'DossierSoutenance PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {partial: true}),
        },
      },
    })
    dossierSoutenance: DossierSoutenance,
    @param.where(DossierSoutenance) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.dossierSoutenanceRepository.updateAll(dossierSoutenance, where);
  }

  @get('/dossier-soutenances/{id}')
  @response(200, {
    description: 'DossierSoutenance model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DossierSoutenance, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(DossierSoutenance, {exclude: 'where'}) filter?: FilterExcludingWhere<DossierSoutenance>
  ): Promise<DossierSoutenance> {
    return this.dossierSoutenanceRepository.findById(id, filter);
  }

  @patch('/dossier-soutenances/{id}')
  @response(204, {
    description: 'DossierSoutenance PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {partial: true}),
        },
      },
    })
    dossierSoutenance: DossierSoutenance,
  ): Promise<void> {
    await this.dossierSoutenanceRepository.updateById(id, dossierSoutenance);
  }

  @put('/dossier-soutenances/{id}')
  @response(204, {
    description: 'DossierSoutenance PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() dossierSoutenance: DossierSoutenance,
  ): Promise<void> {
    await this.dossierSoutenanceRepository.replaceById(id, dossierSoutenance);
  }

  @del('/dossier-soutenances/{id}')
  @response(204, {
    description: 'DossierSoutenance DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.dossierSoutenanceRepository.deleteById(id);
  }
}

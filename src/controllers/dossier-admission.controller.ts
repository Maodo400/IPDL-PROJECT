import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {DossierAdmission} from '../models';
import {DossierAdmissionRepository} from '../repositories';

export class DossierAdmissionController {
  constructor(
    @repository(DossierAdmissionRepository)
    public dossierAdmissionRepository : DossierAdmissionRepository,
  ) {}

  @post('/dossier-admissions')
  @response(200, {
    description: 'DossierAdmission model instance',
    content: {'application/json': {schema: getModelSchemaRef(DossierAdmission)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierAdmission, {
            title: 'NewDossierAdmission',
            exclude: ['id'],
          }),
        },
      },
    })
    dossierAdmission: Omit<DossierAdmission, 'id'>,
  ): Promise<DossierAdmission> {
    return this.dossierAdmissionRepository.create(dossierAdmission);
  }

  @get('/dossier-admissions/count')
  @response(200, {
    description: 'DossierAdmission model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DossierAdmission) where?: Where<DossierAdmission>,
  ): Promise<Count> {
    return this.dossierAdmissionRepository.count(where);
  }

  @get('/dossier-admissions')
  @response(200, {
    description: 'Array of DossierAdmission model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DossierAdmission, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DossierAdmission) filter?: Filter<DossierAdmission>,
  ): Promise<DossierAdmission[]> {
    return this.dossierAdmissionRepository.find(filter);
  }

  @patch('/dossier-admissions')
  @response(200, {
    description: 'DossierAdmission PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierAdmission, {partial: true}),
        },
      },
    })
    dossierAdmission: DossierAdmission,
    @param.where(DossierAdmission) where?: Where<DossierAdmission>,
  ): Promise<Count> {
    return this.dossierAdmissionRepository.updateAll(dossierAdmission, where);
  }

  @get('/dossier-admissions/{id}')
  @response(200, {
    description: 'DossierAdmission model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DossierAdmission, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(DossierAdmission, {exclude: 'where'}) filter?: FilterExcludingWhere<DossierAdmission>
  ): Promise<DossierAdmission> {
    return this.dossierAdmissionRepository.findById(id, filter);
  }

  @patch('/dossier-admissions/{id}')
  @response(204, {
    description: 'DossierAdmission PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierAdmission, {partial: true}),
        },
      },
    })
    dossierAdmission: DossierAdmission,
  ): Promise<void> {
    await this.dossierAdmissionRepository.updateById(id, dossierAdmission);
  }

  @put('/dossier-admissions/{id}')
  @response(204, {
    description: 'DossierAdmission PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() dossierAdmission: DossierAdmission,
  ): Promise<void> {
    await this.dossierAdmissionRepository.replaceById(id, dossierAdmission);
  }

  @del('/dossier-admissions/{id}')
  @response(204, {
    description: 'DossierAdmission DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.dossierAdmissionRepository.deleteById(id);
  }
}

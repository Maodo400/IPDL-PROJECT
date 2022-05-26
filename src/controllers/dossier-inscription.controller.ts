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
import {DossierInscription} from '../models';
import {DossierInscriptionRepository} from '../repositories';

export class DossierInscriptionController {
  constructor(
    @repository(DossierInscriptionRepository)
    public dossierInscriptionRepository : DossierInscriptionRepository,
  ) {}

  @post('/dossier-inscriptions')
  @response(200, {
    description: 'DossierInscription model instance',
    content: {'application/json': {schema: getModelSchemaRef(DossierInscription)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierInscription, {
            title: 'NewDossierInscription',
            exclude: ['id'],
          }),
        },
      },
    })
    dossierInscription: Omit<DossierInscription, 'id'>,
  ): Promise<DossierInscription> {
    return this.dossierInscriptionRepository.create(dossierInscription);
  }

  @get('/dossier-inscriptions/count')
  @response(200, {
    description: 'DossierInscription model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DossierInscription) where?: Where<DossierInscription>,
  ): Promise<Count> {
    return this.dossierInscriptionRepository.count(where);
  }

  @get('/dossier-inscriptions')
  @response(200, {
    description: 'Array of DossierInscription model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DossierInscription, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DossierInscription) filter?: Filter<DossierInscription>,
  ): Promise<DossierInscription[]> {
    return this.dossierInscriptionRepository.find(filter);
  }

  @patch('/dossier-inscriptions')
  @response(200, {
    description: 'DossierInscription PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierInscription, {partial: true}),
        },
      },
    })
    dossierInscription: DossierInscription,
    @param.where(DossierInscription) where?: Where<DossierInscription>,
  ): Promise<Count> {
    return this.dossierInscriptionRepository.updateAll(dossierInscription, where);
  }

  @get('/dossier-inscriptions/{id}')
  @response(200, {
    description: 'DossierInscription model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DossierInscription, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(DossierInscription, {exclude: 'where'}) filter?: FilterExcludingWhere<DossierInscription>
  ): Promise<DossierInscription> {
    return this.dossierInscriptionRepository.findById(id, filter);
  }

  @patch('/dossier-inscriptions/{id}')
  @response(204, {
    description: 'DossierInscription PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierInscription, {partial: true}),
        },
      },
    })
    dossierInscription: DossierInscription,
  ): Promise<void> {
    await this.dossierInscriptionRepository.updateById(id, dossierInscription);
  }

  @put('/dossier-inscriptions/{id}')
  @response(204, {
    description: 'DossierInscription PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() dossierInscription: DossierInscription,
  ): Promise<void> {
    await this.dossierInscriptionRepository.replaceById(id, dossierInscription);
  }

  @del('/dossier-inscriptions/{id}')
  @response(204, {
    description: 'DossierInscription DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.dossierInscriptionRepository.deleteById(id);
  }
}

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
  SecretaireScientifique,
  DossierSoutenance,
} from '../models';
import {SecretaireScientifiqueRepository} from '../repositories';

export class SecretaireScientifiqueDossierSoutenanceController {
  constructor(
    @repository(SecretaireScientifiqueRepository) protected secretaireScientifiqueRepository: SecretaireScientifiqueRepository,
  ) { }

  @get('/secretaire-scientifiques/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Array of SecretaireScientifique has many DossierSoutenance',
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
    return this.secretaireScientifiqueRepository.dossierSoutenances(id).find(filter);
  }

  @post('/secretaire-scientifiques/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'SecretaireScientifique model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierSoutenance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof SecretaireScientifique.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {
            title: 'NewDossierSoutenanceInSecretaireScientifique',
            exclude: ['id'],
            optional: ['secretaireScientifiqueId']
          }),
        },
      },
    }) dossierSoutenance: Omit<DossierSoutenance, 'id'>,
  ): Promise<DossierSoutenance> {
    return this.secretaireScientifiqueRepository.dossierSoutenances(id).create(dossierSoutenance);
  }

  @patch('/secretaire-scientifiques/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'SecretaireScientifique.DossierSoutenance PATCH success count',
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
    return this.secretaireScientifiqueRepository.dossierSoutenances(id).patch(dossierSoutenance, where);
  }

  @del('/secretaire-scientifiques/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'SecretaireScientifique.DossierSoutenance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierSoutenance)) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.secretaireScientifiqueRepository.dossierSoutenances(id).delete(where);
  }
}

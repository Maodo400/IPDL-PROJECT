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
  EcoleDoctorale,
  DossierInscription,
} from '../models';
import {EcoleDoctoraleRepository} from '../repositories';

export class EcoleDoctoraleDossierInscriptionController {
  constructor(
    @repository(EcoleDoctoraleRepository) protected ecoleDoctoraleRepository: EcoleDoctoraleRepository,
  ) { }

  @get('/ecole-doctorales/{id}/dossier-inscriptions', {
    responses: {
      '200': {
        description: 'Array of EcoleDoctorale has many DossierInscription',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DossierInscription)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<DossierInscription>,
  ): Promise<DossierInscription[]> {
    return this.ecoleDoctoraleRepository.dossierInscriptions(id).find(filter);
  }

  @post('/ecole-doctorales/{id}/dossier-inscriptions', {
    responses: {
      '200': {
        description: 'EcoleDoctorale model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierInscription)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof EcoleDoctorale.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierInscription, {
            title: 'NewDossierInscriptionInEcoleDoctorale',
            exclude: ['id'],
            optional: ['ecoleDoctoraleId']
          }),
        },
      },
    }) dossierInscription: Omit<DossierInscription, 'id'>,
  ): Promise<DossierInscription> {
    return this.ecoleDoctoraleRepository.dossierInscriptions(id).create(dossierInscription);
  }

  @patch('/ecole-doctorales/{id}/dossier-inscriptions', {
    responses: {
      '200': {
        description: 'EcoleDoctorale.DossierInscription PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierInscription, {partial: true}),
        },
      },
    })
    dossierInscription: Partial<DossierInscription>,
    @param.query.object('where', getWhereSchemaFor(DossierInscription)) where?: Where<DossierInscription>,
  ): Promise<Count> {
    return this.ecoleDoctoraleRepository.dossierInscriptions(id).patch(dossierInscription, where);
  }

  @del('/ecole-doctorales/{id}/dossier-inscriptions', {
    responses: {
      '200': {
        description: 'EcoleDoctorale.DossierInscription DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierInscription)) where?: Where<DossierInscription>,
  ): Promise<Count> {
    return this.ecoleDoctoraleRepository.dossierInscriptions(id).delete(where);
  }
}

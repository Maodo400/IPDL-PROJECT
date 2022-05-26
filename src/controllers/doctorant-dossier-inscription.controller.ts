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
  Doctorant,
  DossierInscription,
} from '../models';
import {DoctorantRepository} from '../repositories';

export class DoctorantDossierInscriptionController {
  constructor(
    @repository(DoctorantRepository) protected doctorantRepository: DoctorantRepository,
  ) { }

  @get('/doctorants/{id}/dossier-inscription', {
    responses: {
      '200': {
        description: 'Doctorant has one DossierInscription',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DossierInscription),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<DossierInscription>,
  ): Promise<DossierInscription> {
    return this.doctorantRepository.dossierInscription(id).get(filter);
  }

  @post('/doctorants/{id}/dossier-inscription', {
    responses: {
      '200': {
        description: 'Doctorant model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierInscription)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Doctorant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierInscription, {
            title: 'NewDossierInscriptionInDoctorant',
            exclude: ['id'],
            optional: ['doctorantId']
          }),
        },
      },
    }) dossierInscription: Omit<DossierInscription, 'id'>,
  ): Promise<DossierInscription> {
    return this.doctorantRepository.dossierInscription(id).create(dossierInscription);
  }

  @patch('/doctorants/{id}/dossier-inscription', {
    responses: {
      '200': {
        description: 'Doctorant.DossierInscription PATCH success count',
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
    return this.doctorantRepository.dossierInscription(id).patch(dossierInscription, where);
  }

  @del('/doctorants/{id}/dossier-inscription', {
    responses: {
      '200': {
        description: 'Doctorant.DossierInscription DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierInscription)) where?: Where<DossierInscription>,
  ): Promise<Count> {
    return this.doctorantRepository.dossierInscription(id).delete(where);
  }
}

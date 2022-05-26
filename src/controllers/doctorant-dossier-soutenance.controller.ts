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
  DossierSoutenance,
} from '../models';
import {DoctorantRepository} from '../repositories';

export class DoctorantDossierSoutenanceController {
  constructor(
    @repository(DoctorantRepository) protected doctorantRepository: DoctorantRepository,
  ) { }

  @get('/doctorants/{id}/dossier-soutenance', {
    responses: {
      '200': {
        description: 'Doctorant has one DossierSoutenance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DossierSoutenance),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<DossierSoutenance>,
  ): Promise<DossierSoutenance> {
    return this.doctorantRepository.dossierSoutenance(id).get(filter);
  }

  @post('/doctorants/{id}/dossier-soutenance', {
    responses: {
      '200': {
        description: 'Doctorant model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierSoutenance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Doctorant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {
            title: 'NewDossierSoutenanceInDoctorant',
            exclude: ['id'],
            optional: ['doctorantId']
          }),
        },
      },
    }) dossierSoutenance: Omit<DossierSoutenance, 'id'>,
  ): Promise<DossierSoutenance> {
    return this.doctorantRepository.dossierSoutenance(id).create(dossierSoutenance);
  }

  @patch('/doctorants/{id}/dossier-soutenance', {
    responses: {
      '200': {
        description: 'Doctorant.DossierSoutenance PATCH success count',
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
    return this.doctorantRepository.dossierSoutenance(id).patch(dossierSoutenance, where);
  }

  @del('/doctorants/{id}/dossier-soutenance', {
    responses: {
      '200': {
        description: 'Doctorant.DossierSoutenance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierSoutenance)) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.doctorantRepository.dossierSoutenance(id).delete(where);
  }
}

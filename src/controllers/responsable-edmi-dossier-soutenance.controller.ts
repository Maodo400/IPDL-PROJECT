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
  ResponsableEdmi,
  DossierSoutenance,
} from '../models';
import {ResponsableEdmiRepository} from '../repositories';

export class ResponsableEdmiDossierSoutenanceController {
  constructor(
    @repository(ResponsableEdmiRepository) protected responsableEdmiRepository: ResponsableEdmiRepository,
  ) { }

  @get('/responsable-edmis/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'Array of ResponsableEdmi has many DossierSoutenance',
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
    return this.responsableEdmiRepository.dossierSoutenances(id).find(filter);
  }

  @post('/responsable-edmis/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'ResponsableEdmi model instance',
        content: {'application/json': {schema: getModelSchemaRef(DossierSoutenance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ResponsableEdmi.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DossierSoutenance, {
            title: 'NewDossierSoutenanceInResponsableEdmi',
            exclude: ['id'],
            optional: ['responsableEdmiId']
          }),
        },
      },
    }) dossierSoutenance: Omit<DossierSoutenance, 'id'>,
  ): Promise<DossierSoutenance> {
    return this.responsableEdmiRepository.dossierSoutenances(id).create(dossierSoutenance);
  }

  @patch('/responsable-edmis/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'ResponsableEdmi.DossierSoutenance PATCH success count',
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
    return this.responsableEdmiRepository.dossierSoutenances(id).patch(dossierSoutenance, where);
  }

  @del('/responsable-edmis/{id}/dossier-soutenances', {
    responses: {
      '200': {
        description: 'ResponsableEdmi.DossierSoutenance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(DossierSoutenance)) where?: Where<DossierSoutenance>,
  ): Promise<Count> {
    return this.responsableEdmiRepository.dossierSoutenances(id).delete(where);
  }
}

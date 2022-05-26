import {inject} from '@loopback/core';
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
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import _ from 'lodash';
import {PasswordHasherBindings} from '../keys';
import {ResponsableEdmi} from '../models';
import {CurCredentials, ResponsableEdmiRepository} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class ResponsableEdmiController {
  constructor(
    @repository(ResponsableEdmiRepository)
    public responsableEdmiRepository : ResponsableEdmiRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  // @post('/responsable-edmis')
  // @response(200, {
  //   description: 'ResponsableEdmi model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(ResponsableEdmi)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(ResponsableEdmi, {
  //           title: 'NewResponsableEdmi',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   responsableEdmi: Omit<ResponsableEdmi, 'id'>,
  // ): Promise<ResponsableEdmi> {
  //   return this.responsableEdmiRepository.create(responsableEdmi);
  // }

  @post('/Responsable-edmis')
  @response(200, {
    description: 'ResponsableEdmi model instance',
    content: {'application/json': {schema: getModelSchemaRef(ResponsableEdmi)}},
  })
async create(
  @requestBody(CurateurRequestBody)
    newResponsableEdmiRequest: CurCredentials,
    // ResponsableEdmi: Omit<ResponsableEdmi, 'id'>
): Promise<ResponsableEdmi> {
  const role = 'ResponsableEdmi';
  const email = newResponsableEdmiRequest.email;
  const firstname = newResponsableEdmiRequest.firstname;
  const lastname = newResponsableEdmiRequest.lastname;

  // ensure a valid email value and password value
  validateCredentials(_
    .pick(newResponsableEdmiRequest, ['email', 'password', 'firstname', 'lastname']));

  // encrypt the password
  const password = await this.passwordHasher.hashPassword(
    newResponsableEdmiRequest.password,
  );

  try {
    // create the new user
    const savedUser = await this.responsableEdmiRepository.create(
      _.omit(newResponsableEdmiRequest, 'password', 'email', 'firstname', 'lastname', 'role'),
    );

    // set the password
     await this.responsableEdmiRepository
       .user(savedUser.id)
       .create({
         firstname,
         lastname,
         password,
         email,
         role,
      });

    return savedUser;
  } catch (error) {
    // MongoError 11000 duplicate key
    if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
      throw new HttpErrors.Conflict('Email value is already taken');
    } else {
      throw error;
    }
  }
}

  @get('/responsable-edmis/count')
  @response(200, {
    description: 'ResponsableEdmi model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ResponsableEdmi) where?: Where<ResponsableEdmi>,
  ): Promise<Count> {
    return this.responsableEdmiRepository.count(where);
  }

  @get('/responsable-edmis')
  @response(200, {
    description: 'Array of ResponsableEdmi model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ResponsableEdmi, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ResponsableEdmi) filter?: Filter<ResponsableEdmi>,
  ): Promise<ResponsableEdmi[]> {
    return this.responsableEdmiRepository.find({
      "offset": 0,
      "limit": 100,
      "skip": 0,
      "fields": {
        "id": true
      },
      "include": [
        {
          "relation": "user",
          "scope": {
            "offset": 0,
            "limit": 100,
            "skip": 0,
            "fields": {},
            "include": [

            ]
          }
        },
        "user"
      ]
    });
  }

  @patch('/responsable-edmis')
  @response(200, {
    description: 'ResponsableEdmi PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ResponsableEdmi, {partial: true}),
        },
      },
    })
    responsableEdmi: ResponsableEdmi,
    @param.where(ResponsableEdmi) where?: Where<ResponsableEdmi>,
  ): Promise<Count> {
    return this.responsableEdmiRepository.updateAll(responsableEdmi, where);
  }

  @get('/responsable-edmis/{id}')
  @response(200, {
    description: 'ResponsableEdmi model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ResponsableEdmi, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ResponsableEdmi, {exclude: 'where'}) filter?: FilterExcludingWhere<ResponsableEdmi>
  ): Promise<ResponsableEdmi> {
    return this.responsableEdmiRepository.findById(id, filter);
  }

  @patch('/responsable-edmis/{id}')
  @response(204, {
    description: 'ResponsableEdmi PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ResponsableEdmi, {partial: true}),
        },
      },
    })
    responsableEdmi: ResponsableEdmi,
  ): Promise<void> {
    await this.responsableEdmiRepository.updateById(id, responsableEdmi);
  }

  @put('/responsable-edmis/{id}')
  @response(204, {
    description: 'ResponsableEdmi PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() responsableEdmi: ResponsableEdmi,
  ): Promise<void> {
    await this.responsableEdmiRepository.replaceById(id, responsableEdmi);
  }

  @del('/responsable-edmis/{id}')
  @response(204, {
    description: 'ResponsableEdmi DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.responsableEdmiRepository.deleteById(id);
  }
}

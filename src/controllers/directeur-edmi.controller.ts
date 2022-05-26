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
import {DirecteurEdmi} from '../models';
import {CurCredentials, DirecteurEdmiRepository} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class DirecteurEdmiController {
  constructor(
    @repository(DirecteurEdmiRepository)
    public directeurEdmiRepository : DirecteurEdmiRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  // @post('/directeur-edmis')
  // @response(200, {
  //   description: 'DirecteurEdmi model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(DirecteurEdmi)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(DirecteurEdmi, {
  //           title: 'NewDirecteurEdmi',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   directeurEdmi: Omit<DirecteurEdmi, 'id'>,
  // ): Promise<DirecteurEdmi> {
  //   return this.directeurEdmiRepository.create(directeurEdmi);
  // }

  @post('/directeur-edmis')
  @response(200, {
    description: 'DirecteurEdmi model instance',
    content: {'application/json': {schema: getModelSchemaRef(DirecteurEdmi)}},
  })
async create(
  @requestBody(CurateurRequestBody)
    newDirecteurEdmiRequest: CurCredentials,
    // DirecteurEdmi: Omit<DirecteurEdmi, 'id'>
): Promise<DirecteurEdmi> {
  const role = 'DirecteurEdmi';
  const email = newDirecteurEdmiRequest.email;
  const firstname = newDirecteurEdmiRequest.firstname;
  const lastname = newDirecteurEdmiRequest.lastname;

  // ensure a valid email value and password value
  validateCredentials(_
    .pick(newDirecteurEdmiRequest, ['email', 'password', 'firstname', 'lastname']));

  // encrypt the password
  const password = await this.passwordHasher.hashPassword(
    newDirecteurEdmiRequest.password,
  );

  try {
    // create the new user
    const savedUser = await this.directeurEdmiRepository.create(
      _.omit(newDirecteurEdmiRequest, 'password', 'email', 'firstname', 'lastname', 'role'),
    );

    // set the password
     await this.directeurEdmiRepository
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


  @get('/directeur-edmis/count')
  @response(200, {
    description: 'DirecteurEdmi model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DirecteurEdmi) where?: Where<DirecteurEdmi>,
  ): Promise<Count> {
    return this.directeurEdmiRepository.count(where);
  }

  @get('/directeur-edmis')
  @response(200, {
    description: 'Array of DirecteurEdmi model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DirecteurEdmi, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DirecteurEdmi) filter?: Filter<DirecteurEdmi>,
  ): Promise<DirecteurEdmi[]> {
    return this.directeurEdmiRepository.find({
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

  @patch('/directeur-edmis')
  @response(200, {
    description: 'DirecteurEdmi PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DirecteurEdmi, {partial: true}),
        },
      },
    })
    directeurEdmi: DirecteurEdmi,
    @param.where(DirecteurEdmi) where?: Where<DirecteurEdmi>,
  ): Promise<Count> {
    return this.directeurEdmiRepository.updateAll(directeurEdmi, where);
  }

  @get('/directeur-edmis/{id}')
  @response(200, {
    description: 'DirecteurEdmi model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DirecteurEdmi, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(DirecteurEdmi, {exclude: 'where'}) filter?: FilterExcludingWhere<DirecteurEdmi>
  ): Promise<DirecteurEdmi> {
    return this.directeurEdmiRepository.findById(id, filter);
  }

  @patch('/directeur-edmis/{id}')
  @response(204, {
    description: 'DirecteurEdmi PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DirecteurEdmi, {partial: true}),
        },
      },
    })
    directeurEdmi: DirecteurEdmi,
  ): Promise<void> {
    await this.directeurEdmiRepository.updateById(id, directeurEdmi);
  }

  @put('/directeur-edmis/{id}')
  @response(204, {
    description: 'DirecteurEdmi PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() directeurEdmi: DirecteurEdmi,
  ): Promise<void> {
    await this.directeurEdmiRepository.replaceById(id, directeurEdmi);
  }

  @del('/directeur-edmis/{id}')
  @response(204, {
    description: 'DirecteurEdmi DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.directeurEdmiRepository.deleteById(id);
  }
}

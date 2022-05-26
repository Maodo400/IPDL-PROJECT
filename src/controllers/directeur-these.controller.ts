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
import {DirecteurDeThese} from '../models';
import {CurCredentials, DirecteurDeTheseRepository} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class DirecteurTheseController {
  constructor(
    @repository(DirecteurDeTheseRepository)
    public directeurDeTheseRepository : DirecteurDeTheseRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  // @post('/directeur-de-these')
  // @response(200, {
  //   description: 'DirecteurDeThese model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(DirecteurDeThese)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(DirecteurDeThese, {
  //           title: 'NewDirecteurDeThese',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   directeurDeThese: Omit<DirecteurDeThese, 'id'>,
  // ): Promise<DirecteurDeThese> {
  //   return this.directeurDeTheseRepository.create(directeurDeThese);
  // }

  @post('/directeur-de-theses')
  @response(200, {
    description: 'DirecteurDeThese model instance',
    content: {'application/json': {schema: getModelSchemaRef(DirecteurDeThese)}},
  })
async create(
  @requestBody(CurateurRequestBody)
    newDirecteurDeTheseRequest: CurCredentials,
    // DirecteurDeThese: Omit<DirecteurDeThese, 'id'>
): Promise<DirecteurDeThese> {
  const role = 'DirecteurDeThese';
  const email = newDirecteurDeTheseRequest.email;
  const firstname = newDirecteurDeTheseRequest.firstname;
  const lastname = newDirecteurDeTheseRequest.lastname;

  // ensure a valid email value and password value
  validateCredentials(_
    .pick(newDirecteurDeTheseRequest, ['email', 'password', 'firstname', 'lastname']));

  // encrypt the password
  const password = await this.passwordHasher.hashPassword(
    newDirecteurDeTheseRequest.password,
  );

  try {
    // create the new user
    const savedUser = await this.directeurDeTheseRepository.create(
      _.omit(newDirecteurDeTheseRequest, 'password', 'email', 'firstname', 'lastname', 'role'),
    );

    // set the password
     await this.directeurDeTheseRepository
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

  @get('/directeur-de-these/count')
  @response(200, {
    description: 'DirecteurDeThese model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DirecteurDeThese) where?: Where<DirecteurDeThese>,
  ): Promise<Count> {
    return this.directeurDeTheseRepository.count(where);
  }

  @get('/directeur-de-these')
  @response(200, {
    description: 'Array of DirecteurDeThese model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DirecteurDeThese, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DirecteurDeThese) filter?: Filter<DirecteurDeThese>,
  ): Promise<DirecteurDeThese[]> {
    return this.directeurDeTheseRepository.find({
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

  @patch('/directeur-de-these')
  @response(200, {
    description: 'DirecteurDeThese PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DirecteurDeThese, {partial: true}),
        },
      },
    })
    directeurDeThese: DirecteurDeThese,
    @param.where(DirecteurDeThese) where?: Where<DirecteurDeThese>,
  ): Promise<Count> {
    return this.directeurDeTheseRepository.updateAll(directeurDeThese, where);
  }

  @get('/directeur-de-these/{id}')
  @response(200, {
    description: 'DirecteurDeThese model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DirecteurDeThese, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(DirecteurDeThese, {exclude: 'where'}) filter?: FilterExcludingWhere<DirecteurDeThese>
  ): Promise<DirecteurDeThese> {
    return this.directeurDeTheseRepository.findById(id, filter);
  }

  @patch('/directeur-de-these/{id}')
  @response(204, {
    description: 'DirecteurDeThese PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DirecteurDeThese, {partial: true}),
        },
      },
    })
    directeurDeThese: DirecteurDeThese,
  ): Promise<void> {
    await this.directeurDeTheseRepository.updateById(id, directeurDeThese);
  }

  @put('/directeur-de-these/{id}')
  @response(204, {
    description: 'DirecteurDeThese PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() directeurDeThese: DirecteurDeThese,
  ): Promise<void> {
    await this.directeurDeTheseRepository.replaceById(id, directeurDeThese);
  }

  @del('/directeur-de-these/{id}')
  @response(204, {
    description: 'DirecteurDeThese DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.directeurDeTheseRepository.deleteById(id);
  }
}

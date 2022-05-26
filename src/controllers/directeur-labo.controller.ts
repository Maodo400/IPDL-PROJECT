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
import {DirecteurLaboratoire} from '../models';
import {CurCredentials, DirecteurLaboratoireRepository} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class DirecteurLaboController {
  constructor(
    @repository(DirecteurLaboratoireRepository)
    public directeurLaboratoireRepository : DirecteurLaboratoireRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  @post('/directeur-laboratoires')
  @response(200, {
    description: 'DirecteurLaboratoire model instance',
    content: {'application/json': {schema: getModelSchemaRef(DirecteurLaboratoire)}},
  })
async create(
  @requestBody(CurateurRequestBody)
    newDirecteurLaboratoireRequest: CurCredentials,
    // DirecteurLaboratoire: Omit<DirecteurLaboratoire, 'id'>
): Promise<DirecteurLaboratoire> {
  const role = 'DirecteurLaboratoire';
  const email = newDirecteurLaboratoireRequest.email;
  const firstname = newDirecteurLaboratoireRequest.firstname;
  const lastname = newDirecteurLaboratoireRequest.lastname;

  // ensure a valid email value and password value
  validateCredentials(_
    .pick(newDirecteurLaboratoireRequest, ['email', 'password', 'firstname', 'lastname']));

  // encrypt the password
  const password = await this.passwordHasher.hashPassword(
    newDirecteurLaboratoireRequest.password,
  );

  try {
    // create the new user
    const savedUser = await this.directeurLaboratoireRepository.create(
      _.omit(newDirecteurLaboratoireRequest, 'password', 'email', 'firstname', 'lastname', 'role'),
    );

    // set the password
     await this.directeurLaboratoireRepository
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


  // @post('/directeur-laboratoires')
  // @response(200, {
  //   description: 'DirecteurLaboratoire model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(DirecteurLaboratoire)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(DirecteurLaboratoire, {
  //           title: 'NewDirecteurLaboratoire',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   directeurLaboratoire: Omit<DirecteurLaboratoire, 'id'>,
  // ): Promise<DirecteurLaboratoire> {
  //   return this.directeurLaboratoireRepository.create(directeurLaboratoire);
  // }

  @get('/directeur-laboratoires/count')
  @response(200, {
    description: 'DirecteurLaboratoire model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DirecteurLaboratoire) where?: Where<DirecteurLaboratoire>,
  ): Promise<Count> {
    return this.directeurLaboratoireRepository.count(where);
  }

  @get('/directeur-laboratoires')
  @response(200, {
    description: 'Array of DirecteurLaboratoire model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DirecteurLaboratoire, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DirecteurLaboratoire) filter?: Filter<DirecteurLaboratoire>,
  ): Promise<DirecteurLaboratoire[]> {
    return this.directeurLaboratoireRepository.find({
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

  @patch('/directeur-laboratoires')
  @response(200, {
    description: 'DirecteurLaboratoire PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DirecteurLaboratoire, {partial: true}),
        },
      },
    })
    directeurLaboratoire: DirecteurLaboratoire,
    @param.where(DirecteurLaboratoire) where?: Where<DirecteurLaboratoire>,
  ): Promise<Count> {
    return this.directeurLaboratoireRepository.updateAll(directeurLaboratoire, where);
  }

  @get('/directeur-laboratoires/{id}')
  @response(200, {
    description: 'DirecteurLaboratoire model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DirecteurLaboratoire, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(DirecteurLaboratoire, {exclude: 'where'}) filter?: FilterExcludingWhere<DirecteurLaboratoire>
  ): Promise<DirecteurLaboratoire> {
    return this.directeurLaboratoireRepository.findById(id, filter);
  }

  @patch('/directeur-laboratoires/{id}')
  @response(204, {
    description: 'DirecteurLaboratoire PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DirecteurLaboratoire, {partial: true}),
        },
      },
    })
    directeurLaboratoire: DirecteurLaboratoire,
  ): Promise<void> {
    await this.directeurLaboratoireRepository.updateById(id, directeurLaboratoire);
  }

  @put('/directeur-laboratoires/{id}')
  @response(204, {
    description: 'DirecteurLaboratoire PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() directeurLaboratoire: DirecteurLaboratoire,
  ): Promise<void> {
    await this.directeurLaboratoireRepository.replaceById(id, directeurLaboratoire);
  }

  @del('/directeur-laboratoires/{id}')
  @response(204, {
    description: 'DirecteurLaboratoire DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.directeurLaboratoireRepository.deleteById(id);
  }
}

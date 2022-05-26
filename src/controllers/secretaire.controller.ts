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
import {Secretaire} from '../models';
import {CurCredentials, SecretaireRepository} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class SecretaireController {
  constructor(
    @repository(SecretaireRepository)
    public secretaireRepository : SecretaireRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  // @post('/secretaires')
  // @response(200, {
  //   description: 'Secretaire model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Secretaire)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Secretaire, {
  //           title: 'NewSecretaire',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   secretaire: Omit<Secretaire, 'id'>,
  // ): Promise<Secretaire> {
  //   return this.secretaireRepository.create(secretaire);
  // }

  @post('/secretaires')
  @response(200, {
    description: 'Secretaire model instance',
    content: {'application/json': {schema: getModelSchemaRef(Secretaire)}},
  })
async create(
  @requestBody(CurateurRequestBody)
    newSecretaireRequest: CurCredentials,
    // Secretaire: Omit<Secretaire, 'id'>
): Promise<Secretaire> {
  const role = 'Secretaire';
  const email = newSecretaireRequest.email;
  const firstname = newSecretaireRequest.firstname;
  const lastname = newSecretaireRequest.lastname;

  // ensure a valid email value and password value
  validateCredentials(_
    .pick(newSecretaireRequest, ['email', 'password', 'firstname', 'lastname']));

  // encrypt the password
  const password = await this.passwordHasher.hashPassword(
    newSecretaireRequest.password,
  );

  try {
    // create the new user
    const savedUser = await this.secretaireRepository.create(
      _.omit(newSecretaireRequest, 'password', 'email', 'firstname', 'lastname', 'role'),
    );

    // set the password
     await this.secretaireRepository
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

  @get('/secretaires/count')
  @response(200, {
    description: 'Secretaire model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Secretaire) where?: Where<Secretaire>,
  ): Promise<Count> {
    return this.secretaireRepository.count(where);
  }

  @get('/secretaires')
  @response(200, {
    description: 'Array of Secretaire model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Secretaire, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Secretaire) filter?: Filter<Secretaire>,
  ): Promise<Secretaire[]> {
    return this.secretaireRepository.find({
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

  @patch('/secretaires')
  @response(200, {
    description: 'Secretaire PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Secretaire, {partial: true}),
        },
      },
    })
    secretaire: Secretaire,
    @param.where(Secretaire) where?: Where<Secretaire>,
  ): Promise<Count> {
    return this.secretaireRepository.updateAll(secretaire, where);
  }

  @get('/secretaires/{id}')
  @response(200, {
    description: 'Secretaire model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Secretaire, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Secretaire, {exclude: 'where'}) filter?: FilterExcludingWhere<Secretaire>
  ): Promise<Secretaire> {
    return this.secretaireRepository.findById(id, filter);
  }

  @patch('/secretaires/{id}')
  @response(204, {
    description: 'Secretaire PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Secretaire, {partial: true}),
        },
      },
    })
    secretaire: Secretaire,
  ): Promise<void> {
    await this.secretaireRepository.updateById(id, secretaire);
  }

  @put('/secretaires/{id}')
  @response(204, {
    description: 'Secretaire PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() secretaire: Secretaire,
  ): Promise<void> {
    await this.secretaireRepository.replaceById(id, secretaire);
  }

  @del('/secretaires/{id}')
  @response(204, {
    description: 'Secretaire DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.secretaireRepository.deleteById(id);
  }
}

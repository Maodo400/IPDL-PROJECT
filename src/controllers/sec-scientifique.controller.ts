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
import {SecretaireScientifique} from '../models';
import {CurCredentials, SecretaireScientifiqueRepository} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class SecScientifiqueController {
  constructor(
    @repository(SecretaireScientifiqueRepository)
    public secretaireScientifiqueRepository : SecretaireScientifiqueRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  // @post('/secretaire-scientifiques')
  // @response(200, {
  //   description: 'SecretaireScientifique model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(SecretaireScientifique)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(SecretaireScientifique, {
  //           title: 'NewSecretaireScientifique',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   secretaireScientifique: Omit<SecretaireScientifique, 'id'>,
  // ): Promise<SecretaireScientifique> {
  //   return this.secretaireScientifiqueRepository.create(secretaireScientifique);
  // }

  @post('/Secretaire-scientifiques')
  @response(200, {
    description: 'SecretaireScientifique model instance',
    content: {'application/json': {schema: getModelSchemaRef(SecretaireScientifique)}},
  })
async create(
  @requestBody(CurateurRequestBody)
    newSecretaireScientifiqueRequest: CurCredentials,
    // SecretaireScientifique: Omit<SecretaireScientifique, 'id'>
): Promise<SecretaireScientifique> {
  const role = 'SecretaireScientifique';
  const email = newSecretaireScientifiqueRequest.email;
  const firstname = newSecretaireScientifiqueRequest.firstname;
  const lastname = newSecretaireScientifiqueRequest.lastname;

  // ensure a valid email value and password value
  validateCredentials(_
    .pick(newSecretaireScientifiqueRequest, ['email', 'password', 'firstname', 'lastname']));

  // encrypt the password
  const password = await this.passwordHasher.hashPassword(
    newSecretaireScientifiqueRequest.password,
  );

  try {
    // create the new user
    const savedUser = await this.secretaireScientifiqueRepository.create(
      _.omit(newSecretaireScientifiqueRequest, 'password', 'email', 'firstname', 'lastname', 'role'),
    );

    // set the password
     await this.secretaireScientifiqueRepository
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

  @get('/secretaire-scientifiques/count')
  @response(200, {
    description: 'SecretaireScientifique model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SecretaireScientifique) where?: Where<SecretaireScientifique>,
  ): Promise<Count> {
    return this.secretaireScientifiqueRepository.count(where);
  }

  @get('/secretaire-scientifiques')
  @response(200, {
    description: 'Array of SecretaireScientifique model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SecretaireScientifique, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SecretaireScientifique) filter?: Filter<SecretaireScientifique>,
  ): Promise<SecretaireScientifique[]> {
    return this.secretaireScientifiqueRepository.find({
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

  @patch('/secretaire-scientifiques')
  @response(200, {
    description: 'SecretaireScientifique PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SecretaireScientifique, {partial: true}),
        },
      },
    })
    secretaireScientifique: SecretaireScientifique,
    @param.where(SecretaireScientifique) where?: Where<SecretaireScientifique>,
  ): Promise<Count> {
    return this.secretaireScientifiqueRepository.updateAll(secretaireScientifique, where);
  }

  @get('/secretaire-scientifiques/{id}')
  @response(200, {
    description: 'SecretaireScientifique model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SecretaireScientifique, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(SecretaireScientifique, {exclude: 'where'}) filter?: FilterExcludingWhere<SecretaireScientifique>
  ): Promise<SecretaireScientifique> {
    return this.secretaireScientifiqueRepository.findById(id, filter);
  }

  @patch('/secretaire-scientifiques/{id}')
  @response(204, {
    description: 'SecretaireScientifique PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SecretaireScientifique, {partial: true}),
        },
      },
    })
    secretaireScientifique: SecretaireScientifique,
  ): Promise<void> {
    await this.secretaireScientifiqueRepository.updateById(id, secretaireScientifique);
  }

  @put('/secretaire-scientifiques/{id}')
  @response(204, {
    description: 'SecretaireScientifique PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() secretaireScientifique: SecretaireScientifique,
  ): Promise<void> {
    await this.secretaireScientifiqueRepository.replaceById(id, secretaireScientifique);
  }

  @del('/secretaire-scientifiques/{id}')
  @response(204, {
    description: 'SecretaireScientifique DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.secretaireScientifiqueRepository.deleteById(id);
  }
}

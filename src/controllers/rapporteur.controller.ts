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
import {Rapporteur} from '../models';
import {CurCredentials, RapporteurRepository} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class RapporteurController {
  constructor(
    @repository(RapporteurRepository)
    public rapporteurRepository : RapporteurRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  // @post('/rapporteurs')
  // @response(200, {
  //   description: 'Rapporteur model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Rapporteur)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Rapporteur, {
  //           title: 'NewRapporteur',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   rapporteur: Omit<Rapporteur, 'id'>,
  // ): Promise<Rapporteur> {
  //   return this.rapporteurRepository.create(rapporteur);
  // }

  @post('/rapporteurs')
  @response(200, {
    description: 'Rapporteur model instance',
    content: {'application/json': {schema: getModelSchemaRef(Rapporteur)}},
  })
async create(
  @requestBody(CurateurRequestBody)
    newRapporteurRequest: CurCredentials,
    // Rapporteur: Omit<Rapporteur, 'id'>
): Promise<Rapporteur> {
  const role = 'Rapporteur';
  const email = newRapporteurRequest.email;
  const firstname = newRapporteurRequest.firstname;
  const lastname = newRapporteurRequest.lastname;

  // ensure a valid email value and password value
  validateCredentials(_
    .pick(newRapporteurRequest, ['email', 'password', 'firstname', 'lastname']));

  // encrypt the password
  const password = await this.passwordHasher.hashPassword(
    newRapporteurRequest.password,
  );

  try {
    // create the new user
    const savedUser = await this.rapporteurRepository.create(
      _.omit(newRapporteurRequest, 'password', 'email', 'firstname', 'lastname', 'role'),
    );

    // set the password
     await this.rapporteurRepository
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


  @get('/rapporteurs/count')
  @response(200, {
    description: 'Rapporteur model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Rapporteur) where?: Where<Rapporteur>,
  ): Promise<Count> {
    return this.rapporteurRepository.count(where);
  }

  @get('/rapporteurs')
  @response(200, {
    description: 'Array of Rapporteur model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Rapporteur, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Rapporteur) filter?: Filter<Rapporteur>,
  ): Promise<Rapporteur[]> {
    return this.rapporteurRepository.find({
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

  @patch('/rapporteurs')
  @response(200, {
    description: 'Rapporteur PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rapporteur, {partial: true}),
        },
      },
    })
    rapporteur: Rapporteur,
    @param.where(Rapporteur) where?: Where<Rapporteur>,
  ): Promise<Count> {
    return this.rapporteurRepository.updateAll(rapporteur, where);
  }

  @get('/rapporteurs/{id}')
  @response(200, {
    description: 'Rapporteur model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Rapporteur, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Rapporteur, {exclude: 'where'}) filter?: FilterExcludingWhere<Rapporteur>
  ): Promise<Rapporteur> {
    return this.rapporteurRepository.findById(id, filter);
  }

  @patch('/rapporteurs/{id}')
  @response(204, {
    description: 'Rapporteur PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rapporteur, {partial: true}),
        },
      },
    })
    rapporteur: Rapporteur,
  ): Promise<void> {
    await this.rapporteurRepository.updateById(id, rapporteur);
  }

  @put('/rapporteurs/{id}')
  @response(204, {
    description: 'Rapporteur PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() rapporteur: Rapporteur,
  ): Promise<void> {
    await this.rapporteurRepository.replaceById(id, rapporteur);
  }

  @del('/rapporteurs/{id}')
  @response(204, {
    description: 'Rapporteur DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.rapporteurRepository.deleteById(id);
  }
}

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
import {Curateur} from '../models';
import {CurateurRepository, CurCredentials} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class CurateurController {
  constructor(
    @repository(CurateurRepository)
    public curateurRepository : CurateurRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    // @inject(PasswordHasherBindings.PASSWORD_HASHER)
    // public passwordHasher: PasswordHasher,
  ) {}

  // @post('/curateurs')
  // @response(200, {
  //   description: 'Curateur model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Curateur)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Curateur, {
  //           title: 'NewCurateur',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   curateur: Omit<Curateur, 'id'>,
  // ): Promise<Curateur> {
  //   curateur.role = 'curateur';
  //   return this.curateurRepository.create(curateur);
  // }

  @post('/curateurs')
    @response(200, {
      description: 'Curateur model instance',
      content: {'application/json': {schema: getModelSchemaRef(Curateur)}},
    })
  async create(
    @requestBody(CurateurRequestBody)
      newCurateurRequest: CurCredentials,
      // curateur: Omit<Curateur, 'id'>
  ): Promise<Curateur> {
    const role = 'curateur';
    const email = newCurateurRequest.email;
    const firstname = newCurateurRequest.firstname;
    const lastname = newCurateurRequest.lastname;

    // ensure a valid email value and password value
    validateCredentials(_.pick(newCurateurRequest, ['email', 'password', 'firstname', 'lastname']));

    // encrypt the password
    const password = await this.passwordHasher.hashPassword(
      newCurateurRequest.password,
    );

    try {
      // create the new user
      const savedUser = await this.curateurRepository.create(
        _.omit(newCurateurRequest, 'password', 'email', 'firstname', 'lastname', 'role'),
      );

      // set the password
       await this.curateurRepository
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

  @get('/curateurs/count')
  @response(200, {
    description: 'Curateur model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Curateur) where?: Where<Curateur>,
  ): Promise<Count> {
    return this.curateurRepository.count(where);
  }

  @get('/curateurs')
  @response(200, {
    description: 'Array of Curateur model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Curateur, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Curateur) filter?: Filter<Curateur>,
  ): Promise<Curateur[]> {
    return this.curateurRepository.find({
      "fields": {
        "id": true,
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

  @patch('/curateurs')
  @response(200, {
    description: 'Curateur PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Curateur, {partial: true}),
        },
      },
    })
    curateur: Curateur,
    @param.where(Curateur) where?: Where<Curateur>,
  ): Promise<Count> {
    return this.curateurRepository.updateAll(curateur, where);
  }

  @get('/curateurs/{id}')
  @response(200, {
    description: 'Curateur model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Curateur, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Curateur, {exclude: 'where'}) filter?: FilterExcludingWhere<Curateur>
  ): Promise<Curateur> {
    return this.curateurRepository.findById(id, filter);
  }

  @patch('/curateurs/{id}')
  @response(204, {
    description: 'Curateur PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Curateur, {partial: true}),
        },
      },
    })
    curateur: Curateur,
  ): Promise<void> {
    await this.curateurRepository.updateById(id, curateur);
  }

  @put('/curateurs/{id}')
  @response(204, {
    description: 'Curateur PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() curateur: Curateur,
  ): Promise<void> {
    await this.curateurRepository.replaceById(id, curateur);
  }

  @del('/curateurs/{id}')
  @response(204, {
    description: 'Curateur DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.curateurRepository.deleteById(id);
  }
}

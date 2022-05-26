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
import {Recteur} from '../models';
import {CurCredentials, RecteurRepository} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class RecteurController {
  constructor(
    @repository(RecteurRepository)
    public recteurRepository : RecteurRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  // @post('/recteurs')
  // @response(200, {
  //   description: 'Recteur model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Recteur)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Recteur, {
  //           title: 'NewRecteur',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   recteur: Omit<Recteur, 'id'>,
  // ): Promise<Recteur> {
  //   return this.recteurRepository.create(recteur);
  // }

  @post('/recteurs')
  @response(200, {
    description: 'Recteur model instance',
    content: {'application/json': {schema: getModelSchemaRef(Recteur)}},
  })
async create(
  @requestBody(CurateurRequestBody)
    newRecteurRequest: CurCredentials,
    // Recteur: Omit<Recteur, 'id'>
): Promise<Recteur> {
  const role = 'Recteur';
  const email = newRecteurRequest.email;
  const firstname = newRecteurRequest.firstname;
  const lastname = newRecteurRequest.lastname;

  // ensure a valid email value and password value
  validateCredentials(_
    .pick(newRecteurRequest, ['email', 'password', 'firstname', 'lastname']));

  // encrypt the password
  const password = await this.passwordHasher.hashPassword(
    newRecteurRequest.password,
  );

  try {
    // create the new user
    const savedUser = await this.recteurRepository.create(
      _.omit(newRecteurRequest, 'password', 'email', 'firstname', 'lastname', 'role'),
    );

    // set the password
     await this.recteurRepository
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

  @get('/recteurs/count')
  @response(200, {
    description: 'Recteur model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Recteur) where?: Where<Recteur>,
  ): Promise<Count> {
    return this.recteurRepository.count(where);
  }

  @get('/recteurs')
  @response(200, {
    description: 'Array of Recteur model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Recteur, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Recteur) filter?: Filter<Recteur>,
  ): Promise<Recteur[]> {
    return this.recteurRepository.find({
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

  @patch('/recteurs')
  @response(200, {
    description: 'Recteur PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recteur, {partial: true}),
        },
      },
    })
    recteur: Recteur,
    @param.where(Recteur) where?: Where<Recteur>,
  ): Promise<Count> {
    return this.recteurRepository.updateAll(recteur, where);
  }

  @get('/recteurs/{id}')
  @response(200, {
    description: 'Recteur model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Recteur, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Recteur, {exclude: 'where'}) filter?: FilterExcludingWhere<Recteur>
  ): Promise<Recteur> {
    return this.recteurRepository.findById(id, filter);
  }

  @patch('/recteurs/{id}')
  @response(204, {
    description: 'Recteur PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recteur, {partial: true}),
        },
      },
    })
    recteur: Recteur,
  ): Promise<void> {
    await this.recteurRepository.updateById(id, recteur);
  }

  @put('/recteurs/{id}')
  @response(204, {
    description: 'Recteur PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() recteur: Recteur,
  ): Promise<void> {
    await this.recteurRepository.replaceById(id, recteur);
  }

  @del('/recteurs/{id}')
  @response(204, {
    description: 'Recteur DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.recteurRepository.deleteById(id);
  }
}

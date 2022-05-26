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
import {Doctorant} from '../models';
import {CurCredentials, DoctorantRepository} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class DoctorantController {
  constructor(
    @repository(DoctorantRepository)
    public doctorantRepository : DoctorantRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  // @post('/doctorants')
  // @response(200, {
  //   description: 'Doctorant model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Doctorant)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Doctorant, {
  //           title: 'NewDoctorant',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   doctorant: Omit<Doctorant, 'id'>,
  // ): Promise<Doctorant> {
  //   return this.doctorantRepository.create(doctorant);
  // }

  @post('/doctorants')
  @response(200, {
    description: 'Doctorant model instance',
    content: {'application/json': {schema: getModelSchemaRef(Doctorant)}},
  })
async create(
  @requestBody(CurateurRequestBody)
    newDoctorantRequest: CurCredentials,
    // Doctorant: Omit<Doctorant, 'id'>
): Promise<Doctorant> {
  const role = 'Doctorant';
  const email = newDoctorantRequest.email;
  const firstname = newDoctorantRequest.firstname;
  const lastname = newDoctorantRequest.lastname;

  // ensure a valid email value and password value
  validateCredentials(_
    .pick(newDoctorantRequest, ['email', 'password', 'firstname', 'lastname']));

  // encrypt the password
  const password = await this.passwordHasher.hashPassword(
    newDoctorantRequest.password,
  );

  try {
    // create the new user
    const savedUser = await this.doctorantRepository.create(
      _.omit(newDoctorantRequest, 'password', 'email', 'firstname', 'lastname', 'role'),
    );

    // set the password
     await this.doctorantRepository
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


  @get('/doctorants/count')
  @response(200, {
    description: 'Doctorant model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Doctorant) where?: Where<Doctorant>,
  ): Promise<Count> {
    return this.doctorantRepository.count(where);
  }

  @get('/doctorants')
  @response(200, {
    description: 'Array of Doctorant model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Doctorant, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Doctorant) filter?: Filter<Doctorant>,
  ): Promise<Doctorant[]> {
    return this.doctorantRepository.find({
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

  @patch('/doctorants')
  @response(200, {
    description: 'Doctorant PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctorant, {partial: true}),
        },
      },
    })
    doctorant: Doctorant,
    @param.where(Doctorant) where?: Where<Doctorant>,
  ): Promise<Count> {
    return this.doctorantRepository.updateAll(doctorant, where);
  }

  @get('/doctorants/{id}')
  @response(200, {
    description: 'Doctorant model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Doctorant, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Doctorant, {exclude: 'where'}) filter?: FilterExcludingWhere<Doctorant>
  ): Promise<Doctorant> {
    return this.doctorantRepository.findById(id, filter);
  }

  @patch('/doctorants/{id}')
  @response(204, {
    description: 'Doctorant PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctorant, {partial: true}),
        },
      },
    })
    doctorant: Doctorant,
  ): Promise<void> {
    await this.doctorantRepository.updateById(id, doctorant);
  }

  @put('/doctorants/{id}')
  @response(204, {
    description: 'Doctorant PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() doctorant: Doctorant,
  ): Promise<void> {
    await this.doctorantRepository.replaceById(id, doctorant);
  }

  @del('/doctorants/{id}')
  @response(204, {
    description: 'Doctorant DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.doctorantRepository.deleteById(id);
  }
}

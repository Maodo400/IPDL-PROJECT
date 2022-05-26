import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import _ from 'lodash';
import {PasswordHasherBindings} from '../keys';
import {
  DirecteurEdmi,
  User
} from '../models';
import {CurCredentials, DirecteurEdmiRepository} from '../repositories';
import {PasswordHasher, validateCredentials} from '../services';
import {CurateurRequestBody} from './specs/user-controller.specs';

export class DirecteurEdmiUserController {
  constructor(
    @repository(DirecteurEdmiRepository) protected directeurEdmiRepository: DirecteurEdmiRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) { }

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
    validateCredentials(_.pick(newDirecteurEdmiRequest, ['email', 'password', 'firstname', 'lastname']));

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

  @get('/directeur-edmis/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurEdmi has one User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User> {
    return this.directeurEdmiRepository.user(id).get(filter);
  }

  // @post('/directeur-edmis/{id}/user', {
  //   responses: {
  //     '200': {
  //       description: 'DirecteurEdmi model instance',
  //       content: {'application/json': {schema: getModelSchemaRef(User)}},
  //     },
  //   },
  // })
  // async create(
  //   @param.path.string('id') id: typeof DirecteurEdmi.prototype.id,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {
  //           title: 'NewUserInDirecteurEdmi',
  //           exclude: ['id'],
  //           optional: ['directeurEdmiId']
  //         }),
  //       },
  //     },
  //   }) user: Omit<User, 'id'>,
  // ): Promise<User> {
  //   return this.directeurEdmiRepository.user(id).create(user);
  // }

  @patch('/directeur-edmis/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurEdmi.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.directeurEdmiRepository.user(id).patch(user, where);
  }

  @del('/directeur-edmis/{id}/user', {
    responses: {
      '200': {
        description: 'DirecteurEdmi.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.directeurEdmiRepository.user(id).delete(where);
  }
}

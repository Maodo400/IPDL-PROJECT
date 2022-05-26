import {SchemaObject} from '@loopback/rest';

export const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {type: 'string'},
    email: {type: 'string'},
    name: {type: 'string'},
  },
};

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

const CurateurSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password', 'firstname', 'lastname'],
  properties: {
    firstname: {
      type: 'string',
      minLength: 3,
    },
    lastname: {
      type: 'string',
      minLength: 2,
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CurateurRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CurateurSchema},
  },
};

const ResetPasswordSchema: SchemaObject = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

export const ResetPasswordRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: ResetPasswordSchema},
  },
};

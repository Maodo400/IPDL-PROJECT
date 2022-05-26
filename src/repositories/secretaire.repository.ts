import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Secretaire, SecretaireRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class SecretaireRepository extends DefaultCrudRepository<
  Secretaire,
  typeof Secretaire.prototype.id,
  SecretaireRelations
> {

  public readonly user: HasOneRepositoryFactory<User, typeof Secretaire.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Secretaire, dataSource);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

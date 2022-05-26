import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {DirecteurDeThese, DirecteurDeTheseRelations, User, DossierAdmission} from '../models';
import {UserRepository} from './user.repository';
import {DossierAdmissionRepository} from './dossier-admission.repository';

export class DirecteurDeTheseRepository extends DefaultCrudRepository<
  DirecteurDeThese,
  typeof DirecteurDeThese.prototype.id,
  DirecteurDeTheseRelations
> {

  public readonly user: HasOneRepositoryFactory<User, typeof DirecteurDeThese.prototype.id>;

  public readonly dossierAdmissions: HasManyRepositoryFactory<DossierAdmission, typeof DirecteurDeThese.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('DossierAdmissionRepository') protected dossierAdmissionRepositoryGetter: Getter<DossierAdmissionRepository>,
  ) {
    super(DirecteurDeThese, dataSource);
    this.dossierAdmissions = this.createHasManyRepositoryFactoryFor('dossierAdmissions', dossierAdmissionRepositoryGetter,);
    this.registerInclusionResolver('dossierAdmissions', this.dossierAdmissions.inclusionResolver);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

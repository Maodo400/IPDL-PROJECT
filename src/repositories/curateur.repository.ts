import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Curateur, CurateurRelations, User, DossierSoutenance} from '../models';
import {UserRepository} from './user.repository';
import {DossierSoutenanceRepository} from './dossier-soutenance.repository';

export type CurCredentials = {
  email: string;
  password: string;
  role?: string;
  firstname: string;
  lastname: string;
};

export class CurateurRepository extends DefaultCrudRepository<
  Curateur,
  typeof Curateur.prototype.id,
  CurateurRelations
> {

  public readonly user: HasOneRepositoryFactory<User, typeof Curateur.prototype.id>;

  public readonly dossierSoutenances: HasManyRepositoryFactory<DossierSoutenance, typeof Curateur.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('DossierSoutenanceRepository') protected dossierSoutenanceRepositoryGetter: Getter<DossierSoutenanceRepository>,
  ) {
    super(Curateur, dataSource);
    this.dossierSoutenances = this.createHasManyRepositoryFactoryFor('dossierSoutenances', dossierSoutenanceRepositoryGetter,);
    this.registerInclusionResolver('dossierSoutenances', this.dossierSoutenances.inclusionResolver);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

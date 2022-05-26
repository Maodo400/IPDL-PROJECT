import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {SecretaireScientifique, SecretaireScientifiqueRelations, User, DossierSoutenance} from '../models';
import {UserRepository} from './user.repository';
import {DossierSoutenanceRepository} from './dossier-soutenance.repository';

export class SecretaireScientifiqueRepository extends DefaultCrudRepository<
  SecretaireScientifique,
  typeof SecretaireScientifique.prototype.id,
  SecretaireScientifiqueRelations
> {

  public readonly user: HasOneRepositoryFactory<User, typeof SecretaireScientifique.prototype.id>;

  public readonly dossierSoutenances: HasManyRepositoryFactory<DossierSoutenance, typeof SecretaireScientifique.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('DossierSoutenanceRepository') protected dossierSoutenanceRepositoryGetter: Getter<DossierSoutenanceRepository>,
  ) {
    super(SecretaireScientifique, dataSource);
    this.dossierSoutenances = this.createHasManyRepositoryFactoryFor('dossierSoutenances', dossierSoutenanceRepositoryGetter,);
    this.registerInclusionResolver('dossierSoutenances', this.dossierSoutenances.inclusionResolver);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {DirecteurLaboratoire, DirecteurLaboratoireRelations, User, DossierSoutenance, DossierAdmission} from '../models';
import {UserRepository} from './user.repository';
import {DossierSoutenanceRepository} from './dossier-soutenance.repository';
import {DossierAdmissionRepository} from './dossier-admission.repository';

export class DirecteurLaboratoireRepository extends DefaultCrudRepository<
  DirecteurLaboratoire,
  typeof DirecteurLaboratoire.prototype.id,
  DirecteurLaboratoireRelations
> {

  public readonly user: HasOneRepositoryFactory<User, typeof DirecteurLaboratoire.prototype.id>;

  public readonly dossierSoutenances: HasManyRepositoryFactory<DossierSoutenance, typeof DirecteurLaboratoire.prototype.id>;

  public readonly dossierAdmissions: HasManyRepositoryFactory<DossierAdmission, typeof DirecteurLaboratoire.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('DossierSoutenanceRepository') protected dossierSoutenanceRepositoryGetter: Getter<DossierSoutenanceRepository>, @repository.getter('DossierAdmissionRepository') protected dossierAdmissionRepositoryGetter: Getter<DossierAdmissionRepository>,
  ) {
    super(DirecteurLaboratoire, dataSource);
    this.dossierAdmissions = this.createHasManyRepositoryFactoryFor('dossierAdmissions', dossierAdmissionRepositoryGetter,);
    this.registerInclusionResolver('dossierAdmissions', this.dossierAdmissions.inclusionResolver);
    this.dossierSoutenances = this.createHasManyRepositoryFactoryFor('dossierSoutenances', dossierSoutenanceRepositoryGetter,);
    this.registerInclusionResolver('dossierSoutenances', this.dossierSoutenances.inclusionResolver);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

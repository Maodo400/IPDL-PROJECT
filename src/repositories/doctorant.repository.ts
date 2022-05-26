import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Doctorant, DoctorantRelations, User, DossierSoutenance, DossierInscription} from '../models';
import {UserRepository} from './user.repository';
import {DossierSoutenanceRepository} from './dossier-soutenance.repository';
import {DossierInscriptionRepository} from './dossier-inscription.repository';

export class DoctorantRepository extends DefaultCrudRepository<
  Doctorant,
  typeof Doctorant.prototype.id,
  DoctorantRelations
> {

  public readonly user: HasOneRepositoryFactory<User, typeof Doctorant.prototype.id>;

  public readonly dossierSoutenance: HasOneRepositoryFactory<DossierSoutenance, typeof Doctorant.prototype.id>;

  public readonly dossierInscription: HasOneRepositoryFactory<DossierInscription, typeof Doctorant.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('DossierSoutenanceRepository') protected dossierSoutenanceRepositoryGetter: Getter<DossierSoutenanceRepository>, @repository.getter('DossierInscriptionRepository') protected dossierInscriptionRepositoryGetter: Getter<DossierInscriptionRepository>,
  ) {
    super(Doctorant, dataSource);
    this.dossierInscription = this.createHasOneRepositoryFactoryFor('dossierInscription', dossierInscriptionRepositoryGetter);
    this.registerInclusionResolver('dossierInscription', this.dossierInscription.inclusionResolver);
    this.dossierSoutenance = this.createHasOneRepositoryFactoryFor('dossierSoutenance', dossierSoutenanceRepositoryGetter);
    this.registerInclusionResolver('dossierSoutenance', this.dossierSoutenance.inclusionResolver);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

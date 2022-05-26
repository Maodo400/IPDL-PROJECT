import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {EcoleDoctorale, EcoleDoctoraleRelations, DossierInscription, DossierAdmission, Secretaire} from '../models';
import {DossierInscriptionRepository} from './dossier-inscription.repository';
import {DossierAdmissionRepository} from './dossier-admission.repository';
import {SecretaireRepository} from './secretaire.repository';

export class EcoleDoctoraleRepository extends DefaultCrudRepository<
  EcoleDoctorale,
  typeof EcoleDoctorale.prototype.id,
  EcoleDoctoraleRelations
> {

  public readonly dossierInscriptions: HasManyRepositoryFactory<DossierInscription, typeof EcoleDoctorale.prototype.id>;

  public readonly dossierAdmissions: HasManyRepositoryFactory<DossierAdmission, typeof EcoleDoctorale.prototype.id>;

  public readonly secretaires: HasManyRepositoryFactory<Secretaire, typeof EcoleDoctorale.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('DossierInscriptionRepository') protected dossierInscriptionRepositoryGetter: Getter<DossierInscriptionRepository>, @repository.getter('DossierAdmissionRepository') protected dossierAdmissionRepositoryGetter: Getter<DossierAdmissionRepository>, @repository.getter('SecretaireRepository') protected secretaireRepositoryGetter: Getter<SecretaireRepository>,
  ) {
    super(EcoleDoctorale, dataSource);
    this.secretaires = this.createHasManyRepositoryFactoryFor('secretaires', secretaireRepositoryGetter,);
    this.registerInclusionResolver('secretaires', this.secretaires.inclusionResolver);
    this.dossierAdmissions = this.createHasManyRepositoryFactoryFor('dossierAdmissions', dossierAdmissionRepositoryGetter,);
    this.registerInclusionResolver('dossierAdmissions', this.dossierAdmissions.inclusionResolver);
    this.dossierInscriptions = this.createHasManyRepositoryFactoryFor('dossierInscriptions', dossierInscriptionRepositoryGetter,);
    this.registerInclusionResolver('dossierInscriptions', this.dossierInscriptions.inclusionResolver);
  }
}

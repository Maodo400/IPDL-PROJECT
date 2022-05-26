import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {DossierAdmission, DossierAdmissionRelations, Doctorant} from '../models';
import {DoctorantRepository} from './doctorant.repository';

export class DossierAdmissionRepository extends DefaultCrudRepository<
  DossierAdmission,
  typeof DossierAdmission.prototype.id,
  DossierAdmissionRelations
> {

  public readonly doctorants: HasManyRepositoryFactory<Doctorant, typeof DossierAdmission.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('DoctorantRepository') protected doctorantRepositoryGetter: Getter<DoctorantRepository>,
  ) {
    super(DossierAdmission, dataSource);
    this.doctorants = this.createHasManyRepositoryFactoryFor('doctorants', doctorantRepositoryGetter,);
    this.registerInclusionResolver('doctorants', this.doctorants.inclusionResolver);
  }
}

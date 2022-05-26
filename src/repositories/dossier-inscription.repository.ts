import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {DossierInscription, DossierInscriptionRelations} from '../models';

export class DossierInscriptionRepository extends DefaultCrudRepository<
  DossierInscription,
  typeof DossierInscription.prototype.id,
  DossierInscriptionRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(DossierInscription, dataSource);
  }
}

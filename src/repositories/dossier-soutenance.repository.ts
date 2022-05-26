import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {DossierSoutenance, DossierSoutenanceRelations} from '../models';

export class DossierSoutenanceRepository extends DefaultCrudRepository<
  DossierSoutenance,
  typeof DossierSoutenance.prototype.id,
  DossierSoutenanceRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(DossierSoutenance, dataSource);
  }
}

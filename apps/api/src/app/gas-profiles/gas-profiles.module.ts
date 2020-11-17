import { Module } from '@nestjs/common';

import { GasProfilesService } from './gas-profiles.service';
import { GasProfilesController } from './gas-profiles.controller';

@Module({
  imports: [],
  controllers: [GasProfilesController],
  providers: [GasProfilesService]
})
export class GasProfilesModule {}
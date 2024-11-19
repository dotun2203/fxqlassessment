import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FxqlEntry } from '../entities/fxql-entry.entity';
import { Repository, UpdateResult } from 'typeorm';
import { FxqlParserService } from '../fxql-parser.service';
import { UpdateFxqlDto } from './dto/update-fxqk.dto';

@Injectable()
export class FxqlService {
  constructor(
    @InjectRepository(FxqlEntry)
    private readonly fxqlRepository: Repository<FxqlEntry>,
    private readonly fxqlParserService: FxqlParserService,
  ) {}

  async processFxql(fxql: string): Promise<FxqlEntry[]> {
    const { entries, errors } =
      this.fxqlParserService.parseFxqlStatements(fxql);

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    const upsertPromises = entries.map(async (entry) => {
      const existingEntry = await this.fxqlRepository.findOneBy({
        sourceCurrency: entry.sourceCurrency,
        destinationCurrency: entry.destinationCurrency,
      });
      if (existingEntry) {
        Object.assign(existingEntry, entry);
        return this.fxqlRepository.save(existingEntry);
      } else {
        return this.fxqlRepository.save(entry);
      }
    });
    const savedEntries = await Promise.all(upsertPromises);
    return savedEntries;
  }

  async findAll(): Promise<FxqlEntry[]> {
    return this.fxqlRepository.find({
      where: { deletedAt: null },
      order: { EntryId: 'ASC' },
    });
  }

  async findOne(id: number): Promise<FxqlEntry | undefined> {
    return this.fxqlRepository.findOne({
      where: { EntryId: id, deletedAt: null },
    });
  }

  async update(id: number, updateFxqlDto: UpdateFxqlDto): Promise<FxqlEntry> {
    const entry = await this.fxqlRepository.findOneBy({ EntryId: id });

    if (!entry) {
      throw new NotFoundException(`FXQL statement with ID ${id} not found.`);
    }
    const updatedEntry = Object.assign(entry, updateFxqlDto);

    return this.fxqlRepository.save(updatedEntry);
  }

  async remove(id: number): Promise<void> {
    const result = await this.fxqlRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`FXQL statement with ID ${id} not found.`);
    }
  }
}
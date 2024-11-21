import { Injectable, Logger } from '@nestjs/common';
import { FxqlEntry } from './entities/fxql-entry.entity';

@Injectable()
export class FxqlParserService {
  private readonly logger = new Logger(FxqlParserService.name);

  parseFxqlStatements(fxql: string): {
    entries: FxqlEntry[];
    errors: string[];
  } {
    this.logger.debug('original FXQL:', fxql);
    fxql = fxql.replace(/\\n/g, '\n');
    const entriesMap: Map<string, FxqlEntry> = new Map();
    const errors: string[] = [];
    const statements = fxql.trim().split(/\n\s*\n/);

    if (statements.length > 1000) {
      throw new Error('Exceeded maximum of 1000 currency pairs per request.');
    }

    statements.forEach((statment, index) => {
      try {
        const entry = this.parseSingleStatement(statment, index);
        const key = `${entry.sourceCurrency}-${entry.destinationCurrency}`;
        entriesMap.set(key, entry);
        // entries.push(entry);
      } catch (error) {
        errors.push(`Statement ${index + 1}: ${error.message}`);
      }
    });
    const entries = Array.from(entriesMap.values());
    return { entries, errors };
  }

  private parseSingleStatement(
    statement: string,
    statementIndex: number,
  ): FxqlEntry {
    const lines = statement.trim().split('\n');
    this.logger.debug(`Lines in Statement ${statementIndex + 1}:`, lines);

    if (lines.length < 5) {
      // Ensure correct number of lines
      throw new Error('Incomplete FXQL statement');
    }

    const currencyPairLine = lines[0].trim();
    const currencyPairMatch = currencyPairLine.match(
      /^([A-Z]{3})-([A-Z]{3}) \{$/,
    );
    if (!currencyPairMatch) {
      throw new Error('Invalid currency pair format.');
    }
    const [, sourceCurrency, destinationCurrency] = currencyPairMatch;

    // Initialize variables
    let buyPrice: number;
    let sellPrice: number;
    let capAmount: number;

    // Parse BUY, SELL, CAP
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      this.logger.debug(`Parsing line ${i + 1}: "${line}"`);

      if (line.startsWith('BUY')) {
        const buyMatch = line.match(/^BUY ([\d.]+)$/);
        if (!buyMatch) throw new Error('Invalid BUY amount.');
        buyPrice = parseFloat(buyMatch[1]);
        if (isNaN(buyPrice) || buyPrice <= 0)
          throw new Error('Invalid BUY amount.');
      } else if (line.startsWith('SELL')) {
        const sellMatch = line.match(/^SELL ([\d.]+)$/);
        if (!sellMatch) throw new Error('Invalid SELL amount.');
        sellPrice = parseFloat(sellMatch[1]);
        if (isNaN(sellPrice) || sellPrice <= 0)
          throw new Error('Invalid SELL amount.');
      } else if (line.startsWith('CAP')) {
        const capMatch = line.match(/^CAP (\d+)$/);
        if (!capMatch) throw new Error('Invalid CAP amount.');
        capAmount = parseInt(capMatch[1], 10);
        if (isNaN(capAmount) || capAmount < 0)
          throw new Error('Invalid CAP amount.');
      } else if (line === '}') {
        this.logger.debug('End of statement detected.');
      } else {
        throw new Error(`Unexpected line: "${line}"`);
      }
    }

    if (
      buyPrice === undefined ||
      sellPrice === undefined ||
      capAmount === undefined
    ) {
      throw new Error('Missing BUY, SELL, or CAP values.');
    }

    const entry: FxqlEntry = {
      sourceCurrency: sourceCurrency,
      destinationCurrency: destinationCurrency,
      buyPrice: buyPrice,
      sellPrice: sellPrice,
      capAmount: capAmount,
      EntryId: 0,
      createdAt: undefined,
      updatedAt: undefined,
    };
    return entry;
  }
}

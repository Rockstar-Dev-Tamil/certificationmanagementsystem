import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data/mock-db.json');

function getDb() {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
}

function saveDb(db: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

class QueryBuilder {
  private table: string;
  private data: any[];
  private filters: ((item: any) => boolean)[] = [];
  private limitCount: number | null = null;
  private orderByField: string | null = null;
  private orderAsc: boolean = true;
  private headMode: boolean = false;

  constructor(table: string, data: any[]) {
    this.table = table;
    this.data = [...data];
  }

  select(query: string = '*', options?: { count?: string; head?: boolean }) {
    if (options?.head) {
        this.headMode = true;
    }
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push((item) => item[field] === value);
    return this;
  }

  neq(field: string, value: any) {
    this.filters.push((item) => item[field] !== value);
    return this;
  }

  in(field: string, values: any[]) {
    this.filters.push((item) => values.includes(item[field]));
    return this;
  }

  is(field: string, value: any) {
    this.filters.push((item) => item[field] === value);
    return this;
  }

  not(field: string, operator: string, value: any) {
      if (operator === 'is' && value === null) {
          this.filters.push((item) => item[field] !== null);
      }
      return this;
  }

  gte(field: string, value: any) {
    this.filters.push((item) => new Date(item[field]) >= new Date(value));
    return this;
  }

  lte(field: string, value: any) {
    this.filters.push((item) => new Date(item[field]) <= new Date(value));
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderByField = field;
    this.orderAsc = options?.ascending !== false;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  private execute() {
    let result = this.data;
    for (const filter of this.filters) {
      result = result.filter(filter);
    }
    if (this.orderByField) {
      result.sort((a, b) => {
        const valA = a[this.orderByField!];
        const valB = b[this.orderByField!];
        if (valA < valB) return this.orderAsc ? -1 : 1;
        if (valA > valB) return this.orderAsc ? 1 : -1;
        return 0;
      });
    }
    if (this.limitCount !== null) {
      result = result.slice(0, this.limitCount);
    }
    return result;
  }

  async single() {
    const result = this.execute();
    return { data: result[0] || null, error: null };
  }

  async insert(rows: any[]) {
    const db = getDb();
    const newRows = rows.map(r => ({ ...r, created_at: new Date().toISOString() }));
    db[this.table].push(...newRows);
    saveDb(db);
    return { data: newRows, error: null };
  }

  async update(patch: any) {
    const db = getDb();
    let count = 0;
    db[this.table] = db[this.table].map((item: any) => {
        let match = true;
        for (const filter of this.filters) {
            if (!filter(item)) match = false;
        }
        if (match) {
            count++;
            return { ...item, ...patch };
        }
        return item;
    });
    saveDb(db);
    return { data: null, error: null, count };
  }

  // Handle Promise-like await directly
  then(onfulfilled: any) {
    const result = this.execute();
    if (this.headMode) {
      return Promise.resolve({ count: result.length, error: null }).then(onfulfilled);
    }
    return Promise.resolve({ data: result, error: null }).then(onfulfilled);
  }
}

export const mockSupabase = {
  from: (table: string) => {
    const db = getDb();
    return new QueryBuilder(table, db[table] || []);
  },
  rpc: async (name: string, args: any) => {
      console.log(`RPC MOCK: ${name}`, args);
      return { data: null, error: null };
  }
};

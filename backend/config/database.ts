import path from 'path';

export default ({ env }: { env: (key: string, defaultValue?: string) => string }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', 'database', env('DATABASE_FILENAME', 'data.db')),
    },
    useNullAsDefault: true,
  },
});

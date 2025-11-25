type StrapiEnv = {
  (key: string, defaultValue?: string): string;
  int: (key: string, defaultValue?: number) => number;
  bool: (key: string, defaultValue?: boolean) => boolean;
};

export default ({ env }: { env: StrapiEnv }) => ({
  connection: {
    client: 'postgres',
    connection: (() => {
      const sslConfig = env.bool('DATABASE_SSL', false)
        ? {
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
          }
        : false;

      const databaseUrl = env('DATABASE_URL');

      if (databaseUrl) {
        return {
          connectionString: databaseUrl,
          ssl: sslConfig,
        } as const;
      }

      return {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'agencia_cheo'),
        user: env('DATABASE_USERNAME', 'postgres'),
        password: env('DATABASE_PASSWORD', 'postgres'),
        ssl: sslConfig,
      } as const;
    })(),
    debug: false,
  },
});

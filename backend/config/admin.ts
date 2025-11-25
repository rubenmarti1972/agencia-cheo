type StrapiEnv = {
  (key: string, defaultValue?: string): string;
  int: (key: string, defaultValue?: number) => number;
  bool: (key: string, defaultValue?: boolean) => boolean;
  array: (key: string, defaultValue?: string[]) => string[];
};

export default ({ env }: { env: StrapiEnv }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'someSecretKeyForAdminJWT'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'someTokenSalt'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'someTransferTokenSalt'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});

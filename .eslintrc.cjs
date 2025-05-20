module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        createDefaultProgram: true,
      },
      extends: ['plugin:@angular-eslint/recommended', 'plugin:prettier/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    },
  ],
};

import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import parser from '@typescript-eslint/parser'

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    'ignores': [
      '**/build',
      '.idea',
      'node_modules',
    ],
    files: ['*.ts'],
    'rules': {
      'no-unused-vars': 'off',
      'quotes': ['error', 'single', {
        'allowTemplateLiterals': true,
      }],
      'semi': ['error', 'never'],
      'semi-spacing': ['error', {
        'before': false,
        'after': true,
      }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'no-case-declarations': 'off',
      'no-extra-boolean-cast': 'off',
      'no-useless-catch': 'off',
      'no-constant-condition': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/ban-types': 'off',
    },
  },
]

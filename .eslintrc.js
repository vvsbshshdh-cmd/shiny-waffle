module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'no-console': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        'react/prop-types': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
import type { Rule } from 'eslint'
import { globalIgnores } from 'eslint/config'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'
import stylistic from '@stylistic/eslint-plugin'

/*
 * Кастомное правило: каждый спецификатор импорта/экспорта
 * на отдельной строке, если их два и больше.
 * В ядре ESLint такого правила нет.
 */
type NamedSpecifier = {
  loc: {
    start: { line: number }
    end: { line: number }
  }
}

const specifiersNewline: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    messages: {
      onePerLine: 'Each specifier must be on its own line.',
    },
  },
  create(context) {
    const check = (raw: unknown) => {
      const specs = raw as NamedSpecifier[]
      if (specs.length < 2) {
        return
      }
      for (let i = 1; i < specs.length; i++) {
        const prev = specs[i - 1]
        const curr = specs[i]
        if (prev.loc.end.line === curr.loc.start.line) {
          const node = curr as unknown as Rule.Node
          context.report({
            node,
            messageId: 'onePerLine',
            fix: fixer => fixer.insertTextBefore(
              node,
              '\n',
            ),
          })
        }
      }
    }

    return {
      ImportDeclaration: node => check(node.specifiers),
      ExportNamedDeclaration: node => check(node.specifiers),
    }
  },
}

/*
 * Кастомное правило: схлопывает скобки в одну строку,
 * когда внутри пусто или одиночная деструктуризация.
 */
const compactBrackets: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    messages: {
      compact: 'Brackets must stay on one line.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode

    const check = (node: Rule.Node, shouldCollapse: boolean) => {
      if (!shouldCollapse) {
        return
      }
      const open = sourceCode.getFirstToken(node)
      const close = sourceCode.getLastToken(node)
      if (!open || !close || open.loc.end.line === close.loc.start.line) {
        return
      }
      context.report({
        node,
        messageId: 'compact',
        fix: fixer => fixer.replaceTextRange(
          [
            open.range[1],
            close.range[0],
          ],
          '',
        ),
      })
    }

    return {
      ArrayExpression: node => check(
        node,
        node.elements.length === 0,
      ),
      ObjectExpression: node => check(
        node,
        node.properties.length === 0,
      ),
      ObjectPattern: node => check(
        node,
        node.properties.length < 2,
      ),
    }
  },
}

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: [
      '**/*.{vue,ts,mts,tsx}',
    ],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
  ]),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,

  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: true,
  }),

  {
    name: 'app/custom-formatting',
    plugins: {
      custom: {
        rules: {
          'specifiers-newline': specifiersNewline,
          'compact-brackets': compactBrackets,
        },
      },
    },
    rules: {
      'custom/specifiers-newline': 'error',
      'custom/compact-brackets': 'error',

      'object-property-newline': [
        'error',
        {
          allowAllPropertiesOnSameLine: false,
        },
      ],
      'object-curly-newline': [
        'error',
        {
          ObjectExpression: {
            minProperties: 1,
          },
          ObjectPattern: {
            minProperties: 2,
          },
          ImportDeclaration: {
            minProperties: 2,
          },
          ExportDeclaration: {
            minProperties: 2,
          },
        },
      ],
      'array-element-newline': [
        'error',
        'always',
      ],
      'array-bracket-newline': [
        'error',
        {
          minItems: 1,
        },
      ],
      'function-call-argument-newline': [
        'error',
        'always',
      ],
      'function-paren-newline': [
        'error',
        'multiline',
      ],
    },
  },

  {
    name: 'app/custom-vue-formatting',
    files: [
      '**/*.vue',
    ],
    rules: {
      'vue/html-indent': [
        'error',
        2,
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 1,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'beside',
          multiline: 'below',
        },
      ],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
        },
      ],
      'vue/multiline-html-element-content-newline': 'error',
    },
  },
)

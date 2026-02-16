import { TestCaseStep } from '@/types/test-case'

export const DEFAULT_TEST_CASE_STEP: TestCaseStep = {
  command: '',
  selector: '',
  value: '',
  lengthValue: '',
  containedText: '',
  equalText: '',
  chainOption: '',
}

export const CYPRESS_COMMANDS = [
  { value: 'visit', hasSelector: false, hasValue: true },
  { value: 'get', hasSelector: true, hasValue: false, hasChainOptions: true },
  { value: 'contains', hasSelector: true, hasValue: true },
  { value: 'click', hasSelector: false, hasValue: false },
  { value: 'type', hasSelector: false, hasValue: true },
  { value: 'check', hasSelector: false, hasValue: false },
  { value: 'uncheck', hasSelector: false, hasValue: false },
  { value: 'select', hasSelector: false, hasValue: true },
  { value: 'blur', hasSelector: false, hasValue: false },
  { value: 'title', hasSelector: false, hasValue: false },
  { value: 'url', hasSelector: false, hasValue: false },
  { value: 'reload', hasSelector: false, hasValue: false },
  { value: 'screenshot', hasSelector: false, hasValue: true },
  {
    value: 'should',
    hasSelector: false,
    hasValue: true,
    hasShouldOptions: true,
  },
  {
    value: 'and',
    hasSelector: false,
    hasValue: true,
    hasShouldOptions: true,
  },
]

export const SHOULD_OPTIONS = [
  'be.visible',
  'not.be.visible',
  'exist',
  'not.exist',
  'be.enabled',
  'not.be.enabled',
  'be.disabled',
  'not.be.disabled',
  'be.focused',
  'not.be.focused',
  'have.length',
  'be.checked',
  'not.be.checked',
  'contain',
  'not.contain',
  'be.equal',
  'not.be.equal',
]

export const CHAIN_OPTIONS = ['first', 'second', 'third', 'last']

<script setup lang="ts">
import { createValidatorPipe, whitelist, applyTransaction, InputValidator } from '@renderer/directives/InputValidator/inputValidator.js'

const model = defineModel()
const props = withDefaults(defineProps<{
    disabled?: boolean
    minValue?: number,
    maxValue?: number,
    minFractionDigits?: number,
    maxFractionDigits?: number,
}>(), {
    disabled: false,
    minValue: undefined,
    maxValue: undefined,
    minFractionDigits: -1,
    maxFractionDigits: -1,
})

const preventEmptyDeletion: InputValidator = (_, context) => {
  if (context.inputType === 'deleteContentBackward' && (context.caretPosition.initStart === 0 && context.caretPosition.initEnd === 0)) {
    context.prevent()
  }
  if (context.inputType === 'deleteContentForward' && (context.caretPosition.initStart === context.currValue.length)) {
    context.prevent()
  }
}
const preventCommaDeletion: InputValidator = (_, context) => {
  if (props.minFractionDigits <= 0) {
    return
  }
  if (context.replacedValue.includes(',') && context.replacedValue !== context.oldValue) {
    context.prevent()
  }
}
const handleCommaInput: InputValidator = (transaction, context) => {
  if (context.data !== ',') { return }
  if (context.oldValue.includes(',')) {
    const index = context.oldValue.lastIndexOf(',') 
    transaction.value = context.oldValue
    context.caretPosition.set(index + 1)
    context.accept()
  }
  console.log(transaction.value)
  if (transaction.value.endsWith(',')) {
    transaction.value += '0',
    transaction.caretEnd += 1
  }
  console.log(transaction.value)
}
const constrainMinFractionDigits: InputValidator = (transaction, context) => {
  if (props.minFractionDigits <= 0) { return }
  if ((context.data !== null && context.data !== '0') || context.caretPosition.initStart < context.oldValue.length) {
    transaction.value = transaction.value.replaceAll(/0+$/g, '')
  }
  if (!context.currValue.includes(',')) {
    transaction.value = `${context.currValue},${'0'.repeat(props.minFractionDigits)}`
  } else {
    const split = transaction.value.split(',')
    const last = split.pop()?.padEnd(props.minFractionDigits, '0')
    transaction.value = `${[...split, last].join(',')}`
  }
}
const constrainMaxFractionDigits: InputValidator = (transaction, context) => {
  if (props.maxFractionDigits >= 0 && context.currValue.includes(',')) {
    const split = transaction.value.split(',')
    const last = split.pop()?.slice(0, props.maxFractionDigits)
    transaction.value = `${[...split, last].join(',')}`
  }
}
const replaceFirstZero: InputValidator = (transaction, context) => {
  const split = context.oldValue.split(',')
  if (context.caretPosition.initStart <= 1 && split.shift() === '0' && /\d/.test(context.data ?? '')) {
    transaction.value = `${[context.data, ...split].join(',')}`
    transaction.caretStart = 1
    transaction.caretEnd = 1
  }
}
const forceNonNull: InputValidator = (transaction) => {
  const split = transaction.value.split(',')
  if (split.shift() === '') {
    transaction.value = `${['0', ...split].join(',')}`
  }
}

const pipe = createValidatorPipe(
  whitelist(/[\d,-]+/),
  preventEmptyDeletion,
  preventCommaDeletion,
  handleCommaInput,
  constrainMinFractionDigits,
  constrainMaxFractionDigits,
  replaceFirstZero,
  forceNonNull,
  applyTransaction,
)
</script>

<template>
  <input v-model="model" :disabled="disabled" v-validate-input="pipe"/><br/>
</template>

<style>

</style>
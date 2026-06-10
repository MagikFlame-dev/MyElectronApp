import { reactive, MaybeRefOrGetter, isRef } from "vue";
import { InputValidatorPipe, IInputValidator } from "./inputValidator.base.js";

/**
 * only allows the given values to be used as input.
 * this does not prevent 'null' inputs!
 * @param values a list of valid inputs
 */
const whitelist = (...values: (string | RegExp)[]): IInputValidator => {
  return function(_, context) {
    if (context.data !== null && !values.some(val => val instanceof RegExp ? val.test(context.data ?? '') : context.data === val)) {
      context.prevent()
    }
  }
}

/**
 * prevents the given inputs from taking effect
 * @param values a list of invalid inputs
 */
const blacklist = (...values: (string | RegExp | null)[]): IInputValidator => {
  return function(_, context) {
    if (values.some(val => val instanceof RegExp ? val.test(context.data ?? '') : context.data === val)) {
      context.prevent()
    }
  }
}

/**
 * runs a subpipe if the give condition is met
 */
const conditional = (valid: MaybeRefOrGetter<boolean> | ((...params: Parameters<InputValidator>) => boolean), ...pipes: IInputValidator[]): IInputValidator => {
  return function(transaction, context) {
    if (typeof valid === 'boolean' ? valid : isRef(valid) ? valid.value : valid(transaction, context)) {
      for (const validator of pipes) {
        Object.assign(transaction, validator(transaction, context) ?? {})
        context.applyTransaction(transaction)
        if (InputValidatorPipe.isStopped(context)) {break}
      }
      return transaction
    }
    return
  }
}

/**
 * stops the pipe and applies the default HTML behavior
 */
const useDefault: IInputValidator = (_, context) => context.cancel()

/**
 * stops the pipe and prevents the default HTML behavior
 */
const preventInput: InputValidator = (_, context) => context.prevent()

/**
 * stops the pipe and applies the current transaction values,
 * only use this if you made changes to the transaction, otherwise use the default HTML behavior as that is less prone to errors
 */
const applyTransaction: InputValidator = (_, context) => context.accept()

/**
 * This function can be used in an InputValidatorPipe
 * @param transaction the current transaction values, consisting of the values calculated by the previous transactions
 * @param context the pipe context this holds default data and exposes some usefull functions for input and caret manipulation
 * @returns either void, or a transaction object, with new transaction data for the next pipe, if void is returned, the next pipe will receive the current transaction instance!
 */
type InputValidator = IInputValidator

/** creates an input validator pipe wich exposes a process function, wich can be used to process onbeforeinput events of Input and 'contenteditable' HTML elements 
 * @chain output((output: string) => void) - receives the output after all pipes have run
 * @chain catch((error: Error) => void) - gets called once for every error that has been pushed by the pipes
 * @chain finaly(() => void) - is called once after all pipes have been run and erros have been handled
 * @returns an InputValidatorPipe, wich can be used to process input and contendeditable elements
*/
function createValidatorPipe(...params: ConstructorParameters<typeof InputValidatorPipe>): InputValidatorPipe {
  return reactive(new InputValidatorPipe(...params).catch(error => console.error(error))) as InputValidatorPipe
}

export { createValidatorPipe, whitelist, blacklist, conditional, useDefault, applyTransaction, preventInput, type InputValidator }
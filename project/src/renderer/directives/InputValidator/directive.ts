import { Directive } from "vue"
import { InputValidatorPipe } from "./inputValidator.base.js"

type ValidateDirective = Directive<HTMLElement, InputValidatorPipe>
const inputValidatorCallbacks = new Map<HTMLElement, EventListenerOrEventListenerObject>() 
const InputValidatorDirective: ValidateDirective = {
    beforeMount(el, binding) {
        const callback: EventListenerOrEventListenerObject = ($event: Event) => binding.value.process($event as InputEvent)
        el.addEventListener('beforeinput', callback)
        el.dispatchEvent(new InputEvent('beforeinput'))
        inputValidatorCallbacks.set(el, callback)
    },
    beforeUnmount(el) {
        if (inputValidatorCallbacks.has(el)) {
            el.removeEventListener('beforeinput', inputValidatorCallbacks.get(el)!)
        }
    },
}

declare module 'vue' {
    export interface GlobalDirectives {
        vValidateInput: ValidateDirective
    }
}
export default InputValidatorDirective satisfies ValidateDirective
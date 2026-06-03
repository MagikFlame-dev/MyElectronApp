<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { interpreter, lexer, parser } from './ParserTest.js';
import { ASTNode } from '@renderer/scripts/parser.js';
import { IToken } from '@renderer/scripts/lexer.js';

onMounted(() => {
    window.addEventListener('keydown', onWindowKeyDown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', onWindowKeyDown)
})

const rollingIntervall = ref<number>(NaN)
const intervallTimeout =ref<number>(NaN)

function onWindowKeyDown($event: KeyboardEvent) {
    if ($event.ctrlKey && $event.code === 'Space') {
        window.clearInterval(rollingIntervall.value)
        window.clearTimeout(intervallTimeout.value)

        rollingIntervall.value = window.setInterval(() => {
            result.value = ast.value ? interpreter.interpret(ast.value) : 0
        }, 100 + Math.random() * 100)

        intervallTimeout.value = window.setTimeout(() => {
            window.clearInterval(rollingIntervall.value)    
        }, 500)
    }
}

const outerText = ref<string>('')
defineModel<string>('text', {
    default: '',
    get: (): string => innerHTML.value,
    set: (val: string) => innerHTML.value = val
})

const innerHTML = ref<string>('')
function onInput($event: InputEvent) {
    const target = $event.target as HTMLDivElement
    innerHTML.value = target.innerHTML
    outerText.value = target.innerText
}

const tokens = computed<IToken<any>[]>(() => {
    try {
        return lexer.analyse(outerText.value)
    } catch (error) {
        console.error(error)
        return []
    }
})

const ast = computed<ASTNode<any, any> | undefined>(() => {
    try {
        return parser.parse(tokens.value)
    } catch (error) {
        console.error(error)
        return undefined
    }
})

const result = ref<number>(ast.value ? interpreter.interpret(ast.value) : 0)

type TOutputDisplayOptions = 'raw' | 'tokens' | 'tree' | 'result'
const outputDisplayOption = ref<TOutputDisplayOptions>('tokens')
</script>

<template>
    <div class="parser-test-workspace">
        <div class="tool-container">
            <menu class="tool-menu">
                <form>
                    Output:
                    <input type="radio" id="display-raw" value="raw" v-model="outputDisplayOption">
                    <label for="display-raw">Raw</label>
                    <input type="radio" id="display-tokens" value="tokens" v-model="outputDisplayOption">
                    <label for="display-tokens">Tokens</label>
                    <input type="radio" id="display-tree" value="tree" v-model="outputDisplayOption">
                    <label for="display-tree">Tree</label>
                    <input type="radio" id="display-compiled" value="result" v-model="outputDisplayOption">
                    <label for="display-compiled">Interpreted</label>
                </form>
            </menu>
        </div>
        <div class="input-container">
            <div class="input" contenteditable @input="onInput"></div>
        </div>
        <div class="outlet-container">
            <pre v-if="outputDisplayOption === 'result'" class="outlet result" v-text="result"></pre>
            <pre v-else-if="outputDisplayOption === 'tree'" class="outlet tree" v-text="ast ?? 'ERROR'"></pre>
            <pre v-else-if="outputDisplayOption === 'tokens'" class="outlet tokens" v-text="tokens.map(token => `${token}`)"></pre>
            <pre v-else class="outlet" v-text="outerText"></pre>
        </div>
    </div>
</template>

<style lang="less" scoped>
.parser-test-workspace {
    position: absolute;

    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;

    display: grid;
    grid-template-columns:
        50% 50%;
    grid-template-rows:
        min-content
        auto;
    grid-template-areas: 
        't t'
        'i o';

    > * {
        border: 1px solid var(--border-color);
    }

    .tool-container {
        grid-area: t;
        .tool-menu {
            padding: 0px;
            margin: 0px;
            display: flex;
        }
    }

    .input-container {
        grid-area: i;
        overflow: auto;
        .input {
            width: 100%;
            height: 100%;
            outline: none;
        }
    }

    .outlet-container {
        grid-area: o;
        overflow: auto;
        .outlet {
            max-width: 100%;
            height: 100%;
            word-wrap: break-word;
            text-wrap: wrap;
        }
    }
}
</style>
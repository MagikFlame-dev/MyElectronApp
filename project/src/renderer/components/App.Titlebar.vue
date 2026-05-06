<script setup lang="ts">
import { AppPreferences } from '@renderer/App.preferences.js';

const onCloseButtonClicked = () => {
}
const onUnmaximizeButtonClicked = () => {
}
const onMaximizeButtonClicked = () => {
}
const onMinimizeButtonClicked = () => {
}

</script>

<template>
    <span class="titlebar">
        <span class="titlebar-region start">
            {{ AppPreferences.title }}
        </span>
        <span class="titlebar-region center">
            <span class="titlebar-input-container">
                <input class="titlebar-input search">
                <span class="titlebar-input-suffix"></span>
            </span>
        </span>
        <span class="titlebar-region end">
            <button class="titlebar-button minimize" @click="onMinimizeButtonClicked()">
                m
            </button>
            <button class="titlebar-button maximize" @click="onMaximizeButtonClicked()">
                M
            </button>
            <button class="titlebar-button unmaximize" @click="onUnmaximizeButtonClicked()">
                R
            </button>
            <button class="titlebar-button close" @click="onCloseButtonClicked()">
                X
            </button>
        </span>
    </span>
</template>

<style scoped lang="less">
.titlebar {
    display: flex;
    justify-content: space-between;
    .titlebar-region {
        display: flex;
        align-self: stretch;
        &.start {
            flex-basis: 50%;
            justify-content: flex-start;
        }
        &.center {
            flex-basis: 100%;
            justify-content: center;
        }
        &.end {
            flex-basis: 50%;
            justify-content: flex-end;
        }
    }
    .titlebar-input-container {
        position: relative;
        margin: 0.25em;
        .titlebar-input {
            all: unset;
            transition: all ease-in-out 200ms;
            align-self: stretch;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            padding-block: 0.25em;
            text-align: left;
            padding-inline: 0.5em;
            padding-inline-end: 1.5em;
            align-items: center;
        }
        .titlebar-input-suffix {
            position: absolute;
            right: 0.25em;
            top: 0px;
            height: 100%;
            width: 1em;
            text-align: center;
            align-content: center;
        }
    }

    .titlebar-button {
        all: unset;
        transition: all ease-in-out 200ms;
        align-self: stretch;
        width: 1.5rem;
        height: 2rem;
        pointer-events: all;
        text-align: center;
        align-items: center;
    }
    .titlebar-button:hover {
        background-color: var(--pallete-4);
        color: black;
    }
    .titlebar-button.close:hover {
        background-color: red;
        color: white;
    }
}

</style>
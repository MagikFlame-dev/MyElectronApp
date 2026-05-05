import { BrowserWindow, ipcMain } from "electron";
import { Channels } from "./index.ipc-channels.js";

export class IPCWindowControls {
    static init(win: BrowserWindow) {
        ipcMain.on(Channels.window.in.Close, () => {
            win.close()
        })
        ipcMain.on(Channels.window.in.Minimize, () => {
            win.minimize()
        })
        ipcMain.on(Channels.window.in.ToggleMaximize, () => {
            if (win.isMaximized()) {
                win.restore()
            } else {
                win.maximize()
            }
        })
        ipcMain.on(Channels.window.in.ToggleFullscreen, () => {
            if (win.isFullScreen()) {
                win.setFullScreen(false)
            } else {
                win.setFullScreen(true)
            }
        })

        win.addListener('enter-full-screen', () => {
            ipcMain.emit(Channels.window.out.ToggledFullscreen, true)
        })
        win.addListener('leave-full-screen', () => {
            ipcMain.emit(Channels.window.out.ToggledFullscreen, false)
        })
        win.addListener('minimize', () => {
            ipcMain.emit(Channels.window.out.Minimized, true)
        })
        win.addListener('maximize', () => {
            ipcMain.emit(Channels.window.out.ToggledMaximized, true)
        })
        win.addListener('restore', () => {
            ipcMain.emit(Channels.window.out.ToggledMaximized, false)
        })
        win.addListener('unmaximize', () => {
            ipcMain.emit(Channels.window.out.ToggledMaximized, false)
        })
    }
}
import { BrowserWindow, ipcMain } from "electron";

enum ChannelsIn {
    Close = 'window-close',
    Minimize = 'window-minimize',
    ToggleMaximize = 'window-toggle-maximize',
    ToggleFullscreen = 'window-toggle-fullscreen',
    GetFullScreen = 'window-get-full-screen',
    GetMaximized = 'window-get_maximized',
}
enum ChannelsOut {
    Closed = 'window-closed',
    Minimized = 'window-minimized',
    ToggledMaximize = 'window-toggled-maximize',
    ToggledFullscreen = 'window-toggled-fullscreen',
}

export class IPCWindowControls {    
    static init(win: BrowserWindow) {
        ipcMain.on(ChannelsIn.Close, () => {
            win.close()
        })
        ipcMain.on(ChannelsIn.Minimize, () => {
            win.minimize()
        })
        ipcMain.on(ChannelsIn.ToggleMaximize, () => {
            if (win.isMaximized()) {
                win.restore()
            } else {
                win.maximize()
            }
        })
        ipcMain.on(ChannelsIn.ToggleFullscreen, () => {
            if (win.isFullScreen()) {
                win.setFullScreen(false)
            } else {
                win.setFullScreen(true)
            }
        })

        win.addListener('enter-full-screen', () => {
            ipcMain.emit(ChannelsOut.ToggledFullscreen, true)
        })
        win.addListener('leave-full-screen', () => {
            ipcMain.emit(ChannelsOut.ToggledFullscreen, false)
        })
        win.addListener('minimize', () => {
            ipcMain.emit(ChannelsOut.Minimized, true)
        })
        win.addListener('maximize', () => {
            ipcMain.emit(ChannelsOut.ToggledMaximize, true)
        })
        win.addListener('restore', () => {
            ipcMain.emit(ChannelsOut.ToggledMaximize, false)
        })
    }
}
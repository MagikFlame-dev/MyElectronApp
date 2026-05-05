// #TODO
// this file has to be synchronous with the ipc channel declarations in the main process
// someone should write a script to automate that!

enum WinChannelsIn {
  Close = 'window-close',
  Minimize = 'window-minimize',
  ToggleMaximize = 'window-toggle-maximize',
  ToggleFullscreen = 'window-toggle-fullscreen',
  GetFullScreen = 'window-get-full-screen',
  GetMaximized = 'window-get_maximized',
}
enum WinChannelsOut {
  Closed = 'window-closed',
  Minimized = 'window-minimized',
  ToggledMaximized = 'window-toggled-maximize',
  ToggledFullscreen = 'window-toggled-fullscreen',
}

export class Channels {
  static readonly window = {
    in: WinChannelsIn,
    out: WinChannelsOut,
  }
}
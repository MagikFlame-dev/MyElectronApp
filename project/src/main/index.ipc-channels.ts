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
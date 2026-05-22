import { Component, markRaw } from "vue"
import { ReactiveComponentProps } from "./helper.js"

export class AppLayoutTree {
  public readonly root: AppLayoutRoot

  constructor(...panels: AppLayoutBase[]) {
    this.root = new AppLayoutRoot('row', ...panels)
  }

  public getByID(id: string): AppLayoutBase | undefined {
    return this.root.find((panel) => panel.ID === id)
  }
  public find(cb: (panel: AppLayoutBase) => boolean) {
    return this.root.find(cb)
  }
}

export abstract class AppLayoutBase {
  static isPanel(o?: AppLayoutBase): o is AppLayoutPanel<any> {
    return !!(o as AppLayoutPanel<any>).component
  }
  static isSplit(o?: AppLayoutBase): o is AppLayoutSplit {
    return !!(o as AppLayoutSplit).panels
  }
  static isRoot(o?: AppLayoutBase): o is AppLayoutRoot {
    return !!(o as AppLayoutRoot).isRoot
  }

  private static idCounter = 0
  private static get nextID(): string { return `#${(AppLayoutBase.idCounter++).toString(16).padStart(8, '0')}` }
  
  public readonly ID: string
  public parent?: AppLayoutBase

  constructor() {
    this.parent = undefined
    this.ID = AppLayoutBase.nextID
  }

  setParent(parent: AppLayoutBase | undefined): typeof this {
    this.parent = parent
    return this
  }

  addChild(...panels: AppLayoutBase[]): this {
    if (panels.length === 0) {
      return this
    }
    if (AppLayoutBase.isPanel(this)) {
      this.convertToSplit()?.addChild(...panels)
    }
    else if (AppLayoutBase.isSplit(this)) {
      this.panels.push(...panels)
      panels.forEach(p => p.setParent(this))
    }
    return this
  }

  hasChild(panel: AppLayoutBase): boolean {
    if (AppLayoutBase.isSplit(this)) {
      return this.panels.includes(panel)
    }
    return false
  }

  findId(id: string): AppLayoutBase | undefined {
    return this.find((panel) => panel.ID === id)
  }

  find(cb: (panel: AppLayoutBase) => boolean): AppLayoutBase | undefined {
    if (cb(this)) {
      return this
    }
    if (AppLayoutBase.isSplit(this)) {
      for (let panel of this.panels) {
        const found = panel.find(cb)
        if (!!found) {
          return found
        }
      }
    }
    return undefined
  }

}

export class AppLayoutPanel<C extends Component = Component> extends AppLayoutBase {
  public component: C
  public props: ReactiveComponentProps<C>

  constructor(component: C, props: ReactiveComponentProps<C>) {
    super()
    this.component = markRaw(component)
    this.props = props
  }

  convertToSplit(direction?: AppLayoutSplit['direction']): AppLayoutSplit | undefined {
    if (!this.parent || !AppLayoutBase.isSplit(this.parent)) {
      return undefined
    }

    const newSplit = new AppLayoutSplit(direction ?? this.parent.getOppositeDirection())
    .setParent(this.parent)

    this.parent.panels.splice(this.parent.panels.indexOf(this), 1, newSplit)
    this.setParent(newSplit)

    return newSplit
  }

  isComponentPanel<T extends C>(comp: T): this is AppLayoutPanel<T> {
    return this.component === comp
  }
}

export class AppLayoutSplit extends AppLayoutBase {
  public direction: 'row' | 'column';
  public readonly panels: AppLayoutBase[]
  
  constructor(direction: AppLayoutSplit['direction'], ...panels: AppLayoutBase[]) {
    super()
    this.direction = direction
    this.panels = panels
  }

  getOppositeDirection(): AppLayoutSplit['direction'] {
    switch (this.direction) {
      case 'column': return 'row';
      case 'row': return 'column'
    }
  }
}

export class AppLayoutRoot extends AppLayoutSplit {
  readonly isRoot: boolean = true
  readonly meta: any

  constructor(direction?: AppLayoutRoot['direction'], ...panels: AppLayoutBase[]) {
    super(direction ?? 'row', ...panels)
  }
}
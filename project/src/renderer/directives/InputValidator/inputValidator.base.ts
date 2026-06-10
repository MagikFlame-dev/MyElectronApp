// #region types
type TInputTypes
  = 'insertText'
  | 'insertReplacementText'
  | 'insertLineBreak'
  | 'insertParagraph'
  | 'insertOrderedList'
  | 'insertUnorderedList'
  | 'insertHorizontalRule'
  | 'insertFromYank'
  | 'insertFromDrop'
  | 'insertFromPaste'
  | 'insertTranspose'
  | 'insertCompositionText'
  | 'insertFromComposition'
  | 'insertLink'
  | 'deleteByComposition'
  | 'deleteCompositionText'
  | 'deleteWordBackward'
  | 'deleteWordForward'
  | 'deleteSoftLineBackward'
  | 'deleteSoftLineForward'
  | 'deleteEntireSoftLine'
  | 'deleteHardLineBackward'
  | 'deleteHardLineForward'
  | 'deleteByDrag'
  | 'deleteByCut'
  | 'deleteByContent'
  | 'deleteContentBackward'
  | 'deleteContentForward'
  | 'historyUndo'
  | 'historyRedo'
  | 'formatBold'
  | 'formatItalic'
  | 'formatUnderline'
  | 'formatStrikethrough'
  | 'formatSuperscript'
  | 'formatSubscript'
  | 'formatJustifyFull'
  | 'formatJustifyCenter'
  | 'formatJustifyRight'
  | 'formatJustifyLeft'
  | 'formatIndent'
  | 'formatOutdent'
  | 'formatRemove'
  | 'formatSetBlockTextDirection'
  | 'formatSetInlineTextDirection'
  | 'formatBackColor'
  | 'formatFontColor'
  | 'formatFontName'

type CustomContext<T> = Partial<T> & {[key: string]: unknown}
// #endregion

// #region interfaces
interface IInputValidatorContext<T extends object = any> {
  readonly $event: InputEvent,
  readonly target: HTMLElement,

  readonly oldValue: string,
  readonly currValue: string,
  readonly replacedValue: string,

  readonly ranges: ReturnType<InputEvent['getTargetRanges']>
  readonly targetRange?: IInputValidatorContext<T>['ranges'][number]

  readonly inputType: TInputTypes | (InputEvent['inputType'] & {}),
  readonly data: string | null,

  readonly canceled: boolean,
  readonly prevented: boolean,
  readonly accepted: boolean,

  readonly customContext: CustomContext<T>

  pushError(error: string, msg?: string): void,
  readErrors(): Map<string, Error>

  cancel(): void,
  prevent(): void,
  accept(): void,

  computedValue(): string,
  computedCaretStart(): number,
  computedCaretEnd(): number,

  applyTransaction(transaction: IInputTransaction): void

  readonly caretPosition: IInputCaretPosition
}

interface IInputTransactionFactory {
  createTransaction(): IInputTransaction
}

interface IInputTransaction {
  value: string;
  caretStart: number;
  caretEnd: number;
}

interface IInputCaretPosition {
  readonly initStart: number
  readonly initEnd: number
  readonly start: number,
  readonly end: number,
  readonly collapsed: boolean,
  collapse(toStart: boolean): void,
  offset(by: number): void,
  set(start: number, end?: number): void
}

interface IInputValidator {
  (transaction: IInputTransaction, context: IInputValidatorContext): IInputTransaction | void
}
// #endregion

// #region helper
function createContext<T extends object = any>($event: InputEvent): IInputValidatorContext<T> & IInputTransactionFactory {
  if ($event.target instanceof HTMLInputElement) {
    return new InputValidatorInputElementContext<T>($event)
  }
  return new InputValidatorDefaultContext<T>($event)
}
// #endregion

// #region classes
class InputValidatorPipe {
  protected validator: IInputValidator[]
  protected onError?: (error: Error) => void
  protected onApply?: (error: string, data?: unknown) => void
  protected onFinaly?: () => void

  constructor(...validator: IInputValidator[]) {
    this.validator = validator
  }

  public catch(onError: (error: Error) => void): InputValidatorPipe {
    this.onError = onError
    return this
  }

  public output(onApply: (output: string) => void): InputValidatorPipe {
    this.onApply = onApply
    return this
  }

  public finaly(onFinaly: () => void): InputValidatorPipe {
    this.onFinaly = onFinaly
    return this
  }

  public process($event: InputEvent) {
    try {
      const context: IInputValidatorContext & IInputTransactionFactory = createContext($event)
      let transaction = context.createTransaction()
      for (const validator of this.validator) {
        const pre = transaction.value
        Object.assign(transaction, validator(transaction, context) ?? {})
        context.applyTransaction(transaction)
        console.log(validator.name, pre, '>>>', transaction.value);
        if (InputValidatorPipe.isStopped(context)) {break}
      }
      const errors = context.readErrors()
      if ((errors.size > 0) && (this.onError !== undefined)) {
        for (const e of errors.keys()) {
          this.onError(errors.get(e) ?? new Error(e))
        }
      }
      if (context.prevented) {
        return $event.preventDefault()
      }
      if (!context.canceled) {
        this.apply(context)
      }
    } catch (error: any) {
      if (this.onError) {
        this.onError(error)
      }
    }
    if (this.onFinaly) {
      this.onFinaly()
    }
  }

  public static isStopped(context: IInputValidatorContext): boolean {
    return context.accepted || context.canceled || context.prevented
  }

  private apply(context: IInputValidatorContext) {
    context.$event.preventDefault()
    if (context.target instanceof HTMLInputElement) {
      context.target.value = context.currValue ?? ''
      context.target.selectionStart = context.caretPosition.start ?? context.target.selectionStart
      context.target.selectionEnd = context.caretPosition.end ?? context.target.selectionEnd
    } else {
      context.target.innerText = context.currValue ?? ''
      this.setCaret(context.target, context.caretPosition)
    }
    if (this.onApply) {
      this.onApply(context.currValue)
    }
    const inputEvent = new InputEvent('input', {
      data: context.currValue,
      inputType: 'insertText',
    })
    context.target.dispatchEvent(inputEvent)
  }

  private setCaret(target: HTMLElement, caret: IInputCaretPosition) {
    const selection = window.getSelection();
    if (!selection) return;
    
    const textNode = target.firstChild;

    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
      return;
    }

    const range = document.createRange();

    range.setStart(textNode, Math.min(caret.start, textNode.textContent?.length ?? 0));
    
    if (!caret.collapsed) {
      range.setEnd(textNode, Math.min(caret.end, textNode.textContent?.length ?? 0))
    } else {
      range.collapse(true);
    }
  
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

class InputValidatorDefaultContext<T extends object = any> implements IInputValidatorContext<T>, IInputTransactionFactory{
  public $event: InputEvent;
  public target: HTMLElement;
  public oldValue: string;
  public currValue: string;
  public data: string | null;
  public ranges: ReturnType<InputEvent['getTargetRanges']>;
  public targetRange: IInputValidatorContext['ranges'][number];
  public caretPosition: InputCaretPosition;
  public inputType: InputEvent['inputType'];
  public canceled: boolean;
  public accepted: boolean;
  public prevented: boolean;
  public replacedValue: string;
  public defaultUsed: boolean;
  public customContext: CustomContext<T>;
  private errors: Map<string, Error>
  private transaction?: IInputTransaction


  constructor($event: InputEvent) {
    this.$event = $event;
    this.target = $event.target as HTMLElement;
    this.oldValue = this.target.innerText;
    this.currValue = this.oldValue;
    this.ranges = $event.getTargetRanges();
    [this.targetRange] = this.ranges;
    this.caretPosition = new InputCaretPosition(this.initialCaretStart(), this.initialCaretEnd())
    this.inputType = $event.inputType;
    this.data = $event.data;
    this.canceled = false;
    this.accepted = false;
    this.prevented = false;
    this.defaultUsed = false;
    this.errors = new Map()
    this.replacedValue = this.computeReplacedValue()
    this.customContext = {}
  }
  
  createTransaction(): IInputTransaction {
    this.transaction = {
      value: this.computedValue(),
      caretEnd: this.computedCaretEnd(),
      caretStart: this.computedCaretStart(),
    }
    this.caretPosition.connectTransaction(this.transaction)
    return this.transaction
  }

  pushError(error: string, msg?: string): void {
    const e = new Error(msg ?? '')
    e.name = error
    this.errors.set(error, e)
  }

  readErrors(): Map<string, Error> {
    return this.errors
  }

  cancel(): void {
    this.canceled = true
  }

  accept(): void {
    this.accepted = true
  }

  prevent(): void {
    this.prevented = true
  }

  applyDefault(): void {
    this.defaultUsed = true
  }

  protected computeReplacedValue(): string {
    const start: number = this.initialCaretStart();
    const end: number = this.initialCaretEnd();
    switch(this.inputType) {
      default:
        return `${this.oldValue.slice(start, end)}`
    }
  }

  computedValue(): string {
    const start: number = this.initialCaretStart();
    const end: number = this.initialCaretEnd();
    switch(this.inputType) {
      default:
        return `${this.oldValue.slice(0, start)}${this.data ?? ''}${this.oldValue.slice(end)}`
    }
  }

  computedCaretStart(): number {
    switch(this.inputType) {
      case 'insertFromPaste':
        return this.initialCaretStart() + (this.data?.length ?? 0)
      case 'insertText':
        return this.initialCaretStart() + 1
      default:
        return this.initialCaretStart()
    }
  }

  computedCaretEnd(): number {
    switch(this.inputType) {
      default:
        return this.computedCaretStart()
    }
  }

  applyTransaction(transaction: IInputTransaction): void {
    this.transaction = transaction
    this.caretPosition.set(transaction.caretStart ?? this.computedCaretStart(), transaction.caretEnd ?? this.computedCaretEnd())
    this.currValue = transaction.value
  }

  protected initialCaretStart(): number {
    return this.targetRange.startOffset
  }
  protected initialCaretEnd(): number {
    return this.targetRange.endOffset
  }
}

class InputValidatorInputElementContext<T extends object = any> extends InputValidatorDefaultContext<T> {
  override target: HTMLInputElement;

  constructor($event: InputEvent) {
    super($event)
    this.target = $event.target as HTMLInputElement
    this.oldValue = this.target.value
    this.currValue = this.target.value
    this.caretPosition = new InputCaretPosition(this.initialCaretStart(), this.initialCaretEnd())
    this.replacedValue = this.computeReplacedValue()
  }

  protected override initialCaretEnd(): number {
      return this.target.selectionEnd ?? this.initialCaretStart()
  }
  
  protected override initialCaretStart(): number {
      return this.target.selectionStart ?? 0
  }

  protected override computeReplacedValue(): string {
    const start: number = this.initialCaretStart();
    const end: number = this.initialCaretEnd();
    switch(this.inputType) {
      case 'deleteContentBackward':
        return `${this.oldValue.slice(start - 1, end)}`
      case 'deleteContentForward':
        return `${this.oldValue.slice(start, end !== start ? end : start + 1)}`
      default:
        return `${this.oldValue.slice(start, end)}`
    }
  }

  public override computedValue(): string {
    const start: number = this.initialCaretStart();
    const end: number = this.initialCaretEnd();
    switch(this.inputType) {
      case 'deleteContentBackward':
        return `${this.oldValue.slice(0, start !== end ? start : start - 1)}${this.data ?? ''}${this.oldValue.slice(end)}`
      case 'deleteContentForward':
        return `${this.oldValue.slice(0, start)}${this.data ?? ''}${this.oldValue.slice(end !== start ? end : start + 1)}`
      default:
        return `${this.oldValue.slice(0, start)}${this.data ?? ''}${this.oldValue.slice(end)}`
    }
  }

  public override computedCaretStart(): number {
    const start: number = this.initialCaretStart();
    switch(this.inputType) {
      case 'deleteContentBackward':
        return start !== this.initialCaretEnd() ? start : start - 1
      case 'deleteContentForward':
        return this.initialCaretStart()
      case 'insertFromPaste':
        return this.initialCaretStart() + (this.data?.length ?? 0)
      case 'insertText':
        return this.initialCaretStart() + 1
      default:
        return super.computedCaretStart()
    }
  }
}

class InputCaretPosition implements IInputCaretPosition{
  public readonly initStart: number
  public readonly initEnd: number
  public start: number
  public end: number
  private transaction?: IInputTransaction

  get collapsed(): boolean {return this.start === this.end}

  constructor(start: number, end: number) {
    this.start = start;
    this.initStart = this.start
    this.end = end;
    this.initEnd = this.end
  }

  collapse(toStart?: boolean): void {
    if (toStart) {
      this.end = this.start
    } else {
      this.start = this.end
    }
    this.updateTransaction()
  }

  offset(by: number): void {
    this.start += by
    this.end += by
    this.updateTransaction()
  }

  set(start: number, end?: number) {
    this.start = start
    this.end = end ?? this.start
    if (this.end < this.start) {
      this.end = this.start
    }
    this.updateTransaction()
  }

  private updateTransaction() {
    if (this.transaction) {
      this.transaction.caretStart = this.start
      this.transaction.caretEnd = this.end
    }
  }

  connectTransaction(transaction: IInputTransaction) {
    this.transaction = transaction
  }
}
// #endregion

// #region exports
export { InputValidatorPipe, type IInputValidator }
// #endregion
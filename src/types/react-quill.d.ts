declare module "react-quill" {
  import { Component } from "react";

  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    onChange?: (
      content: string,
      delta: unknown,
      source: string,
      editor: unknown
    ) => void;
    onChangeSelection?: (
      range: unknown,
      source: string,
      editor: unknown
    ) => void;
    onFocus?: (range: unknown, source: string, editor: unknown) => void;
    onBlur?: (previousRange: unknown, source: string, editor: unknown) => void;
    onKeyPress?: (event: unknown) => void;
    onKeyDown?: (event: unknown) => void;
    onKeyUp?: (event: unknown) => void;
    bounds?: string | HTMLElement;
    children?: React.ReactElement;
    className?: string;
    formats?: string[];
    id?: string;
    modules?: Record<string, unknown>;
    preserveWhitespace?: boolean;
    scrollingContainer?: string | HTMLElement;
    style?: React.CSSProperties;
    tabIndex?: number;
    theme?: string;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {}
}

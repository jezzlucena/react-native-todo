import { useEffect, useRef, useState } from "react";
import { NativeSyntheticEvent, Text, LayoutChangeEvent, TextInputKeyPressEventData, TextStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface IProps {
  value?: string;
  className?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  focusOnMount?: boolean;
  style?: TextStyle;
};

const MIN_INPUT_HEIGHT = 28;
const INPUT_BOX_HEIGHT = 2;

const AutoSizeTextInput = ({
  value,
  className,
  onChangeText,
  onSubmit,
  onBlur,
  onFocus,
  placeholder,
  focusOnMount,
  style
}: IProps) => {
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
  const inputRef = useRef<TextInput>(null);
  const textCopyRef = useRef<Text>(null);

  useEffect(() => {
    if (focusOnMount) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, []);

  const handleTextLayout = (event: LayoutChangeEvent) => {
    setInputHeight(event.nativeEvent.layout.height);
  };

  const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === 'Enter') {
      event.preventDefault();
      onSubmit?.();
    } else if (event.nativeEvent.key === 'Backspace' && value === '') {
      onSubmit?.();
    }
  };

  return (<>
    <Text
      className={className + " absolute top-0 left-0 pointer-events-none opacity-0"}
      ref={textCopyRef}
      onLayout={handleTextLayout}
      style={style}
    >
      {value || ' '}
    </Text>
    <TextInput
      value={value}
      className={className}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmit}
      onBlur={onBlur}
      onKeyPress={handleKeyPress}
      onFocus={onFocus}
      submitBehavior="submit"
      style={{ ...style, height: Math.max(inputHeight, MIN_INPUT_HEIGHT) + INPUT_BOX_HEIGHT }}
      multiline
      placeholder={placeholder}
      ref={inputRef}
    />
  </>)
}

export default AutoSizeTextInput;
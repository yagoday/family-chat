declare module '@emoji-mart/data' {
  const data: any;
  export default data;
}

declare module '@emoji-mart/react' {
  interface EmojiPickerProps {
    data: any;
    onEmojiSelect: (emoji: { native: string }) => void;
    theme?: 'light' | 'dark';
  }

  const Picker: React.FC<EmojiPickerProps>;
  export default Picker;
} 
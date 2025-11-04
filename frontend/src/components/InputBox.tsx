interface InputBoxProps {
  className?: string;
  leftIcon?: React.JSX.Element | (() => React.JSX.Element);
  rightIcon?: React.JSX.Element | (() => React.JSX.Element);
  placeholder?: string;
  type: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * Caixa de input com ícones à esquerda e à direita.
 *
 * @param className As classes do componente.
 * @param leftIcon O ícone (elemento JSX) a ser renderizado à esquerda.
 * @param rightIcon O ícone (elemento JSX) a ser renderizado à direita.
 * @param placeholder O texto a ser mostrado quando não há input do usuário na caixa.
 * @param type O tipo da caixa de input.
 * @param value O valor que armazenará o input do usuário.
 * @param onChange A função a ser chamada quando o usuário tenta mudar o input armazenado em `value`.
 */
export default function InputBox({
  className = "",
  leftIcon = <></>,
  rightIcon = <></>,
  placeholder = "",
  type = "text",
  value = "",
  onChange = () => {}
}: InputBoxProps) {
  return (
    <div className={className}>
      {typeof leftIcon === "function" ? leftIcon() : leftIcon}

      <input
        type={type}
        className={`flex grow outline-none ${!value ? "italic" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {typeof rightIcon === "function" ? rightIcon() : rightIcon}
    </div>
  );
}

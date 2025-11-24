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
 * IDs de teste internos:
 * - `input-box` — Refere ao componente como um todo.
 * - `left-icon` — Refere ao ícone à esquerda da caixa de entrada.
 * - `input-element` — Refere ao elemento da caixa de entrada.
 * - `right-icon` — Refere ao ícone à direita da caixa de entrada.
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
    <div
      className={className}
      data-testid="input-box"
    >
      <div data-testid="left-icon">
        {typeof leftIcon === "function" ? leftIcon() : leftIcon}
      </div>

      <input
        type={type}
        className={`flex grow outline-none ${!value ? "italic" : ""}`}
        data-testid="input-element"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      <div data-testid="right-icon">
        {typeof rightIcon === "function" ? rightIcon() : rightIcon}
      </div>
    </div>
  );
}

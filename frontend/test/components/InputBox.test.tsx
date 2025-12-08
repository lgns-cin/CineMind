import { fireEvent, render, screen } from "@testing-library/react";
import InputBox from "../../src/components/InputBox";
import { useState } from "react";

// Ambas possibilidades para os tipos de leftIcon e rightIcon
const mockIcon = <div>Mock Icon</div>;
const getMockIcon = () => <div>Mock Icon</div>;

describe("Componente InputBox", () => {
  test("Carrega todos os elementos corretamente", () => {
    render(
      <InputBox
        type="text"
        value=""
        onChange={() => {}}
        leftIcon={mockIcon}
        rightIcon={getMockIcon}
      />
    );

    // divs para os ícones existem
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();

    // Elemento de ícone é implantado corretamente
    expect(screen.getAllByText("Mock Icon")).toHaveLength(2);

    // Caixa de texto existe
    expect(screen.getByTestId("input-element")).toBeInTheDocument();
  });

  test("Processa entrada do usuário corretamente", async () => {
    // Input box com estado externo
    const StatefulInputBox = () => {
      const [state, setState] = useState("Initial value");

      return (
        <InputBox
          type="text"
          value={state}
          onChange={event => setState(event.target.value)}
        />
      );
    };

    render(<StatefulInputBox />);

    const inputElement = screen.getByTestId("input-element");

    // Verificando estado inicial
    expect(inputElement).toHaveDisplayValue("Initial value");

    // "Digitando" algo
    fireEvent.change(inputElement, { target: { value: "New value" } });

    // Verificando estado novo
    expect(inputElement).toHaveDisplayValue("New value");
  });
});

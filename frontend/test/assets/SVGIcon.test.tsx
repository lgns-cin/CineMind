import { fireEvent, render, screen } from "@testing-library/react";
import SVGIcon from "../../src/assets/SVGIcon";

describe("Componente SVGIcon", () => {
  test("Carrega o ícone corretamente", async () => {
    render(
      <SVGIcon
        className=""
        testID="test"
        viewBox="0 0 24 24"
        onClick={() => {}}
      >
        <title>Icon</title>
      </SVGIcon>
    );

    // Implanta o ID de teste corretamente
    expect(await screen.findByTestId("test")).toBeInTheDocument();

    // Implanta "children" no componente corretamente
    expect(await screen.findByTitle("Icon")).toBeInTheDocument();
  });

  test("Chama a função onClick corretamente", async () => {
    // Contador simples
    let [number, increment] = [0, () => number++];

    // Função mock
    const onClick = jest.fn(increment);

    render(
      <SVGIcon
        className=""
        testID="test"
        viewBox="0 0 24 24"
        onClick={onClick}
      >
        <title>{number}</title>
      </SVGIcon>
    );

    const icon = await screen.findByTestId("test");

    // number = 0 -> number = 1
    fireEvent.click(icon);

    // Chamou onClick
    expect(onClick).toHaveBeenCalled();
    // Atualizou number
    expect(number).toBe(1);
  });
});

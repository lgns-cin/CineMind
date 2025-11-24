import { fireEvent, render, screen } from "@testing-library/react";
import QuestionItem from "../../src/components/QuestionItem";
import type { Question } from "../../src/services/onboardingService";

const mockQuestion: Question = {
  id: "1",
  description: "Você gosta de festas?",
  attribute: "extraversion",
  first_alternative: "Sim, adoro!",
  first_alternative_value: 1,
  second_alternative: "Não gosto.",
  second_alternative_value: -1,
  third_alternative: "Depende.",
  third_alternative_value: 0,
};

describe("Componente QuestionItem", () => {
  test("Renderiza a pergunta e as opções corretamente", () => {
    render(<QuestionItem question={mockQuestion} onAnswer={() => {}} />);
    
    expect(screen.getByText("Você gosta de festas?")).toBeInTheDocument();
    expect(screen.getByText("Sim, adoro!")).toBeInTheDocument();
    expect(screen.getByText("Não gosto.")).toBeInTheDocument();
    expect(screen.getByText("Depende.")).toBeInTheDocument();
  });

  test("Chama onAnswer com o valor correto ao clicar", () => {
    const handleAnswer = jest.fn();
    render(<QuestionItem question={mockQuestion} onAnswer={handleAnswer} />);
    
    // Clica na primeira opção (valor 1)
    fireEvent.click(screen.getByText("Sim, adoro!"));
    expect(handleAnswer).toHaveBeenCalledWith(1);

    // Clica na segunda opção (valor -1)
    fireEvent.click(screen.getByText("Não gosto."));
    expect(handleAnswer).toHaveBeenCalledWith(-1);
  });
});
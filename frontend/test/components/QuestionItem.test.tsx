import { fireEvent, render, screen } from "@testing-library/react";
import type { Question } from "../../src/services/onboarding";
import QuestionItem from "../../src/components/QuestionItem";

describe("Componente QuestionItem", () => {
  const question: Question = {
    id: "0",
    description: "Descrição",
    attribute: "Atributo",
    first_alternative: "A (+1)",
    second_alternative: "B (0)",
    third_alternative: "C (-1)",
    first_alternative_value: 1,
    second_alternative_value: 0,
    third_alternative_value: -1
  };

  let answer = -2;
  const onAnswer = jest.fn((value: number) => {
    answer = value;
  });

  beforeEach(() => {
    render(
      <QuestionItem
        question={question}
        onAnswer={onAnswer}
      />
    );
  });

  test("Carrega todos os elementos corretamente", async () => {
    expect(await screen.findByText(question.description)).toBeInTheDocument();
    expect(
      await screen.findByText(question.first_alternative)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(question.second_alternative)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(question.third_alternative)
    ).toBeInTheDocument();
  });

  test("Chama a função onAnswer corretamente", async () => {
    const buttonA = await screen.findByText(question.first_alternative);
    const buttonB = await screen.findByText(question.second_alternative);
    const buttonC = await screen.findByText(question.third_alternative);

    fireEvent.click(buttonA);
    // answer = 1
    expect(answer).toBe(question.first_alternative_value);

    fireEvent.click(buttonB);
    // answer = 0
    expect(answer).toBe(question.second_alternative_value);

    fireEvent.click(buttonC);
    // answer = -1
    expect(answer).toBe(question.third_alternative_value);

    // chamou onAnswer 3 vezes
    expect(onAnswer).toHaveBeenCalledTimes(3);
  });
});

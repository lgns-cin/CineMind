import { fireEvent, render, screen } from "@testing-library/react";
import GenreGrid from "../../src/components/GenreGrid";
import type { Genre } from "../../src/services/onboarding";

describe("Componente GenreGrid", () => {
  const testGenres: Genre[] = [
    {
      id: "0",
      name: "Gênero 0"
    },
    {
      id: "1",
      name: "Gênero 1"
    },
    {
      id: "2",
      name: "Gênero 2"
    }
  ];

  const selectedIDs: string[] = [];
  const onToggle = jest.fn((id: string) => selectedIDs.push(id));

  beforeEach(() => {
    render(
      <GenreGrid
        genres={testGenres}
        selectedIds={selectedIDs}
        onToggle={onToggle}
      />
    );
  });

  test("Carrega todos os elementos corretamente", async () => {
    // assert
    for (let i = 0; i < 3; i++) {
      expect(await screen.findByText(testGenres[i].name)).toBeInTheDocument();
    }
  });

  test("Chama a função onToggle corretamente", async () => {
    const buttonGenre0 = await screen.findByText(testGenres[0].name);
    fireEvent.click(buttonGenre0);

    // chamou onToggle
    expect(onToggle).toHaveBeenCalled();

    // selectedIDs = [] -> ["0"]
    expect(selectedIDs).toHaveLength(1);
    expect(selectedIDs).toContain(testGenres[0].id);
  });
});

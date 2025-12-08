/**
 * Tipo que define as propriedades esperadas por cada ícone SVG.
 */
export interface IconProps {
  className?: string;
  viewBox?: string;
  onClick?: (event: React.SyntheticEvent) => void;
}

/** Tipo para uso interno. */
interface SVGIconProps {
  className: string;
  testID: string;
  viewBox: string;
  onClick: (event: React.SyntheticEvent) => void;
  children: React.JSX.Element | React.JSX.Element[];
}

/**
 * Representa um ícone genérico de SVG interativo.
 *
 * Não é recomendado usar essa função em nenhuma página diretamente.
 * Esse componente apenas facilita o processo de criação de assets.
 *
 * @param className As classes do componente.
 * @param testID O ID de teste interno do ícone.
 * @param viewBox O atributo {@link React.SVGAttributes<SVGSVGElement>.viewBox} do SVG.
 * @param onClick Uma função disparada quando o usuário clica no ícone.
 * @param children Elementos-filho do SVG, como {@link React.JSX.IntrinsicElements.path \<path \/\>}.
 */
export default function SVGIcon({
  className,
  testID,
  viewBox,
  onClick,
  children
}: SVGIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      data-testid={testID}
      onClick={onClick}
    >
      {children}
    </svg>
  );
}

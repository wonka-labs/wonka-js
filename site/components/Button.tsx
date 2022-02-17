import Link from "next/link";

export enum ButtonStyle {
  Small = 1,
  Large,
}

const Button = ({
  title,
  style = ButtonStyle.Large,
  href,
  target,
  disabled,
  didTapButton,
}: {
  title: string;
  style?: ButtonStyle;
  href?: string;
  target?: string;
  disabled?: boolean;
  didTapButton?: () => void;
}) => {
  const sizeStyleClass =
    style === ButtonStyle.Large
      ? "leading-loose md:text-3xl md:px-9 md:py-3 text-2xl px-4"
      : "px-5 py-0";
  function ButtonAnchor() {
    return (
      <a
        className={`${sizeStyleClass} inline-block bg-white cursor-pointer hover:bg-opacity-30 bg-opacity-20 `}
        onClick={didTapButton}
        target={target}
      >
        {title}
      </a>
    );
  }
  if (disabled) {
    return (
      <a
        className={`${sizeStyleClass} inline-block cursor-not-allowed bg-white bg-opacity-30 opacity-30`}
      >
        {title}
      </a>
    )
  }
  return (
    <>
      {href !== undefined ? (
        <Link href={href} passHref={true}>
          {ButtonAnchor()}
        </Link>
      ) : (
        <ButtonAnchor />
      )}
    </>
  );
};

export default Button;

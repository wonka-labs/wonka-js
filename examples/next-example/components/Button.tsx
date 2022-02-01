export enum ButtonStyle {
  Small = 1,
  Large,
}

const Button = ({ title, didTapButton }: { title: string; didTapButton: () => void }) => {
  return (
    <>
      <a
        className="no-underline rounded-md bg-white cursor-pointer hover:bg-opacity-10 bg-opacity-25 px-5 py-2"
        onClick={didTapButton}
      >
        {title}
      </a>
    </>
  );
};

export default Button;

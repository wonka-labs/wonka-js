const ColumnLayout = (props: any) => {
  return (
    <div className={`flex lg:flex-row-reverse flex-col items-center justify-center ${props.full && 'min-h-full' }`}>
      <div className="">{props.children[0]}</div>
      <div className="lg:max-w-[632px]">{props.children[1]}</div>
    </div>
  );
};

ColumnLayout.defaultProps = {};

export default ColumnLayout;

import Navigation from "./Navigation";

const Container = (props: any) => {
  return (
    // 1. There is a top level flex box with height 100%.
    // 2. The first child is an optional navigation bar with a set height and no shrink.
    // 3. The second child is a div with responsive horizontal margins set to grow fully.
    // 4. The second child's top is offset by navigation's height to allow centering on screen.
    // 5. Z index on the child that has navigation is increased to prevent the second child eating events.
    <div className="flex flex-col h-full">
      {props.showsNavigation && (
        <div className="shrink-0 z-50">
        <Navigation />
        </div>
      )}
      <div className={`grow xl:max-w-6xl lg:mx-auto md:max-w-5xl mx-12 ${props.showsNavigation && '-mt-34'}`} >
        {props.children}
      </div>
      <footer className="background-text shrink-0 text-center p-10">Made with ❤️ by Wonka Labs</footer>
    </div>
  );
};

Container.defaultProps = {};

export default Container;

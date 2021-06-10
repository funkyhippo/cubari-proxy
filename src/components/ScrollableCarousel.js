import React, { PureComponent } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";
import { classNames } from "../utils/strings";
import Spinner from "./Spinner";

const SCROLL_THRESHOLD = 20;
const LOAD_BATCH_COUNT = 6;
// TODO this is a stopgap solution and will not scale.
const scrollPositionCache = {};

export default class ScrollableCarousel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fullyLeftScrolled: true,
      fullyRightScrolled: true,
      scrolling: false,
      itemLength: 0,
    };
    // While a shared observer would be preferable, we lose
    // the virtual DOM context here so we'll instead bind it
    // per scrollable carousel
    this.ref = React.createRef();
    this.componentRef = React.createRef();
    this.observer = new IntersectionObserver(this.observerCallback);
  }

  observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.setState(
          {
            itemLength: scrollPositionCache[this.props.id]
              ? scrollPositionCache[this.props.id].itemLength
              : LOAD_BATCH_COUNT,
          },
          () => {
            this.ref.current.scrollLeft = scrollPositionCache[this.props.id]
              ? scrollPositionCache[this.props.id].scrollLeft
              : 0;
            this.scrollPositionHandler();
          }
        );
        this.observer.unobserve(entry.target);
        delete this.observer;
      }
    });
  };

  scrollPositionHandler = () => {
    if (this.ref.current) {
      let scrollLeft = this.ref.current.scrollLeft;
      let fullyLeftScrolled = scrollLeft < SCROLL_THRESHOLD;
      let fullyRightScrolled =
        scrollLeft + this.ref.current.clientWidth >
        this.ref.current.scrollWidth - SCROLL_THRESHOLD;
      scrollPositionCache[this.props.id] = {
        scrollLeft: scrollLeft,
        itemLength: this.state.itemLength,
      };
      if (
        fullyRightScrolled &&
        this.state.itemLength < this.props.children.length
      ) {
        this.setState({
          itemLength: this.state.itemLength + LOAD_BATCH_COUNT,
        });
      } else {
        this.setState({
          fullyLeftScrolled,
          fullyRightScrolled,
        });
      }
    }
  };

  _scroller = (modifier) => {
    if (!this.state.scrolling) {
      this.ref.current.classList.add("overflow-x-hidden");
      let elementWidth = this.ref.current.lastChild.lastChild.clientWidth;
      let containerWidth = this.ref.current.clientWidth;
      let currentPosition = this.ref.current.scrollLeft;
      // The amount we scroll will be the number of elements that can be displayed
      // on the screen, while snapping the new position to the nearest element
      // (which is accounted by the addition subtraction of the leftover scroll amount)
      let amount =
        elementWidth * Math.floor(containerWidth / elementWidth) +
        (elementWidth * Math.ceil(currentPosition / elementWidth) -
          currentPosition) *
          modifier;
      if (amount < elementWidth) {
        amount = elementWidth;
      }
      let steps = 0;
      let maxSteps = 20;
      let scroller = () => {
        // This emulates an ease-in-out function
        let x = steps / maxSteps;
        let functor = (x * x) / (2 * (x * x - x) + 1);
        this.ref.current.scrollLeft =
          currentPosition + functor * amount * modifier;
        steps++;
        if (steps < maxSteps) {
          window.requestAnimationFrame(scroller);
        } else {
          this.ref.current.classList.remove("overflow-x-hidden");
          this.setState({
            scrolling: false,
          });
        }
      };
      window.requestAnimationFrame(scroller);
      this.setState({
        scrolling: true,
      });
    }
  };

  scrollLeft = () => {
    this._scroller(-1);
  };

  scrollRight = () => {
    this._scroller(1);
  };

  componentDidMount = () => {
    this.observer.observe(this.componentRef.current);
    window.addEventListener("resize", this.scrollPositionHandler);
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.scrollPositionHandler);
  };

  render() {
    return (
      <div className="relative w-full h-full" ref={this.componentRef}>
        <div
          className={classNames(
            this.state.fullyLeftScrolled
              ? "opacity-0 pointer-events-none"
              : "opacity-100",
            "absolute select-none -left-2 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-250"
          )}
        >
          <div
            className="cursor-pointer sticky bg-gray-900 text-white dark:bg-white dark:text-black rounded-full p-2 shadow-2xl transform scale-95 hover:scale-100 opacity-40 sm:opacity-80 hover:opacity-100 transition-opacity transition-transform duration-250"
            onClick={this.scrollLeft}
          >
            <ArrowLeftIcon
              className={`rounded-full z-10 p-0 w-${
                this.props.iconSize ? this.props.iconSize : 8
              } h-${this.props.iconSize ? this.props.iconSize : 8}`}
              aria-hidden="true"
            />
          </div>
        </div>
        {this.state.itemLength ? (
          <div
            ref={this.ref}
            className="static w-full h-full flex overflow-x-auto no-scrollbar pb-1 pt-1 select-none"
            onScroll={this.scrollPositionHandler}
          >
            <div className="flex flex-nowrap mt-1 mb-1">
              {Array.isArray(this.props.children)
                ? this.props.children.slice(0, this.state.itemLength)
                : this.props.children}
            </div>
          </div>
        ) : this.props.children.length ? (
          <Spinner />
        ) : undefined}
        <div
          className={classNames(
            this.state.fullyRightScrolled
              ? "opacity-0 pointer-events-none"
              : "opacity-100",
            "absolute select-none -right-2 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-250"
          )}
        >
          <div
            className="cursor-pointer  bg-gray-900 text-white dark:bg-white dark:text-black rounded-full p-2 shadow-2xl transform scale-95 hover:scale-100 opacity-40 sm:opacity-80 hover:opacity-100 transition-opacity transition-transform duration-250"
            onClick={this.scrollRight}
          >
            <ArrowRightIcon
              className={`rounded-full z-10 p-0 w-${
                this.props.iconSize ? this.props.iconSize : 8
              } h-${this.props.iconSize ? this.props.iconSize : 8}`}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    );
  }
}

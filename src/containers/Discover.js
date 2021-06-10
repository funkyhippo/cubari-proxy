import React, { Fragment, PureComponent } from "react";
import MangaCard from "../components/MangaCard";
import ScrollableCarousel from "../components/ScrollableCarousel";
import Section from "../components/Section";
import Spinner, { SpinIcon } from "../components/Spinner";
import Container from "../components/Container";
import { capitalizeFirstLetters } from "../utils/strings";
import sourcemap from "../sources/sourcemap.js";
import { RadioGroup } from "@headlessui/react";
import { classNames } from "../utils/strings";

export default class Discover extends PureComponent {
  componentDidMount = () => {
    this.props.setPath("Discover");
    if (!this.props.discoverSource) {
      this.props.setDiscoverSource(Object.keys(sourcemap)[0]);
    }
  };

  getSourceNamesAndIcons() {
    let activeSources = new Set(
      [...this.props.discover].map((section) => section.sourceName)
    );
    let response = [];
    for (const [sourceName, source] of Object.entries(sourcemap)) {
      let iconFileName = source.getSourceDetails().icon;
      response.push({
        name: sourceName,
        icon: require(`../sources/${sourceName}/includes/${iconFileName}`),
        disabled: !activeSources.has(sourceName),
      });
    }
    return response;
  }

  render() {
    const items = [];
    this.props.discover.forEach((section) => {
      if (section.items && section.items.length) {
        let subText = section.title.split(" - ")[1];
        items.push(
          <Fragment
            key={section.sourceName + section.id + section.title + "-section"}
          >
            <Section
              key={section.id + section.title + "title"}
              text={capitalizeFirstLetters(subText)}
            />
            <ScrollableCarousel key={section.id + section.title + "-carousel"}>
              {section.items.map((item) => (
                <MangaCard
                  key={section.id + item.id}
                  mangaUrlizer={section.mangaUrlizer}
                  slug={item.id}
                  coverUrl={item.image}
                  mangaTitle={item.title.text}
                  sourceName={section.sourceName}
                  source={section.source}
                />
              ))}
            </ScrollableCarousel>
          </Fragment>
        );
      }
    });

    return (
      <Container>
        {this.props.discover.size ? (
          <Fragment>
            <ScrollableCarousel iconSize={4}>
              <RadioGroup
                as="div"
                className="py-2 flex flex-nowrap"
                value={this.props.discoverSource}
                onChange={this.props.setDiscoverSource}
              >
                {this.getSourceNamesAndIcons().map((source) => (
                  <RadioGroup.Option
                    as={Fragment}
                    value={source.name}
                    key={"source-icon-" + source.name}
                  >
                    {({ checked }) => (
                      <button
                        disabled={source.disabled}
                        className={classNames(
                          checked
                            ? "bg-black text-white dark:bg-gray-800 dark:text-white"
                            : "bg-transparent text-black dark:text-gray-300",
                          source.disabled
                            ? "opacity-25"
                            : checked
                            ? ""
                            : "hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white",
                          "min-w-max inline-flex items-center justify-center px-3 py-2 mx-2 rounded-md text-md font-medium focus:outline-none"
                        )}
                      >
                        {source.disabled ? (
                          <SpinIcon className="h-8 h-8 animate-spin"></SpinIcon>
                        ) : (
                          <img
                            src={source.icon.default}
                            className="h-8 w-8"
                            alt={source.name}
                          />
                        )}
                        <div className="block px-2">{source.name}</div>
                      </button>
                    )}
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </ScrollableCarousel>

            {items.map((item) =>
              item.key.includes(this.props.discoverSource) ? item : undefined
            )}
          </Fragment>
        ) : (
          <Spinner />
        )}
      </Container>
    );
  }
}

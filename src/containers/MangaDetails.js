import React, { Fragment, PureComponent } from "react";
import Container from "../components/Container";
import Section from "../components/Section";
import { withRouter } from "react-router-dom";
import sourcemap from "../sources/sourcemap";
import Spinner from "../components/Spinner";
import Text from "../components/Text";
import Gallery, { WrappedGalleryOpener } from "../components/Gallery";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { globalHistoryHandler } from "../utils/remotestorage";
import { classNames } from "../utils/strings";

dayjs.extend(relativeTime); // TODO move this out

class MangaDetails extends PureComponent {
  constructor(props) {
    super(props);
    // TODO this is a metric fuck-ton of state, consider recomposition
    this.state = {
      coverUrl: undefined,
      title: undefined,
      desc: undefined,
      artist: undefined,
      author: undefined,
      status: undefined,
      lastUpdate: undefined,
      chapters: [],
      metaLoaded: false,
      chaptersLoaded: false,
      galleryShown: false,
      images: [],
      chapterId: undefined,
      readChapters: [],
    };
  }

  componentDidMount = async () => {
    this.props.setPath("MangaDetails");
    const source = this.props.match.params.source;
    const slug = this.props.match.params.slug;
    const sourceObject = sourcemap[source];
    if (sourceObject) {
      sourceObject.getMangaDetails(slug).then((mangaDetails) => {
        this.setState({
          coverUrl: mangaDetails.image,
          title: mangaDetails.titles[0] || "Unknown Title",
          desc: mangaDetails.desc || "No description.",
          artist: mangaDetails.artist || "Unknown",
          author: mangaDetails.author || "Unknown",
          status: mangaDetails.status || "Unknown",
          lastUpdate: mangaDetails.lastUpdate,
          metaLoaded: true,
        });
        sourceObject.getChapters(slug).then((chapterDetails) => {
          this.setState({
            chapters: chapterDetails.sort(
              (first, second) => second.chapNum - first.chapNum
            ),
            chaptersLoaded: true,
          });
        });
      });
      this.setState({
        readChapters:
          (await globalHistoryHandler.getReadChapters(slug, source)) || [],
      });
    }
  };

  render() {
    const source = this.props.match.params.source;
    const slug = this.props.match.params.slug;
    return (
      <Fragment>
        {this.state.galleryShown ? (
          <Gallery images={this.state.images} group={this.state.chapterId} />
        ) : undefined}
        <Container>
          {this.state.metaLoaded ? (
            <Fragment>
              <div className="flex flex-col place-items-center sm:flex-row sm:place-items-start mb-7">
                <div className="sm:mr-8 mb-3">
                  <div
                    className="bg-no-repeat bg-cover bg-center bg-gray-300 dark:bg-gray-800 rounded-lg shadow-md h-72 w-48 flex-wrap p-1"
                    style={{ backgroundImage: `url("${this.state.coverUrl}")` }}
                  ></div>
                </div>
                <div className="flex flex-col">
                  <Section text={this.state.title} subText={source}></Section>
                  <Text>
                    {this.state.desc.slice(0, 512) +
                      (this.state.desc.length > 512 ? "... (truncated)" : "")}
                  </Text>
                </div>
              </div>
              {this.state.chaptersLoaded ? (
                <div className="w-full">
                  {this.state.chapters.map((chapter) => (
                    <WrappedGalleryOpener
                      loadCallback={async () => {
                        let images = await sourcemap[source].getChapterDetails(
                          slug,
                          chapter.id
                        );
                        this.setState(
                          {
                            galleryShown: true,
                            images: images.pages,
                            chapterId: chapter.id,
                          },
                          async () => {
                            await globalHistoryHandler.addChapter(
                              slug,
                              source,
                              chapter.chapNum
                            );
                            this.setState({
                              readChapters:
                                (await globalHistoryHandler.getReadChapters(
                                  slug,
                                  source
                                )) || [],
                            });
                          }
                        );
                      }}
                      key={"chapter-" + chapter.id}
                      className={classNames(
                        "mx-0 sm:mx-5 lg:mx-10 block grid grid-cols-12 bg-white dark:bg-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-100 ease-in-out shadow-md cursor-pointer rounded-md p-3 sm:p-5 my-5",
                        this.state.readChapters.includes(chapter.chapNum)
                          ? "opacity-40"
                          : ""
                      )}
                    >
                      <div className="col-span-1 font-light text-left">{chapter.chapNum}</div>
                      <div className="col-span-11 sm:col-span-9 ml-2.5 -sm:ml-2.5 md:-ml-5 lg:-ml-10 font-medium text-left">
                        {chapter.name ? chapter.name : "No title"}
                      </div>
                      <div className="col-span-2 font-light text-right hidden sm:inline-block">
                        {dayjs(chapter.time).fromNow()}
                      </div>
                    </WrappedGalleryOpener>
                  ))}
                </div>
              ) : (
                <Spinner />
              )}
            </Fragment>
          ) : (
            <Spinner />
          )}
        </Container>
      </Fragment>
    );
  }
}

export default withRouter(MangaDetails);

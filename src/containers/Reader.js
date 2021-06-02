import React, { Fragment, PureComponent } from "react";
import { withRouter } from "react-router-dom";
import sourcemap from "../sources/sourcemap";
import Spinner from "../components/Spinner";
import Gallery from "../components/Gallery";
import { Transition } from "@headlessui/react";

class Reader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      chapterId: undefined,
      loaded: false,
    };
  }

  componentDidMount = async () => {
    this.props.setPath("Reader");
    const source = this.props.match.params.source;
    const slug = this.props.match.params.slug;
    const chapterId = this.props.match.params.chapterId;
    const sourceObject = sourcemap[source];
    if (sourceObject) {
      sourceObject.getChapterDetails(slug, chapterId).then((images) => {
        this.setState({
          chapterId: chapterId,
          images: images.pages,
          loaded: true,
        });
      });
    }
  };

  render() {
    return (
      <Fragment>
        {this.state.loaded ? (
          <Gallery images={this.state.images} />
        ) : (
          <Transition
            appear={true}
            show={true}
            as="div"
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            className="fixed z-50 top-0 left-0 h-screen w-screen bg-white dark:bg-black bg-opacity-80"
          >
            <div className="relative top-1/3">
              <Spinner />
            </div>
          </Transition>
        )}
      </Fragment>
      // <Gallery images={this.state.images} />
      //   <Fragment>
      //     {this.state.chapterId ? (
      //       <Gallery images={this.state.images} group={this.state.chapterId} />
      //     ) : undefined}
      //     <Container>
      //       {this.state.metaLoaded ? (
      //         <Fragment>
      //           <div className="flex flex-col place-items-center sm:flex-row sm:place-items-start mb-7">
      //             <div className="sm:mr-8 mb-3">
      //               <div
      //                 className="bg-no-repeat bg-cover bg-center bg-gray-300 dark:bg-gray-800 rounded-lg shadow-md h-72 w-48 flex-wrap p-1"
      //                 style={{ backgroundImage: `url("${this.state.coverUrl}")` }}
      //               ></div>
      //             </div>
      //             <div className="flex flex-col">
      //               <Section text={this.state.title} subText={source}></Section>
      //               <Text>
      //                 {this.state.desc.slice(0, 512) +
      //                   (this.state.desc.length > 512 ? "... (truncated)" : "")}
      //               </Text>
      //             </div>
      //           </div>
      //           {this.state.chaptersLoaded ? (
      //             <div className="w-full">
      //               {this.state.chapters.map((chapter) => (
      //                 <Link to={`/manga/${slug}/${chapter.id}`}>
      //                   <WrappedGalleryOpener
      //                     loadCallback={async () => {
      //                       let images = await sourcemap[
      //                         source
      //                       ].getChapterDetails(slug, chapter.id);
      //                       this.setState(
      //                         {
      //                           images: images.pages,
      //                           chapterId: chapter.id,
      //                         },
      //                         async () => {
      //                           await globalHistoryHandler.addChapter(
      //                             slug,
      //                             source,
      //                             chapter.chapNum
      //                           );
      //                           this.setState({
      //                             readChapters:
      //                               (await globalHistoryHandler.getReadChapters(
      //                                 slug,
      //                                 source
      //                               )) || [],
      //                           });
      //                         }
      //                       );
      //                     }}
      //                     key={"chapter-" + chapter.id}
      //                     className={classNames(
      //                       "mx-0 sm:mx-5 lg:mx-10 block grid grid-cols-12 bg-white dark:bg-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-100 ease-in-out shadow-md cursor-pointer rounded-md p-3 sm:p-5 my-5",
      //                       this.state.readChapters.includes(chapter.chapNum)
      //                         ? "opacity-40"
      //                         : ""
      //                     )}
      //                   >
      //                     <div className="col-span-1 font-light text-left">
      //                       {chapter.chapNum}
      //                     </div>
      //                     <div className="col-span-11 sm:col-span-9 ml-2.5 -sm:ml-2.5 md:-ml-5 lg:-ml-10 font-medium text-left">
      //                       {chapter.name ? chapter.name : "No title"}
      //                     </div>
      //                     <div className="col-span-2 font-light text-right hidden sm:inline-block">
      //                       {dayjs(chapter.time).fromNow()}
      //                     </div>
      //                   </WrappedGalleryOpener>
      //                 </Link>
      //               ))}
      //             </div>
      //           ) : (
      //             <Spinner />
      //           )}
      //         </Fragment>
      //       ) : (
      //         <Spinner />
      //       )}
      //     </Container>
      //   </Fragment>
    );
  }
}

export default withRouter(Reader);

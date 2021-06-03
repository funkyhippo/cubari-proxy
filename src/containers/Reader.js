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
            className="fixed z-50 top-0 left-0 h-screen w-screen bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80"
          >
            <div className="relative top-1/3">
              <Spinner />
            </div>
          </Transition>
        )}
      </Fragment>
    );
  }
}

export default withRouter(Reader);

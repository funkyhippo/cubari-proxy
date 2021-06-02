import React, { Fragment, PureComponent, useCallback, useState } from "react";
import Container from "./Container";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import Spinner from "./Spinner";

class CustomGallery extends PureComponent {
  galleryDirectRef = {};

  componentDidUpdate = () => {
    if (this.galleryDirectRef.current) {
      this.galleryDirectRef.current.refresh();
      this.galleryDirectRef.current.openGallery(0);
    }
  };

  render() {
    return (
      <div className="h-0 max-h-0 overflow-hidden">
        <Container>
          <LightGallery
            onInit={(detail) => {
              this.galleryDirectRef.current = detail.instance;
              this.galleryDirectRef.current.openGallery(0);
            }}
            speed={200}
            plugins={[lgZoom, lgThumbnail]}
            thumbnail={false}
            loop={false}
          >
            {this.props.images.map((image, index) => (
              <img alt={index} data-src={image} key={image} />
            ))}
          </LightGallery>
        </Container>
      </div>
    );
  }
}

/**
 * This doesn't have to be a functional component but I wrote
 * it this way originally and I can't be assed to change it
 */
export function WrappedGalleryOpener(props) {
  const [loading, setLoading] = useState(false);
  const { loadCallback } = props;

  const open = useCallback(() => {
    setLoading(true);
    loadCallback().then(() => {
      setLoading(false);
    });
  }, [loadCallback]);

  return (
    <Fragment>
      {loading ? (
        <Fragment>
          <div className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-80">
            <div className="relative top-1/3">
              <Spinner />
            </div>
          </div>
          <span className={props.className} onClick={open}>
            {props.children}
          </span>
        </Fragment>
      ) : (
        <span className={props.className} onClick={open}>
          {props.children}
        </span>
      )}
    </Fragment>
  );
}

export default CustomGallery;

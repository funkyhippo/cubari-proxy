import React, { PureComponent } from "react";
import Container from "./Container";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";

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
            closable={false}
            {...this.props}
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

export default CustomGallery;

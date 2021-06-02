import { LightgalleryItem, useLightgallery } from "react-lightgallery";
import { useCallback } from "react";
import Container from "./Container";
import "lightgallery.js/dist/css/lightgallery.css";

function Gallery(props) {
  return (
    // This is basically a hidden component, but we need the vdom to register
    <div className="h-0 max-h-0 overflow-hidden">
      <Container>
        {props.images.map((image, index) => (
          <LightgalleryItem group={props.group} src={image} key={image}>
            <img alt={index} src={image} />
          </LightgalleryItem>
        ))}
      </Container>
    </div>
  );
}

export function WrappedGalleryOpener(props) {
  const { openGallery } = useLightgallery();
  const { group, loadCallback } = props;

  const open = useCallback(() => {
    loadCallback().then(() => {
      openGallery(group);
    });
  }, [group, openGallery, loadCallback]);

  return (
    <span className={props.className} onClick={open}>
      {props.children}
    </span>
  );
}

export default Gallery;

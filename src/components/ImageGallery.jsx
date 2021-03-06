import { Component } from 'react';
import { ImageGalleryItem } from './ImageGalleryItem';
import { ImageGalleryCss } from './styled/ImageGallery.styled';
import PropTypes from 'prop-types';

export class ImageGallery extends Component {
  render() {
    const { images, openModal, getBigImage } = this.props;

    return (
      <ImageGalleryCss
        onClick={e => {
          const url = e.target.getAttribute('data-action');
          const tags = e.target.getAttribute('alt');
          getBigImage({ url, tags });
          openModal();
        }}
      >
        {images.map(img => {
          return <ImageGalleryItem key={img.id} image={img} />;
        })}
      </ImageGalleryCss>
    );
  }
}

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
  getBigImage: PropTypes.func.isRequired,
};

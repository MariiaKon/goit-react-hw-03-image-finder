import { Component } from 'react';
import { findImage, PER_PAGE } from './Api';
import { Searchbar } from './Searchbar';
import { Loader } from './Loader';
import { ImageGallery } from './ImageGallery';
import { LoadMoreBtn } from './Button';
import { Modal } from './Modal';
import { Error } from './Error';

export class App extends Component {
  state = {
    query: '',
    images: [],
    isLoading: false,
    isLoadMoreBtnExist: false,
    isModalOpen: false,
    modalImage: null,
    error: null,
  };

  currentPage = 1;

  changePage = () => {
    return (this.currentPage += 1);
  };

  searchImages = async searchQuery => {
    this.setState({ isLoading: true });

    if (this.state.query !== searchQuery) {
      this.setState({ query: searchQuery });
      this.currentPage = 1;
    }

    try {
      await findImage(searchQuery, this.currentPage).then(response => {
        if (response.totalHits > PER_PAGE) {
          this.setState({
            isLoadMoreBtnExist: true,
            images: response.hits,
            isLoading: false,
            error: null,
          });
        } else if (response.totalHits <= PER_PAGE && response.totalHits > 0) {
          this.setState({
            isLoadMoreBtnExist: false,
            images: response.hits,
            isLoading: false,
            error: null,
          });
        } else if (response.totalHits === 0) {
          this.setState({
            isLoadMoreBtnExist: false,
            images: response.hits,
            isLoading: false,
            error: 'No results',
          });
        }
      });
    } catch (err) {
      this.setState({ error: err });
    }
  };

  loadMoreImages = () => {
    this.setState({ isLoading: true });
    this.currentPage = this.changePage();

    try {
      findImage(this.state.query, this.currentPage).then(response => {
        this.setState({
          images: [...this.state.images, ...response.hits],
          isLoading: false,
        });
        if (this.currentPage > Math.floor(response.totalHits / PER_PAGE)) {
          this.setState({
            isLoadMoreBtnExist: false,
          });
        }
      });
    } catch (err) {
      this.setState({ error: err });
    }
  };

  toggleModal = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  };

  getBigImage = async image => {
    this.setState(prevState => {
      return { modalImage: image };
    });
  };

  render() {
    return (
      <>
        <Searchbar onSubmit={this.searchImages} />

        {this.state.images.length !== 0 && (
          <ImageGallery
            images={this.state.images}
            openModal={this.toggleModal}
            getBigImage={this.getBigImage}
          />
        )}

        {this.state.isLoading && <Loader />}

        {this.state.isLoadMoreBtnExist && (
          <LoadMoreBtn onClick={this.loadMoreImages} />
        )}

        {this.state.isModalOpen && (
          <Modal closeModal={this.toggleModal} image={this.state.modalImage} />
        )}

        {this.state.error && <Error children={this.state.error} />}
      </>
    );
  }
}

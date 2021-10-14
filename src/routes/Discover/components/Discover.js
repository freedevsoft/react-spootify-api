import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import axios from 'axios';
import config from '../../../config';
import qs from 'qs';
export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
      loading: {
        playlists: true,
        releases: true,
        categories: true
      }
    };
  }
  async connectSpotify() {
    const authorization = window.btoa(`${config.api.clientId}:${config.api.clientSecret}`);
    const req = await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization: `Basic ${authorization}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      data: qs.stringify({
        grant_type:"client_credentials"
      })
    });
    const accessToken = `${req.data.token_type} ${req.data.access_token}`;
    axios.defaults.headers.common['Authorization'] = accessToken;
  }
  getDatas() {
    axios.get('https://api.spotify.com/v1/browse/featured-playlists')
    .then( response => {
      this.setState({
        loading: {
          ...this.state.loading,
          playlists: false,
        },
        playlists: response.data.playlists.items,
      })
    })
    .catch(e => console.log(e.message));
    axios.get('https://api.spotify.com/v1/browse/new-releases')
    .then( response => {
      this.setState({
        loading: {
          ...this.state.loading,
          releases: false,
        },
        newReleases: response.data.albums.items
      })
    })
    .catch(e => console.log(e.message));
    axios.get('https://api.spotify.com/v1/browse/categories')
    .then( response => {
      this.setState({
        loading: {
          ...this.state.loading,
          categories: false,
        },
        categories: response.data.categories.items
      })
    })
    .catch(e => console.log(e.message));    
  }
  async componentWillMount() {
    await this.connectSpotify();
    this.getDatas();
  }
  render() {
    const { newReleases, playlists, categories, loading } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} loading={loading.releases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} loading={loading.playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" loading={loading.categories} />
      </div>
    );
  }
}

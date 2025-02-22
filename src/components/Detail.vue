<template>
  <v-img class="v-img--blurred" id="hero" :aspect-ratio="10" v-if="itemDetail"
         :lazy-src="`https://image.tmdb.org/t/p/original/${itemDetail.backdrop_path}`"
         :src="`https://image.tmdb.org/t/p/original/${itemDetail.backdrop_path}`"
         gradient="to top, rgba(var(--bg-color),1) 15%, rgba(var(--bg-color),.7) 100%">
    <template v-slot:placeholder="">
      <v-row class="pa-3 ma-0 fill-height" justify="end" align="start">
        <v-progress-circular indeterminate style="opacity: .25"></v-progress-circular>
      </v-row>
    </template>
    <v-container class="py-12" :class="$vuetify.breakpoint.xsOnly">
      <v-row class="py-6" align="center" justify="center">
        <v-col cols="12" sm="4" v-if="itemDetail.poster_path">
          <v-card elevation="15" rounded="xl">
            <v-img :src="`https://image.tmdb.org/t/p/original/${itemDetail.poster_path}`"
                   :lazy-src="`https://image.tmdb.org/t/p/original/${itemDetail.poster_path}`" :aspect-ratio="2/3">
              <template v-slot:placeholder="">
                <v-row class="pa-3 ma-0 fill-height" justify="center" align="center">
                  <v-progress-circular indeterminate="indeterminate"></v-progress-circular>
                </v-row>
              </template>

              <v-row class="pa-3 ma-0 fill-height" justify="center" align="end">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs"
                           v-on="on"
                           fab
                           color="red"
                           dark
                           @click.stop="watchTrailer = true">
                      <v-icon>mdi-youtube</v-icon>
                    </v-btn>
                  </template>
                  <span>Watch trailer</span>
                </v-tooltip>
                <v-dialog
                    v-model="watchTrailer"
                    max-width="800"
                    scrollable
                >
                  <iframe v-if="watchTrailer"
                          width="720" height="405"
                          :src="`https://www.youtube.com/embed/${itemDetail.videos.results.filter(video => video.type === 'Trailer')[0].key}`"
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen>
                  </iframe>

                </v-dialog>
              </v-row>
            </v-img>
          </v-card>
        </v-col>
        <v-col align-self="center">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  v-if="authorized"
                  v-bind="attrs"
                  v-on="on"
                  fab
                  :loading="loading_watchlist"
                  :disabled="loading_watchlist"
                  @click="watchlistAction(!inWatchlist)"
              >
                <v-icon v-if="itemDetail.account_states.watchlist || inWatchlist" color="primary">
                  mdi-bookmark
                </v-icon>
                <v-icon v-else color="primary">
                  mdi-bookmark-outline
                </v-icon>
              </v-btn>
            </template>
            <span v-if="itemDetail.account_states"
                  v-text="itemDetail.account_states.watchlist ? 'Remove from watchlist' : 'Add to watchlist'"></span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  v-if="authorized"
                  v-bind="attrs"
                  v-on="on"
                  class="ma-2"
                  fab
                  :loading="loading_favorite"
                  :disabled="loading_favorite"
                  @click="favoriteAction(!inFavorites)"
              >
                <v-icon v-if="itemDetail.account_states.favorite || inFavorites" color="primary">
                  mdi-heart
                </v-icon>
                <v-icon v-else color="primary">
                  mdi-heart-outline
                </v-icon>
              </v-btn>
            </template>
            <span v-if="itemDetail.account_states"
                  v-text="itemDetail.account_states.favorite ? 'Remove from favorites' : 'Add to favorites'"></span>
          </v-tooltip>
          <v-row class="align-baseline" no-gutters>
            <h1>{{ itemDetail.name || itemDetail.title }}</h1>
            <span
                v-if="(itemDetail.name !== itemDetail.original_name) || (itemDetail.title !== itemDetail.original_title)"
                class="ml-2 mr-2 font-italic">({{ itemDetail.original_name || itemDetail.original_title }})</span>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="ml-2" color="primary" v-bind="attrs"
                        v-on="on" @click.stop="informationMore = true">mdi-information-outline
                </v-icon>
              </template>
              <span>More information</span>
            </v-tooltip>
            <v-dialog
                v-model="informationMore"
                max-width="800"
                scrollable
            >

              <v-card class="pa-3">
                <v-card-title class="primary--text">More information</v-card-title>
                <v-simple-table>

                  <tbody>

                  <tr v-if="itemDetail.production_countries.length > 0">
                    <td class="text-left ">Production
                      {{ itemDetail.production_countries.length > 1 ? "Countries" : "Country" }}
                    </td>
                    <td>
                        <v-chip class="ma-1" v-for="country in itemDetail.production_countries"
                                :key="country.iso_3166_1">
                          <v-avatar class="text-uppercase" v-if="$vuetify.breakpoint.mdAndUp" left
                                    :color="$vuetify.theme.dark ? 'grey darken-1' : 'grey lighten-3'">
                            {{ country.iso_3166_1 }}
                          </v-avatar>
                          {{ country.name }}
                        </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Spoken Language</td>
                    <td>
                      <v-chip class="ma-1" v-for="language in itemDetail.spoken_languages" :key='language.iso_639_1'>
                        <v-avatar :color="$vuetify.theme.dark ? 'grey darken-1' : 'grey lighten-3'" class="text-uppercase" left>{{language.iso_639_1}}</v-avatar>
                        {{ language.english_name }}
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Production companies</td>
                    <td>
                      <v-chip class="ma-1" v-for="company in itemDetail.production_companies" :key='company.id'>
                        <v-avatar :color="$vuetify.theme.dark ? 'grey darken-1' : 'grey lighten-3'" class="text-uppercase" left>
                          <v-img contain :src="`https://image.tmdb.org/t/p/w45/${company.logo_path}`"></v-img>
                        </v-avatar>
                        {{ company.name }}
                      </v-chip>
                    </td>
                  </tr>
                  <tr v-if="itemDetail.number_of_seasons">
                    <td>Number of seasons</td>
                    <td>{{ itemDetail.number_of_seasons }}</td>
                  </tr>
                  <tr v-if="itemDetail.number_of_episodes">
                    <td>Number of episodes</td>
                    <td>{{ itemDetail.number_of_episodes }}</td>
                  </tr>

                  </tbody>
                </v-simple-table>
              </v-card>
            </v-dialog>

          </v-row>

          <p class="text-justify" v-if="itemDetail.overview">{{ itemDetail.overview }}</p>
          <div class="d-block">
            <h2 class="subtitle-1 d-inline" v-if="itemDetail.first_air_date"><span class="font-weight-bold">{{
                new Date(itemDetail.first_air_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              }}</span><span class="font-weight-light" v-if="itemDetail.status"> ({{ itemDetail.status }})</span></h2>
            <h2 class="subtitle-1 d-inline" v-else-if="itemDetail.release_date"><span class="font-weight-bold">{{
                new Date(itemDetail.release_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              }}</span><span class="font-weight-light" v-if="itemDetail.status"> ({{ itemDetail.status }})</span></h2>
            <h2 class="subtitle-1 font-weight-light" v-else>(N/A)</h2>
          </div>
          <div class="mx-n1 py-2">
            <v-chip outlined class="ma-1" v-for="genre in itemDetail.genres" :key="genre.id"
                    :small="$vuetify.breakpoint.smAndDown"
            >{{ genre.name }}
            </v-chip>
          </div>
          <div class="mx-n1 py-2">
            <v-chip color="primary" v-if="media_type === 'movie'" class="ma-1">
              <v-icon left>
                mdi-movie-open
              </v-icon>
              Movie
            </v-chip>
            <v-chip color="primary" v-else>
              <v-icon left>
                mdi-television-classic
              </v-icon>
              TV Show
            </v-chip>
            <v-chip class="ma-1">
              <v-icon left>
                mdi-clock
              </v-icon>
              {{ getRuntime(itemDetail.runtime || itemDetail.episode_run_time[0]) }}
            </v-chip>
            <v-chip class="ma-1">
              <v-icon left :color="getColor(itemDetail.vote_average * 10 )">
                mdi-star-circle
              </v-icon>
              {{ itemDetail.vote_average }}
            </v-chip>
          </div>
          <v-btn class="mt-6" height="100" text="text"
                 :block="$vuetify.breakpoint.smAndDown" @click.stop="dialog = true">
            <div class="mx-n2">
              <v-avatar class="elevation-3 mx-2"
                        v-for="person in itemDetail.credits.cast.slice(0, $vuetify.breakpoint.smAndDown ? 3 : 6)"
                        :key="person.credit_id" :size="$vuetify.breakpoint.smAndDown ? 65 : 78">
                <v-img v-if="person.profile_path" :src="`https://image.tmdb.org/t/p/original/${person.profile_path}`"
                       aspect-ratio="1"
                       :lazy-src="`https://image.tmdb.org/t/p/original/${person.profile_path}`"></v-img>
                <span class="headline"
                      v-else>{{ person.name.split(" ")[0][0] }}{{ person.name.split(" ")[1][0] }}</span>
              </v-avatar>
              <v-avatar class="mx-2"
                        v-if="itemDetail.credits.cast.length - ($vuetify.breakpoint.smAndDown ? 3 : 6) &gt; 0"
                        :size="$vuetify.breakpoint.smAndDown ? 65 : 78"><span
                  class="title">+{{ itemDetail.credits.cast.length - ($vuetify.breakpoint.smAndDown ? 3 : 6) }}</span>
              </v-avatar>
            </div>
          </v-btn>
          <v-dialog
              v-model="dialog"
              max-width="500"
          >
            <v-card>
              <v-card-title class="text-h5">
                Cast
              </v-card-title>
              <v-list nav subheader>

                <v-list-item
                    v-for="person in itemDetail.credits.cast"
                    :key="person.credit_id"
                    link
                    :to='`/c/${person.id}`'
                >
                  <v-list-item-avatar>
                    <v-img v-if="person.profile_path"
                           :src="`https://image.tmdb.org/t/p/original/${person.profile_path}`"
                           aspect-ratio="1"
                           :lazy-src="`https://image.tmdb.org/t/p/original/${person.profile_path}`"></v-img>
                    <v-icon class="headline"
                            v-else>mdi-account
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="person.name"></v-list-item-title>
                    <v-list-item-subtitle v-text="`as ${person.character}`"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-dialog>
          <v-chip-group>
            <v-chip v-for="provider in providers" :key="provider.provider_id" link :to='`/w/${provider.provider_id}`'>
              <v-avatar left>
                <v-img :src="`https://image.tmdb.org/t/p/original/${provider.logo_path}`"></v-img>
              </v-avatar>
              {{ provider.provider_name }}
            </v-chip>
          </v-chip-group>
        </v-col>

      </v-row>
      <v-divider></v-divider>
    </v-container>
  </v-img>
</template>
<script>
import axios from "axios";

export default {
  name: 'Detail',
  data() {
    return {
      dialog: false,
      informationMore: false,
      watchTrailer: false,
      inWatchlist: null,
      inFavorites: null,
      loading_watchlist: false,
      loading_favorite: false,
      authorized: false,
    }
  },
  props: {
    providers: {},
    itemDetail: {},
    media_type: null
  },
  mounted() {
    if (localStorage.getItem('session_id')) {
      this.authorized = true
    }
  },
  methods: {
    getColor(vote) {
      if (vote > 70) {
        return '#0EF6BE'
      } else if (vote > 40) {
        return '#e4f368'
      } else {
        return '#f60e5f'
      }
    },
    getRuntime(time) {

      let hours = Math.floor(time / 60);
      let minutes = time % 60 < 10 ? ("0" + time % 60) : time % 60;
      return hours + " h " + minutes
    },
    watchlistAction(action) {
      this.loading_watchlist = true
      const account_id = localStorage.getItem('account_id')
      const headers = {
        'Content-Type': 'application/json'
      }
      axios
          .post(
              `https://api.themoviedb.org/3/account/${account_id}/watchlist`, {
                "media_type": this.media_type,
                "media_id": this.itemDetail.id,
                "watchlist": action
              }, {
                headers: headers,
                params: {
                  api_key: process.env.VUE_APP_API_KEY,
                  session_id: localStorage.getItem('session_id')
                }
              },
          )
          .then(response => {
            this.inWatchlist = !this.inWatchlist
            this.loading_watchlist = false
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    favoriteAction(action) {
      this.loading_favorite = true
      const account_id = localStorage.getItem('account_id')
      const headers = {
        'Content-Type': 'application/json'
      }
      axios
          .post(
              `https://api.themoviedb.org/3/account/${account_id}/favorite`, {
                "media_type": this.media_type,
                "media_id": this.itemDetail.id,
                "favorite": action
              }, {
                headers: headers,
                params: {
                  api_key: process.env.VUE_APP_API_KEY,
                  session_id: localStorage.getItem('session_id')
                }
              },
          )
          .then(response => {
            this.inFavorites = !this.inFavorites
            this.loading_favorite = false
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
    }
  }

}
</script>
<style>
tbody tr:hover {

  background-color: transparent !important;

}
</style>

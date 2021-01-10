<template>
  <div id="landing-page">
    <div class="search-wrapper">
      <v-container>
        <div class="text-md-h1 text-h4 title">Let the journey begin</div>
        <div class="pa-6 search-container">
          <v-radio-group v-model="journeyType" row>
            <v-radio label="One way" value="oneway"></v-radio>
            <v-radio label="Return" value="return"></v-radio>
          </v-radio-group>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="12" md="3" xs="12">
                  <v-combobox
                    v-model="form.from"
                    label="From"
                    :items="fromPlaceList"
                    background-color="#ffffff"
                    :search-input.sync="fromSearch"
                    hide-no-data
                    hide-selected
                    item-text="PlaceName"
                    item-value="PlaceId"
                    :rules="[(v) => !!v || 'Required field']"
                    outlined
                    required
                    return-object
                    clearable
                  ></v-combobox>
                </v-col>
                <v-col cols="12" md="3" xs="12">
                  <v-autocomplete
                    v-model="form.to"
                    label="To"
                    :items="toPlaceList"
                    background-color="#ffffff"
                    :search-input.sync="toSearch"
                    hide-no-data
                    hide-selected
                    item-text="PlaceName"
                    item-value="PlaceId"
                    :rules="[(v) => !!v || 'Required field']"
                    outlined
                    required
                    return-object
                    clearable
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="2" xs="12">
                  <v-menu
                    ref="fromDatePicker"
                    v-model="fromDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="computedDepartDate"
                        label="Depart"
                        outlined
                        background-color="#ffffff"
                        prepend-inner-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.departDate"
                      no-title
                      @input="fromDatePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="2" xs="12">
                  <v-menu
                    ref="toDatePicker"
                    v-model="toDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="computedArrivalDate"
                        label="Return"
                        outlined
                        background-color="#ffffff"
                        prepend-inner-icon="mdi-calendar"
                        v-bind="attrs"
                        :disabled="journeyType === 'oneway'"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.arrivalDate"
                      no-title
                      @input="toDatePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="2" xs="12">
                  <v-text-field
                    v-model="form.passengersCount"
                    label="Passengers"
                    background-color="#ffffff"
                    required
                    readonly
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <div class="btn-container">
              <v-btn
                color="#009688"
                class="btn"
                x-large
                @click="handleFlightSearch"
              >
                Search Flights
                <v-icon>mdi-arrow-right-thick</v-icon>
              </v-btn>
            </div>
          </v-form>
        </div>
      </v-container>
    </div>
    <v-container>
      <v-row>
        <v-col cols="12" md="4" xs="12">
          <info-tile
            title="Go anywhere"
            description="It’s your world and we’ll help you explore it. Find the best prices across millions of flights, hotels and car hire options to create your perfect trip."
          />
        </v-col>
        <v-col cols="12" md="4" xs="12">
          <info-tile
            title="Keep it simple"
            description="No hidden fees. No hidden charges. No funny business. With us, you'll always know exactly where your money goes. So you can relax before your trip even begins."
          />
        </v-col>
        <v-col cols="12" md="4" xs="12">
          <info-tile
            title="Travel your way"
            description="Know where you want to go? See the best time to book. Feeling flexible? Get deals on everything from quick breaks to epic adventures."
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import InfoTile from '@/components/info-tile'
import moment from 'moment'
import { format, parseISO } from 'date-fns'
export default {
  components: { InfoTile },
  data() {
    return {
      journeyType: 'oneway',
      form: {
        from: '',
        to: '',
        departDate: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
        arrivalDate: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
        passengersCount: 1,
      },
      fromSearch: null,
      toSearch: null,
      fromDatePicker: false,
      toDatePicker: false,
      fromPlaceList: [],
      toPlaceList: [],
    }
  },
  computed: {
    computedDepartDate() {
      return moment(this.form.departDate).format('DD-MM-YYYY')
    },
    computedArrivalDate() {
      const value =
        this.journeyType === 'oneway'
          ? 'One Way'
          : moment(this.form.arrivalDate).format('DD-MM-YYYY')
      return value
    },
  },
  watch: {
    fromSearch(val) {
      if (val && val.length >= 2) {
        this.fetchPlaces(val, 'fromPlaceList')
      } else {
        this.fromPlaceList = []
      }
    },
    toSearch(val) {
      if (val && val.length >= 2) {
        this.fetchPlaces(val, 'toPlaceList')
      } else {
        this.toPlaceList = []
      }
    },
    journeyType(val) {
      if (val === 'oneway') {
        this.form.arrivalDate = 'One Way'
      } else {
        this.form.arrivalDate = format(parseISO(new Date().toISOString()), 'yyyy-MM-dd')
      }
    },
  },
  methods: {
    async fetchPlaces(val, type) {
      const response = await this.$axios.get('autosuggest/v1.0/UK/GBP/en-GB/', {
        params: { query: val },
      })
      if (type === 'fromPlaceList') {
        this.fromPlaceList = response.data?.Places.filter(
          (item) => item.PlaceId !== this.form.to?.PlaceId
        )
      } else {
        this.toPlaceList = response.data?.Places.filter(
          (item) => item.PlaceId !== this.form.from?.PlaceId
        )
      }
    },
    handleFlightSearch() {
      if (this.$refs.form.validate()) {
        this.$router.push({
          name: 'flight-listing',
          params: { formData: this.form, tripType: this.journeyType },
        })
      } else {
        return false
      }
    },
  },
}
</script>
<style lang="less">
#landing-page {
  .search-wrapper {
    min-height: 550px;
    background: url('~assets/images/search-bg.jpeg') 50% 60% no-repeat;
    background-size: cover;
    padding: 0;
    display: flex;
    align-items: center;
    .title {
      color: #ffffff;
      padding-bottom: 2rem;
    }
    .search-container {
      background: #ffffffba;
      border-radius: 10px;
      .btn-container {
        display: flex;
        justify-content: flex-end;
        .btn {
          color: #ffffff;
        }
      }
    }
  }
}
</style>

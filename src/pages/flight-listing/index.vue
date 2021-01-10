<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="3" class=".d-none .d-sm-flex">
          <v-container>
            <v-card v-if="Object.keys(flightsList).length > 0" class="my-10">
              <v-card-title>
                <div class="text-md-h6">Popular filter</div>
              </v-card-title>
              <v-card-text>
                <div>
                  <v-switch
                    v-model="isDirect"
                    inset
                    label="Direct flights"
                    @change="handleDirectFlight"
                  ></v-switch>
                </div>
                <v-divider></v-divider>
                <div>
                  <div class="mt-5 mb-10">One Way Price</div>
                  <v-slider
                    thumb-label="always"
                    :min="getPriceRange[0]"
                    :max="getPriceRange[1]"
                    @change="handleSliderChange"
                  ></v-slider>
                </div>
                <v-divider v-if="tripType !== 'oneway'"></v-divider>
                <div v-if="tripType !== 'oneway'">
                  <div class="mt-5 mb-10">Return Price</div>
                  <v-slider
                    thumb-label="always"
                    :min="getReturnPriceRange[0]"
                    :max="getReturnPriceRange[1]"
                    @change="handleReturnFlightSlider"
                  ></v-slider>
                </div>
              </v-card-text>
            </v-card>
          </v-container>
        </v-col>
        <v-col cols="12" md="9" xs="12">
          <v-btn icon class="pl-10 d-flex d-sm-none" @click="handleBack">
            <v-icon>mdi-arrow-left</v-icon>Back
          </v-btn>
          <div v-if="Object.keys(flightsList).length > 0">
            <v-tabs
              v-if="dateRange > 0"
              v-model="formData.departDate"
              dark
              background-color="#02122c"
              show-arrows
              class="my-13"
              @change="handleTabChange"
            >
              <v-tabs-slider color="teal lighten-3"></v-tabs-slider>

              <v-tab
                v-for="i in dateRange"
                :key="i"
                :href="`#${moment().add(i, 'd').format('YYYY-MM-DD')}`"
              >
                {{ moment().add(i, 'd').format('DD MMM YYYY') }}
              </v-tab>
            </v-tabs>
            <flight-list
              v-if="Object.keys(flightsList).length > 0"
              :form-data="formData"
              :flights-list="filterdList"
            />
            <div v-if="tripType !== 'oneway'">
              <v-divider></v-divider>
              <div class="pt-10 text-md-h5 text-xs-body1">
                Return Flights Information returnFlightsList
              </div>
              <flight-list
                v-if="Object.keys(flightsList).length > 0"
                :form-data="formData"
                :flights-list="filterdReturnFlightList"
              />
            </div>
          </div>
          <div v-else>
            <v-card class="ma-10">
              <v-card-text>No Result found</v-card-text>
            </v-card>
          </div>
          <v-btn
            color="default"
            class="d-none d-sm-flex"
            medium
            @click="handleBack"
            >Back</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import FlightList from '@/components/flight-list'
import moment from 'moment'
import { format, parseISO } from 'date-fns'
export default {
  components: { FlightList },
  data() {
    return {
      formData: this.$route.params?.formData || {},
      tripType: this.$route.params?.tripType || 'oneway',
      flightsList: {},
      filterdList: {},
      returnFlightsList: {},
      filterdReturnFlightList: {},
      isDirect: true,
      dateRange: 0,
      moment,
    }
  },
  computed: {
    getPriceRange() {
      const minVal = this.flightsList?.Quotes[0]?.MinPrice
      const maxVal = this.flightsList?.Quotes[
        this.flightsList.Quotes.length - 1
      ]?.MinPrice
      return [minVal, maxVal]
    },
    getReturnPriceRange() {
      console.log('returnFlight', this.returnFlightsList)
      const minVal =
        Object.keys(this.returnFlightsList).length > 0 &&
        this.returnFlightsList.Quotes[0]?.MinPrice
      const maxVal =
        Object.keys(this.returnFlightsList).length > 0 &&
        this.returnFlightsList.Quotes[this.returnFlightsList?.Quotes.length - 1]
          ?.MinPrice
      return [minVal, maxVal]
    },
  },
  mounted() {
    const today = format(parseISO(new Date().toISOString()), 'yyyy-MM-dd')
    const a = moment(this.formData.departDate)
    const b = moment(this.formData.arrivalDate)
    const range =
      this.tripType === 'oneway' ? a.diff(today, 'days') : b.diff(today, 'days')
    this.dateRange = range
    if (this.tripType !== 'oneway') {
      this.fetchReturnFlights()
    }
    this.fetchRoutes()
  },
  methods: {
    async fetchRoutes() {
      const response = await this.$axios.get(
        `browseroutes/v1.0/US/USD/en-US/${this.formData.from.PlaceId}/${this.formData.to.PlaceId}/${this.formData.departDate}`,
        {
          params: { inboundpartialdate: this.formData.arrivalDate },
        }
      )
      this.flightsList = response.data
      this.filterdList = response.data
    },
    async fetchReturnFlights() {
      const response = await this.$axios.get(
        `browseroutes/v1.0/US/USD/en-US/${this.formData.to.PlaceId}/${this.formData.from.PlaceId}/${this.formData.arrivalDate}`,
        {
          params: { inboundpartialdate: this.formData.departDate },
        }
      )
      this.returnFlightsList = response.data
      this.filterdReturnFlightList = response.data
    },
    handleBack() {
      this.$router.push('/')
    },
    handleDirectFlight(val) {
      const sortedFlightsList = this.flightsList.Quotes.filter(
        (e) => e.Direct === val
      )
      const sortedReturnFlightsList =
        this.tripType !== 'oneway' &&
        this.returnFlightsList.Quotes.filter((e) => e.Direct === val)
      this.filterdList = {
        ...this.flightsList,
        Quotes: sortedFlightsList,
      }
      this.filterdReturnFlightList = {
        ...this.returnFlightsList,
        Quotes: sortedReturnFlightsList,
      }
    },
    handleSliderChange(val) {
      const sortedList = this.flightsList.Quotes.filter(
        (e) => e.MinPrice >= val
      )
      this.filterdList = {
        ...this.flightsList,
        Quotes: sortedList,
      }
    },
    handleReturnFlightSlider(val) {
      const sortedList = this.returnFlightsList.Quotes.filter(
        (e) => e.MinPrice >= val
      )
      this.filterdReturnFlightList = {
        ...this.returnFlightsList,
        Quotes: sortedList,
      }
    },
    handleTabChange(val) {
      this.formData = {
        ...this.formData,
        departDate: val,
      }
      this.fetchRoutes()
    },
  },
}
</script>

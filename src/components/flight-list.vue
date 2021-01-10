<template>
  <v-container id="flight-list">
    <div
      v-for="(item, index) in flightsList.Quotes"
      :key="item.QuoteId"
      class="my-10 px-6 py-6 flight-list-container"
    >
      <span class="low-price-flight" v-if="index == 0">Chepest</span>
      <v-row v-for="id in item.OutboundLeg.CarrierIds" :key="id">
        <v-col cols="12" md="2" xs="2" align-self="center">
          <div>
            <img src="~assets/images/carrier-logo.png" width="20px" />
            {{ fetchReleventName(id, 'Carriers', 'CarrierId').Name }}
          </div>
        </v-col>
        <v-col cols="12" md="7" align-self="center">
          <v-row>
            <v-col
              cols="12"
              md="4"
              xs="4"
              class="d-flex align-center text-md-h6 text-xs-body1"
            >
              {{
                fetchReleventName(
                  item.OutboundLeg.OriginId,
                  'Places',
                  'PlaceId'
                ).Name
              }}
            </v-col>
            <v-col cols="12" md="4" xs="4" align-self="center">
              <div class="d-flex d-sm-none veritcal-divider">
                <v-divider vertical></v-divider>
              </div>
              <div class="d-none d-sm-flex">
                <v-divider></v-divider>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
              xs="4"
              class="d-flex align-center text-md-h6 text-xs-body1"
            >
              {{
                fetchReleventName(
                  item.OutboundLeg.DestinationId,
                  'Places',
                  'PlaceId'
                ).Name
              }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3" align-self="center">
          <div>
            <span class="pa-5">
              {{ flightsList.Currencies[0].Code }}
              {{ item.MinPrice }}
            </span>
            <v-btn color="primary" small>Book</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
export default {
  props: {
    formData: {
      type: Object,
      required: true,
    },
    flightsList: {
      type: Object,
      required: true,
    },
  },
  methods: {
    fetchReleventName(id, objType, idType) {
      return this.flightsList[objType].find((e) => e[idType] === id)
    },
  },
}
</script>
<style lang="less">
#flight-list {
  .flight-list-container {
    position: relative;
    background: lightblue;
    border-radius: 10px;
    .v-divider {
      border-width: 2px;
    }
    .flight-type {
      text-align: center;
      font-size: 0.6rem;
      display: block;
    }
    .veritcal-divider {
      height: 40px;
      justify-content: center;
    }
    .align-center {
      justify-content: center;
    }
    .low-price-flight {
      height: 30px;
      background: linear-gradient(to right, rgb(0, 138, 222), rgb(0, 82, 186));
      border-radius: 4rem;
      position: absolute;
      top: -1rem;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      color: #ffffff;
    }
  }
}
</style>

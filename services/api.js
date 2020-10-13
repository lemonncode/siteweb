export default axios => ({
  accountTrips: {
    cget (params) {
      if (params.csv) {
        return axios.get(`company-accounts/${params.account}/trips.csv`, { params })
      }
      return axios.get(`company-accounts/${params.account}/trips`, { params })
    },
  }
})
